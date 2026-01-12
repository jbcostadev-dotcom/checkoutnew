import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Conversion {
  label: string;
  rate: number;
  completed: number;
  total: number;
}

interface ConversionsSectionProps {
  isDark: boolean;
}

function CircularProgress({ rate, label, completed, total }: { rate: number; label: string; completed: number; total: number }) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (rate / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <svg width="120" height="120" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className="text-neutral-700"
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="text-blue-500 transition-all"
          transform="rotate(-90 60 60)"
        />
        <text
          x="60"
          y="65"
          textAnchor="middle"
          className="text-white text-xl font-bold fill-current"
        >
          {rate.toFixed(1)}%
        </text>
      </svg>
      <p className="text-white text-sm font-semibold mt-3">{label}</p>
      <p className="text-gray-400 text-xs">
        {completed} / {total}
      </p>
    </div>
  );
}

export function ConversionsSection({ isDark }: ConversionsSectionProps) {
  const [conversions, setConversions] = useState<Conversion[]>([]);

  useEffect(() => {
    const fetchConversions = async () => {
      const { data } = await supabase
        .from('conversion_data')
        .select('*');

      if (data) {
        setConversions(data.map(d => ({
          label: d.label,
          rate: d.conversion_rate,
          completed: d.completed,
          total: d.total
        })));
      }
    };

    fetchConversions();
  }, []);

  const paymentConversions = conversions.filter(c => !c.label.includes('Mobile') && !c.label.includes('Desktop'));
  const deviceConversions = conversions.filter(c => c.label.includes('Mobile') || c.label.includes('Desktop'));

  return (
    <div className="space-y-6">
      <div className={`${isDark ? 'bg-neutral-800' : 'bg-gray-800'} rounded-lg p-6`}>
        <h3 className="text-white text-lg font-bold mb-6">Conversões Por meios de pagamento</h3>
        <div className="flex justify-around items-end gap-4">
          {paymentConversions.map((conv, idx) => (
            <CircularProgress
              key={idx}
              rate={conv.rate}
              label={conv.label}
              completed={conv.completed}
              total={conv.total}
            />
          ))}
        </div>
      </div>

      <div className={`${isDark ? 'bg-neutral-800' : 'bg-gray-800'} rounded-lg p-6`}>
        <h3 className="text-white text-lg font-bold mb-6">Por dispositivos</h3>
        <div className="flex justify-around items-end gap-4">
          {deviceConversions.map((conv, idx) => (
            <CircularProgress
              key={idx}
              rate={conv.rate}
              label={conv.label}
              completed={conv.completed}
              total={conv.total}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
