import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { motion } from "framer-motion";
import { ShoppingCart, Eye, Copy, ExternalLink, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const checkouts = [
  {
    id: "CHK-001",
    name: "Checkout Principal",
    url: "pay.example.com/checkout",
    status: "active",
    conversions: "4.2%",
    views: 1234,
  },
  {
    id: "CHK-002",
    name: "Checkout Black Friday",
    url: "pay.example.com/black-friday",
    status: "active",
    conversions: "6.8%",
    views: 890,
  },
  {
    id: "CHK-003",
    name: "Checkout Teste A/B",
    url: "pay.example.com/test-ab",
    status: "draft",
    conversions: "0%",
    views: 0,
  },
];

const Checkout = () => {
  return (
    <DashboardLayout title="Checkout">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex justify-between items-center"
      >
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Páginas de Checkout
          </h2>
          <p className="text-sm text-muted-foreground">
            Configure e personalize suas páginas de pagamento
          </p>
        </div>
        <Button>
          <ShoppingCart className="w-4 h-4 mr-2" />
          Novo Checkout
        </Button>
      </motion.div>

      <div className="space-y-4">
        {checkouts.map((checkout, index) => (
          <motion.div
            key={checkout.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card rounded-xl p-5 shadow-card border border-border/50 hover:shadow-card-hover transition-all"
          >
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-foreground">
                    {checkout.name}
                  </h3>
                  <Badge
                    variant={checkout.status === "active" ? "success" : "secondary"}
                  >
                    {checkout.status === "active" ? "Ativo" : "Rascunho"}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{checkout.url}</span>
                  <button className="hover:text-foreground transition-colors">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">
                    {checkout.conversions}
                  </p>
                  <p className="text-xs text-muted-foreground">Conversão</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">
                    {checkout.views.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">Views</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <ExternalLink className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Checkout;
