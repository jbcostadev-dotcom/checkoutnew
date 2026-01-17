interface MetricCardProps {
  label: string;
  value: string;
  isDark: boolean;
}

export function MetricCard({ label, value, isDark }: MetricCardProps) {
  return (
    <div className={`${isDark ? 'bg-neutral-800' : 'bg-gray-800'} rounded-lg p-6`}>
      <p className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-300'}`}>
        {label}
      </p>
      <p className="text-white text-2xl font-bold">{value}</p>
    </div>
  );
}
