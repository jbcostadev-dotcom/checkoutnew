import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { TransactionsTable } from "@/components/dashboard/TransactionsTable";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { PaymentMethods } from "@/components/dashboard/PaymentMethods";
import {
  DollarSign,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";

const Index = () => {
  return (
    <DashboardLayout title="Dashboard">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="Total Recebido"
          value="R$ 78.930,00"
          change="+12.5%"
          changeType="positive"
          icon={DollarSign}
          variant="primary"
          delay={0}
        />
        <MetricCard
          title="Pagamentos Aprovados"
          value="1.284"
          change="+8.2%"
          changeType="positive"
          icon={CheckCircle2}
          variant="success"
          delay={1}
        />
        <MetricCard
          title="Pagamentos Pendentes"
          value="156"
          change="-3.1%"
          changeType="neutral"
          icon={Clock}
          variant="warning"
          delay={2}
        />
        <MetricCard
          title="Pagamentos Falhos"
          value="23"
          change="-15.4%"
          changeType="positive"
          icon={XCircle}
          variant="danger"
          delay={3}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <PaymentMethods />
      </div>

      {/* Transactions Table */}
      <TransactionsTable />
    </DashboardLayout>
  );
};

export default Index;
