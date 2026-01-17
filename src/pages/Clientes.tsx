import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { motion } from "framer-motion";
import { Search, Filter, MoreHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const customers = [
  {
    id: 1,
    name: "João Silva",
    email: "joao@email.com",
    totalSpent: "R$ 5.430,00",
    orders: 12,
    lastOrder: "12 Jan 2026",
  },
  {
    id: 2,
    name: "Maria Santos",
    email: "maria@email.com",
    totalSpent: "R$ 3.210,00",
    orders: 8,
    lastOrder: "11 Jan 2026",
  },
  {
    id: 3,
    name: "Pedro Costa",
    email: "pedro@email.com",
    totalSpent: "R$ 12.890,00",
    orders: 24,
    lastOrder: "10 Jan 2026",
  },
  {
    id: 4,
    name: "Ana Oliveira",
    email: "ana@email.com",
    totalSpent: "R$ 890,00",
    orders: 3,
    lastOrder: "09 Jan 2026",
  },
  {
    id: 5,
    name: "Carlos Lima",
    email: "carlos@email.com",
    totalSpent: "R$ 7.650,00",
    orders: 15,
    lastOrder: "08 Jan 2026",
  },
];

const Clientes = () => {
  return (
    <DashboardLayout title="Clientes">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar cliente..."
              className="pl-9 bg-card border-border"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filtrar
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-xl shadow-card border border-border/50 overflow-hidden"
      >
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs uppercase text-muted-foreground font-medium">
                  Cliente
                </TableHead>
                <TableHead className="text-xs uppercase text-muted-foreground font-medium">
                  Total Gasto
                </TableHead>
                <TableHead className="text-xs uppercase text-muted-foreground font-medium">
                  Pedidos
                </TableHead>
                <TableHead className="text-xs uppercase text-muted-foreground font-medium">
                  Último Pedido
                </TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer, index) => (
                <motion.tr
                  key={customer.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                  className="group hover:bg-accent/50 transition-colors"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-9 h-9">
                        <AvatarImage
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${customer.name}`}
                        />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {customer.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground">
                          {customer.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {customer.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold text-foreground">
                    {customer.totalSpent}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {customer.orders}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {customer.lastOrder}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-border">
          {customers.map((customer, index) => (
            <motion.div
              key={customer.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              className="p-4 hover:bg-accent/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${customer.name}`}
                  />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {customer.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-foreground">{customer.name}</p>
                  <p className="text-xs text-muted-foreground">{customer.email}</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div>
                  <span className="text-muted-foreground">
                    {customer.orders} pedidos
                  </span>
                </div>
                <span className="font-bold text-foreground">
                  {customer.totalSpent}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Clientes;
