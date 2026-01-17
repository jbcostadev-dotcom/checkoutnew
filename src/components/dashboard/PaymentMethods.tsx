import { motion } from "framer-motion";
import { CreditCard, QrCode, Barcode } from "lucide-react";
import { cn } from "@/lib/utils";

const methods = [
  {
    name: "Cartão de Crédito",
    icon: CreditCard,
    percentage: 58,
    value: "R$ 45.230,00",
    color: "bg-primary",
  },
  {
    name: "Pix",
    icon: QrCode,
    percentage: 32,
    value: "R$ 24.900,00",
    color: "bg-success",
  },
  {
    name: "Boleto",
    icon: Barcode,
    percentage: 10,
    value: "R$ 7.800,00",
    color: "bg-warning",
  },
];

export function PaymentMethods() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.4 }}
      className="bg-card rounded-xl p-5 shadow-card border border-border/50"
    >
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-foreground">
          Métodos de Pagamento
        </h3>
        <p className="text-sm text-muted-foreground mt-0.5">
          Distribuição por método
        </p>
      </div>

      <div className="space-y-4">
        {methods.map((method, index) => {
          const Icon = method.icon;
          return (
            <motion.div
              key={method.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="group"
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className={cn(
                    "w-9 h-9 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105",
                    method.color
                  )}
                >
                  <Icon className="w-4 h-4 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground text-sm">
                      {method.name}
                    </span>
                    <span className="text-sm font-semibold text-foreground">
                      {method.value}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${method.percentage}%` }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
                    className={cn("h-full rounded-full", method.color)}
                  />
                </div>
                <span className="text-xs font-medium text-muted-foreground w-10 text-right">
                  {method.percentage}%
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
