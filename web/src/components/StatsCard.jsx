export default function StatsCard({ title, value, icon, color }) {
  return (
    <div className={`${color} rounded-2xl shadow-lg p-6 space-y-3`}>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm uppercase tracking-wide opacity-80">{title}</h3>
        <span className="text-3xl">{icon}</span>
      </div>
      <p className="text-4xl font-bold">{value}</p>
    </div>
  );
}
