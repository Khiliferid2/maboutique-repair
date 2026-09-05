export default function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: "blue" | "orange" | "green" | "red";
}) {
  const bg = {
    blue: "bg-blue",
    orange: "bg-orange",
    green: "bg-green",
    red: "bg-red",
  }[color];

  return (
    <div className={`${bg} rounded-card p-5 text-white`}>
      <div className="font-display text-2xl font-bold">{value}</div>
      <div className="text-xs opacity-90 mt-1">{label}</div>
    </div>
  );
}
