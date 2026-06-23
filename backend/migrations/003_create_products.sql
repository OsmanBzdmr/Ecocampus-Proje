CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  price NUMERIC(10,2) DEFAULT 0,
  description TEXT,
  image_url TEXT,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  category_id INTEGER REFERENCES categories(id),
  created_at TIMESTAMP DEFAULT NOW()
);
