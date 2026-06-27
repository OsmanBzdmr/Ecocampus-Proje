/**
 * better-sqlite3'ün API yüzeyini (exec/prepare/get/all/run/pragma) taklit
 * eden, hafızada (in-memory) çalışan basit bir SQL yorumlayıcısı.
 *
 * Sandbox ortamında better-sqlite3 native modülü derlenemediği için
 * (node-gyp, nodejs.org header dosyalarına erişemiyor) testler gerçek
 * SQLite yerine bunu kullanır. Uygulama kodu hiç değişmez: `config/db`
 * modülü test ortamında bu mock ile değiştirilir (bkz. jest.config.js
 * moduleNameMapper).
 *
 * Kapsam: backend/controllers ve backend/db/schema.js içinde kullanılan
 * SQL deyimleriyle sınırlıdır (genel amaçlı bir SQL motoru DEĞİLDİR).
 */

function createMockDb() {
  let tables = {};
  let autoIncrement = {};

  function ensureTable(name) {
    if (!tables[name]) {
      tables[name] = [];
      autoIncrement[name] = 1;
    }
    return tables[name];
  }

  function cloneRow(row) {
    return row ? { ...row } : row;
  }

  // ---- WHERE değerlendirme ----
  // Desteklenen örüntüler: "field = ?", "field LIKE ?",
  // "(field LIKE ? OR field2 LIKE ?)" ve bunların " AND " ile birleşimi.
  function evaluateWhere(whereSql, params) {
    if (!whereSql) return () => true;

    const topLevelConditions = whereSql.split(/\s+AND\s+/i);
    let paramIndex = 0;
    const checks = [];

    for (const rawCond of topLevelConditions) {
      const cond = rawCond.trim();

      const orMatch = cond.match(/^\((.+)\)$/);
      if (orMatch) {
        const orParts = orMatch[1].split(/\s+OR\s+/i);
        const orChecks = orParts.map((part) => {
          const check = buildSingleCheck(part.trim(), paramIndex);
          if (part.includes('?')) paramIndex++;
          return check;
        });
        checks.push((row) => orChecks.some((fn) => fn(row)));
        continue;
      }

      const check = buildSingleCheck(cond, paramIndex);
      if (cond.includes('?')) paramIndex++;
      checks.push(check);
    }

    function hasParam(p) { return p.includes('?'); }

    function buildSingleCheck(part, idx) {
      // Literal değer karşılaştırmaları (soru işareti yerine sayı)
      const gtLit = part.match(/^(\w+)\s*>\s*(\d+(?:\.\d+)?)$/);
      if (gtLit) return (row) => Number(row[gtLit[1]]) > Number(gtLit[2]);
      const ltLit = part.match(/^(\w+)\s*<\s*(\d+(?:\.\d+)?)$/);
      if (ltLit) return (row) => Number(row[ltLit[1]]) < Number(ltLit[2]);
      const gteLit = part.match(/^(\w+)\s*>=\s*(\d+(?:\.\d+)?)$/);
      if (gteLit) return (row) => Number(row[gteLit[1]]) >= Number(gteLit[2]);
      const lteLit = part.match(/^(\w+)\s*<=\s*(\d+(?:\.\d+)?)$/);
      if (lteLit) return (row) => Number(row[lteLit[1]]) <= Number(lteLit[2]);
      const eqLit = part.match(/^(\w+)\s*=\s*(\d+(?:\.\d+)?)$/);
      if (eqLit) return (row) => Number(row[eqLit[1]]) === Number(eqLit[2]);

      // Parametreli karşılaştırmalar
      const likeMatch = part.match(/^(\w+)\s+I?LIKE\s+\?$/i);
      if (likeMatch) {
        const field = likeMatch[1];
        const value = String(params[idx] ?? '').replace(/%/g, '').toLowerCase();
        return (row) => String(row[field] ?? '').toLowerCase().includes(value);
      }
      const gteMatch = part.match(/^(\w+)\s*>=\s*\?$/);
      if (gteMatch) {
        const field = gteMatch[1];
        const value = Number(params[idx]);
        return (row) => Number(row[field]) >= value;
      }
      const lteMatch = part.match(/^(\w+)\s*<=\s*\?$/);
      if (lteMatch) {
        const field = lteMatch[1];
        const value = Number(params[idx]);
        return (row) => Number(row[field]) <= value;
      }
      const eqMatch = part.match(/^(\w+)\s*=\s*\?$/);
      if (eqMatch) {
        const field = eqMatch[1];
        return (row) => row[field] == params[idx];
      }
      throw new Error(`mockDb: desteklenmeyen WHERE koşulu: "${part}"`);
    }

    return (row) => checks.every((fn) => fn(row));
  }

  function countWhereParams(whereSql) {
    if (!whereSql) return 0;
    return (whereSql.match(/\?/g) || []).length;
  }

  function parseSelect(sql) {
    // JOIN'li sorgular için: SELECT ... FROM t1 JOIN t2 ON ... WHERE ...
    const joinMatch = sql.match(
      /^SELECT (.+?) FROM (\w+)\s+JOIN\s+\w+\s+ON\s+.+?(?: WHERE (.+?))?(?: ORDER BY (.+?))?(?: (LIMIT \? OFFSET \?))?$/i
    );
    if (joinMatch) {
      const [, colsRaw, table, whereSql, orderBy, limitClause] = joinMatch;
      return { colsRaw: colsRaw.trim(), table, whereSql, orderBy, hasLimit: !!limitClause };
    }
    const m = sql.match(
      /^SELECT (.+?) FROM (\w+)(?:\s+\w+)?(?: WHERE (.+?))?(?: ORDER BY (.+?))?(?: (LIMIT \? OFFSET \?))?$/i
    );
    if (!m) throw new Error(`mockDb: ayrıştırılamayan SELECT: "${sql}"`);
    const [, colsRaw, table, whereSql, orderBy, limitClause] = m;
    return { colsRaw: colsRaw.trim(), table, whereSql, orderBy, hasLimit: !!limitClause };
  }

  function project(row, colsRaw) {
    if (colsRaw === '*') return cloneRow(row);
    if (/^COUNT\(\*\)\s+as\s+cnt$/i.test(colsRaw)) return undefined; // ayrı ele alınır
    const cols = colsRaw.split(',').map((c) => c.trim());
    if (cols.includes('*')) return cloneRow(row);
    const out = {};
    cols.forEach((c) => {
      const asMatch = c.match(/^(\w+)\s+as\s+(\w+)$/i);
      if (asMatch) {
        out[asMatch[2]] = row[asMatch[1]];
      } else {
        out[c] = row[c];
      }
    });
    return out;
  }

  function statement(sql) {
    const trimmed = sql.trim().replace(/\s+/g, ' ');

    return {
      get(...params) {
        return this.all(...params)[0];
      },
      all(...params) {
        // COUNT(*) sorguları
        const countMatch = trimmed.match(
          /^SELECT COUNT\(\*\) as cnt FROM (\w+)(?: WHERE (.+))?$/i
        );
        if (countMatch) {
          const [, table, whereSql] = countMatch;
          const rows = ensureTable(table);
          const matcher = evaluateWhere(whereSql, params);
          const cnt = rows.filter(matcher).length;
          return [{ cnt }];
        }

        if (/^SELECT /i.test(trimmed)) {
          const { colsRaw, table, whereSql, orderBy, hasLimit } = parseSelect(trimmed);
          const rows = ensureTable(table);
          const whereParamCount = countWhereParams(whereSql);
          const whereParams = params.slice(0, whereParamCount);
          const matcher = evaluateWhere(whereSql, whereParams);

          let result = rows.filter(matcher).map(cloneRow);

          if (orderBy) {
            const [field, dir] = orderBy.trim().split(/\s+/);
            const sign = /desc/i.test(dir || '') ? -1 : 1;
            result.sort((a, b) => (a[field] > b[field] ? sign : a[field] < b[field] ? -sign : 0));
          }

          if (hasLimit) {
            const limit = Number(params[whereParamCount]);
            const offset = Number(params[whereParamCount + 1]);
            result = result.slice(offset, offset + limit);
          }

          return result.map((row) => project(row, colsRaw));
        }

        throw new Error(`mockDb: desteklenmeyen sorgu (all/get): "${trimmed}"`);
      },
      run(...params) {
        const insertMatch = trimmed.match(/^INSERT INTO (\w+) \(([^)]+)\) VALUES \(([^)]+)\)$/i);
        if (insertMatch) {
          const [, table, colsRaw] = insertMatch;
          const cols = colsRaw.split(',').map((c) => c.trim());
          const rows = ensureTable(table);
          const id = autoIncrement[table]++;
          const row = { id };
          cols.forEach((c, i) => {
            row[c] = params[i];
          });
          rows.push(row);
          return { lastInsertRowid: id, changes: 1 };
        }

        const updateMatch = trimmed.match(/^UPDATE (\w+) SET (.+) WHERE id = \?$/i);
        if (updateMatch) {
          const [, table, setRaw] = updateMatch;
          const cols = setRaw.split(',').map((c) => c.trim().match(/^(\w+)\s*=\s*\?$/)[1]);
          const rows = ensureTable(table);
          const id = params[params.length - 1];
          const values = params.slice(0, params.length - 1);
          const row = rows.find((r) => r.id == id);
          if (row) {
            cols.forEach((c, i) => {
              row[c] = values[i];
            });
            return { changes: 1 };
          }
          return { changes: 0 };
        }

        const deleteMatch = trimmed.match(/^DELETE FROM (\w+) WHERE id = \?$/i);
        if (deleteMatch) {
          const [, table] = deleteMatch;
          const rows = ensureTable(table);
          const id = params[0];
          const idx = rows.findIndex((r) => r.id == id);
          if (idx !== -1) {
            rows.splice(idx, 1);
            return { changes: 1 };
          }
          return { changes: 0 };
        }

        throw new Error(`mockDb: desteklenmeyen sorgu (run): "${trimmed}"`);
      },
    };
  }

  // pg parametre stilini ($1, $2) soru işaretine çevirir, RETURNING ve ::type cast'leri ayıklar
  function pgToSqlite(sql) {
    const noReturns = sql.replace(/\s+RETURNING\s+.+$/i, '');
    const noCast = noReturns.replace(/::\w+/g, '');
    const noJoins = noCast.replace(/\s+JOIN\s+\w+\s+\w+\s+ON\s+[\w.=\s]+?(?=\s+JOIN|\s+WHERE|\s+ORDER\s+BY|\s+LIMIT|$)/gi, ' ');
    const noAliases = noJoins.replace(/(\w+)\.(\*|\w+)/g, '$2');
    return noAliases.replace(/\$\d+/g, () => '?');
  }

  function hasReturning(sql) {
    return /\s+RETURNING\s+/i.test(sql);
  }

  function extractReturningCols(sql) {
    const m = sql.match(/\s+RETURNING\s+(.+)$/i);
    return m ? m[1].split(',').map((c) => c.trim()) : null;
  }

  return {
    exec(sql) {
      // CREATE TABLE IF NOT EXISTS <name> (...) deyimlerini ayrıştırıp
      // ilgili tabloyu (boş bir dizi olarak) kaydeder; gerçek sütun
      // tipleri/kısıtları mock için önemli değildir.
      const statements = sql.split(';');
      statements.forEach((s) => {
        const createMatch = s.match(/CREATE TABLE IF NOT EXISTS (\w+)/i);
        if (createMatch) ensureTable(createMatch[1]);
      });
    },
    pragma() {
      // no-op
    },
    prepare(sql) {
      return statement(sql);
    },
    /** pg-style async query metodu — mock'u controller'lardaki db.query() çağrılarıyla uyumlu kılar */
    async query(sql, params = []) {
      const sqliteSql = pgToSqlite(sql);

      // DDL (CREATE TABLE / ALTER TABLE) — exec'e yönlendir
      if (/CREATE\s+TABLE/i.test(sqliteSql.trim())) {
        this.exec(sqliteSql);
        return { rows: [], rowCount: 0 };
      }
      if (/ALTER\s+TABLE/i.test(sqliteSql.trim())) {
        const alterMatch = sqliteSql.trim().match(/ALTER\s+TABLE\s+(\w+)\s+ADD\s+COLUMN\s+(?:IF\s+NOT\s+EXISTS\s+)?(\w+)/i);
        if (alterMatch) {
          const [, tableName, colName] = alterMatch;
          ensureTable(tableName);
        }
        return { rows: [], rowCount: 0 };
      }

      const stmt = statement(sqliteSql);
      const returningCols = extractReturningCols(sql);

      if (/^SELECT/i.test(sqliteSql.trim())) {
        const rows = stmt.all(...params).map((r) => {
          // RETURNING * olan SELECT'ler için tüm kolonları döndür
          return r;
        });
        return { rows, rowCount: rows.length };
      }

      // INSERT, UPDATE, DELETE
      const result = stmt.run(...params);

      if (hasReturning(sql) && returningCols) {
        const tableMatch = sqliteSql.match(/INSERT INTO (\w+)/i) || sqliteSql.match(/(?:UPDATE|DELETE)\s+(\w+)/i);
        if (tableMatch) {
          const tableName = tableMatch[1];
          const rows = ensureTable(tableName);
          // UPDATE/DELETE için WHERE id = ?'den id değerini bul
          const idMatch = sqliteSql.match(/WHERE id = \?$/i);
          const targetRow = idMatch
            ? rows.find(r => r.id == params[params.length - 1])
            : rows[rows.length - 1];
          const row = targetRow || {};
          if (returningCols.length === 1 && returningCols[0] === '*') {
            return { rows: [row], rowCount: 1 };
          }
          const projected = {};
          returningCols.forEach((c) => {
            projected[c] = row[c];
          });
          return { rows: [projected], rowCount: 1 };
        }
      }

      return { rows: [], rowCount: result.changes || 0 };
    },
    close() {
      // no-op
    },
    /** Test yardımcı fonksiyonu: tüm tabloları sıfırlar (gerçek better-sqlite3 API'sinde yoktur). */
    __reset() {
      tables = {};
      autoIncrement = {};
    },
  };
}

module.exports = { createMockDb };
