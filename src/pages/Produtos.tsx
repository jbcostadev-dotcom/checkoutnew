import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { motion } from "framer-motion";
import { Search, Plus, MoreHorizontal, Package } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const products = [
  {
    id: 1,
    name: "Curso de Marketing Digital",
    price: "R$ 297,00",
    category: "Curso",
    sales: 234,
    status: "active",
  },
  {
    id: 2,
    name: "E-book Vendas Online",
    price: "R$ 47,00",
    category: "E-book",
    sales: 567,
    status: "active",
  },
  {
    id: 3,
    name: "Mentoria Individual",
    price: "R$ 1.997,00",
    category: "Mentoria",
    sales: 45,
    status: "active",
  },
  {
    id: 4,
    name: "Workshop Intensivo",
    price: "R$ 497,00",
    category: "Workshop",
    sales: 89,
    status: "draft",
  },
];

const Produtos = () => {
  return (
    <DashboardLayout title="Produtos">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar produto..."
              className="pl-9 bg-card border-border"
            />
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Novo Produto
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4 }}
            className="bg-card rounded-xl p-5 shadow-card border border-border/50 hover:shadow-card-hover transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Package className="w-6 h-6 text-primary" />
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold text-foreground mb-1">
                {product.name}
              </h3>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{product.category}</Badge>
                <Badge
                  variant={product.status === "active" ? "success" : "secondary"}
                >
                  {product.status === "active" ? "Ativo" : "Rascunho"}
                </Badge>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {product.price}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-foreground">
                  {product.sales}
                </p>
                <p className="text-xs text-muted-foreground">vendas</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Produtos;
