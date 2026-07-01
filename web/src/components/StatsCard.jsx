import React from 'react';

export default function StatsCard({ title, value, icon, color }) {
  return (
    <div className={`${color} rounded-2xl shadow-lg p-6 space-y-3 border border-line/40`}>
      <div className="flex items-center justify-between">
        <h3 className="font-body font-semibold text-xs uppercase tracking-wider opacity-80">{title}</h3>
        <span className="text-3xl">{icon}</span>
      </div>
      <p className="font-mono text-4xl font-bold">{value}</p>
    </div>
  );
}
