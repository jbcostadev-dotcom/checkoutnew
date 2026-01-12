import { Monitor, Smartphone, Tablet } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Device {
  name: string;
  percentage: number;
  revenue: number;
  icon: React.ReactNode;
}

interface DeviceSectionProps {
  isDark: boolean;
}

export function DeviceSection({ isDark }: DeviceSectionProps) {
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    const fetchDevices = async () => {
      const { data: transactions } = await supabase
        .from('transactions')
        .select('device_type, amount');

      if (transactions) {
        const deviceData: Record<string, { amount: number; count: number }> = {
          desktop: { amount: 0, count: 0 },
          mobile: { amount: 0, count: 0 },
          tablet: { amount: 0, count: 0 }
        };

        transactions.forEach(t => {
          const device = t.device_type.toLowerCase();
          if (deviceData[device]) {
            deviceData[device].amount += t.amount;
            deviceData[device].count += 1;
          }
        });

        const total = Object.values(deviceData).reduce((sum, d) => sum + d.amount, 0);
        const icons = {
          desktop: <Monitor size={24} className="text-blue-400" />,
          mobile: <Smartphone size={24} className="text-purple-400" />,
          tablet: <Tablet size={24} className="text-orange-400" />
        };

        const deviceList = Object.entries(deviceData)
          .filter(([, data]) => data.count > 0)
          .map(([device, data]) => ({
            name: device,
            percentage: total > 0 ? (data.amount / total) * 100 : 0,
            revenue: data.amount,
            icon: icons[device as keyof typeof icons]
          }));

        setDevices(deviceList);
      }
    };

    fetchDevices();
  }, []);

  return (
    <div className={`${isDark ? 'bg-neutral-800' : 'bg-gray-800'} rounded-lg p-6`}>
      <h3 className="text-white text-lg font-bold mb-6">Pagamento por dispositivos</h3>

      <div className="space-y-4">
        {devices.map((device, idx) => (
          <div key={idx} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded flex items-center justify-center ${
                isDark ? 'bg-neutral-700' : 'bg-gray-700'
              }`}>
                {device.icon}
              </div>
              <div className="flex-1">
                <p className="text-white text-sm font-medium mb-1">{device.name}</p>
                <div className="w-24 h-1 bg-blue-500 rounded"></div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-sm">{device.percentage.toFixed(0)}%</p>
              <p className="text-white font-semibold">R${device.revenue.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
