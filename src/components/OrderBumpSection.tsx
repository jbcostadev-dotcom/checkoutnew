import { Flame, TrendingUp } from 'lucide-react';

interface OrderBumpSectionProps {
  isDark: boolean;
}

export function OrderBumpSection({ isDark }: OrderBumpSectionProps) {
  const items = [
    {
      title: 'Order Bump',
      icon: Flame,
      conversions: 5,
      earnings: 882.60
    },
    {
      title: 'Upsell',
      icon: TrendingUp,
      conversions: 5,
      earnings: 882.60
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-6">
      {items.map((item, idx) => (
        <div key={idx} className={`${isDark ? 'bg-neutral-800' : 'bg-gray-800'} rounded-lg p-6`}>
          <h3 className="text-white text-lg font-bold mb-6">{item.title}</h3>

          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              isDark ? 'bg-neutral-700' : 'bg-gray-700'
            }`}>
              <item.icon size={32} className={idx === 0 ? 'text-orange-400' : 'text-purple-400'} />
            </div>

            <div className="flex-1">
              <div className="flex justify-between mb-2">
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-300'}`}>conversões</p>
                <p className="text-white font-bold">{item.conversions}</p>
              </div>

              <div className="flex justify-between">
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-300'}`}>ganhos</p>
                <p className="text-white font-bold">R${item.earnings.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
