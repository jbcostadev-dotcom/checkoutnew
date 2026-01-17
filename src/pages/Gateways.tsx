import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { motion } from "framer-motion";
import { CreditCard, Plus, Settings, ToggleRight, ToggleLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const gateways = [
  {
    name: "Stripe",
    description: "Processamento global de cartões",
    status: "active",
    transactions: "R$ 45.230,00",
    icon: "💳",
  },
  {
    name: "Mercado Pago",
    description: "Pix e boleto bancário",
    status: "active",
    transactions: "R$ 24.900,00",
    icon: "🟢",
  },
  {
    name: "PagSeguro",
    description: "Múltiplos métodos de pagamento",
    status: "inactive",
    transactions: "R$ 0,00",
    icon: "🟡",
  },
  {
    name: "PayPal",
    description: "Pagamentos internacionais",
    status: "active",
    transactions: "R$ 8.800,00",
    icon: "🔵",
  },
];

const Gateways = () => {
  return (
    <DashboardLayout title="Gateways">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex justify-between items-center"
      >
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Provedores de Pagamento
          </h2>
          <p className="text-sm text-muted-foreground">
            Gerencie suas integrações com gateways
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Gateway
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {gateways.map((gateway, index) => (
          <motion.div
            key={gateway.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -2 }}
            className="bg-card rounded-xl p-5 shadow-card hover:shadow-card-hover transition-all border border-border/50"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-2xl">
                  {gateway.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    {gateway.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {gateway.description}
                  </p>
                </div>
              </div>
              {gateway.status === "active" ? (
                <ToggleRight className="w-8 h-8 text-success" />
              ) : (
                <ToggleLeft className="w-8 h-8 text-muted-foreground" />
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div>
                <p className="text-xs text-muted-foreground">Total processado</p>
                <p className="font-semibold text-foreground">
                  {gateway.transactions}
                </p>
              </div>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Gateways;
