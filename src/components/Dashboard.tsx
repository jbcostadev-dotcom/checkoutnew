import { Eye, Settings, Bell, ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { MetricCard } from './MetricCard';
import { LineChart, PieChart } from './Charts';
import { PaymentMethodsSection } from './PaymentMethodsSection';
import { DeviceSection } from './DeviceSection';
import { TopProductsSection } from './TopProductsSection';
import { ConversionsSection } from './ConversionsSection';
import { OrderBumpSection } from './OrderBumpSection';

interface DashboardProps {
  isDark: boolean;
}

interface Metrics {
  totalRevenue: number;
  approvedTransactions: number;
  avgTicket: number;
  chargebacks: number;
}

export function Dashboard({ isDark }: DashboardProps) {
  const [metrics, setMetrics] = useState<Metrics>({
    totalRevenue: 0,
    approvedTransactions: 0,
    avgTicket: 0,
    chargebacks: 0
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      const { data: transactions } = await supabase
        .from('transactions')
        .select('amount, status, chargeback');

      if (transactions) {
        const approved = transactions.filter(t => t.status === 'approved');
        const totalRevenue = approved.reduce((sum, t) => sum + t.amount, 0);
        const chargebackCount = transactions.filter(t => t.chargeback).length;

        setMetrics({
          totalRevenue,
          approvedTransactions: approved.length,
          avgTicket: approved.length > 0 ? totalRevenue / approved.length : 0,
          chargebacks: chargebackCount
        });
      }
    };

    fetchMetrics();
  }, []);

  return (
    <div className={`flex-1 ${isDark ? 'bg-neutral-950' : 'bg-gray-900'} overflow-y-auto`}>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-white text-3xl font-bold">Faturamento</h1>
            <p className={`text-sm mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              Jet Sports
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white bg-opacity-10 rounded-full px-4 py-2">
              <Eye size={18} className="text-white" />
            </div>

            <div className="flex gap-2">
              <button className="bg-white bg-opacity-10 rounded-full px-3 py-2 flex items-center gap-2 text-white hover:bg-opacity-20 transition">
                <span className="text-sm">Faturamento</span>
              </button>
              <button className={`${isDark ? 'bg-neutral-800' : 'bg-gray-800'} rounded-full px-3 py-2 flex items-center gap-2 text-gray-400 hover:text-white transition`}>
                <span className="text-sm">Marketing</span>
              </button>
            </div>

            <div className="flex items-center gap-1 text-gray-400 text-sm">
              <span>De</span>
              <button className="hover:text-white transition">seg, 8 mai 23</button>
              <span>Até</span>
              <button className="hover:text-white transition">sex, 12 mai 23</button>
            </div>

            <button className="text-gray-400 hover:text-white transition">
              <Settings size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8">
          <MetricCard
            label="Faturamento"
            value={`R$${metrics.totalRevenue.toFixed(2)}`}
            isDark={isDark}
          />
          <MetricCard
            label="Transações aprovadas"
            value={metrics.approvedTransactions.toString()}
            isDark={isDark}
          />
          <MetricCard
            label="Ticket médio"
            value={`R$${metrics.avgTicket.toFixed(2)}`}
            isDark={isDark}
          />
          <MetricCard
            label="Total em chargebacks"
            value={`R$${metrics.chargebacks.toFixed(2)}`}
            isDark={isDark}
          />
        </div>

        <div className="mb-6">
          <button className={`text-sm font-medium px-4 py-2 rounded ${
            isDark
              ? 'bg-neutral-800 text-gray-400'
              : 'bg-gray-800 text-gray-300'
          } hover:opacity-80 transition`}>
            Detalhes
            <span className={`float-right text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
              última atualização: 15h32
            </span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <LineChart isDark={isDark} />
          <PieChart isDark={isDark} />
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <PaymentMethodsSection isDark={isDark} />
          <DeviceSection isDark={isDark} />
        </div>

        <div className="mb-8">
          <TopProductsSection isDark={isDark} />
        </div>

        <div className="mb-8">
          <ConversionsSection isDark={isDark} />
        </div>

        <div className="mb-8">
          <OrderBumpSection isDark={isDark} />
        </div>
      </div>
    </div>
  );
}
