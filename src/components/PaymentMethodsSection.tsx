import { CreditCard, Smartphone, FileText } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface PaymentMethod {
  name: string;
  percentage: number;
  revenue: number;
  icon: React.ReactNode;
}

interface PaymentMethodsProps {
  isDark: boolean;
}

export function PaymentMethodsSection({ isDark }: PaymentMethodsProps) {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      const { data } = await supabase
        .from('payment_methods')
        .select('*')
        .order('revenue', { ascending: false });

      if (data) {
        const icons = {
          cartão: <CreditCard size={24} className="text-blue-400" />,
          pix: <Smartphone size={24} className="text-teal-400" />,
          boleto: <FileText size={24} className="text-purple-400" />
        };

        setMethods(data.map(m => ({
          name: m.name,
          percentage: m.percentage,
          revenue: m.revenue,
          icon: icons[m.name as keyof typeof icons]
        })));
      }
    };

    fetchPaymentMethods();
  }, []);

  return (
    <div className={`${isDark ? 'bg-neutral-800' : 'bg-gray-800'} rounded-lg p-6`}>
      <h3 className="text-white text-lg font-bold mb-6">Meios de pagamento</h3>

      <div className="space-y-4">
        {methods.map((method, idx) => (
          <div key={idx} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded flex items-center justify-center ${
                isDark ? 'bg-neutral-700' : 'bg-gray-700'
              }`}>
                {method.icon}
              </div>
              <div className="flex-1">
                <p className="text-white text-sm font-medium mb-1">{method.name}</p>
                <div className="w-24 h-1 bg-blue-500 rounded"></div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-sm">{method.percentage}%</p>
              <p className="text-white font-semibold">R${method.revenue.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
