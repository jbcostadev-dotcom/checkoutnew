import { motion } from "framer-motion";
import { MoreHorizontal, ArrowUpRight, ArrowDownRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Transaction {
  id: string;
  customer: string;
  email: string;
  amount: string;
  status: "approved" | "pending" | "failed";
  date: string;
  method: string;
}

const mockTransactions: Transaction[] = [
  {
    id: "#TRX-001",
    customer: "João Silva",
    email: "joao@email.com",
    amount: "R$ 1.299,00",
    status: "approved",
    date: "12 Jan 2026",
    method: "Cartão de Crédito",
  },
  {
    id: "#TRX-002",
    customer: "Maria Santos",
    email: "maria@email.com",
    amount: "R$ 459,90",
    status: "pending",
    date: "12 Jan 2026",
    method: "Pix",
  },
  {
    id: "#TRX-003",
    customer: "Pedro Costa",
    email: "pedro@email.com",
    amount: "R$ 2.150,00",
    status: "approved",
    date: "11 Jan 2026",
    method: "Cartão de Crédito",
  },
  {
    id: "#TRX-004",
    customer: "Ana Oliveira",
    email: "ana@email.com",
    amount: "R$ 89,90",
    status: "failed",
    date: "11 Jan 2026",
    method: "Boleto",
  },
  {
    id: "#TRX-005",
    customer: "Carlos Lima",
    email: "carlos@email.com",
    amount: "R$ 750,00",
    status: "approved",
    date: "10 Jan 2026",
    method: "Pix",
  },
];

const statusConfig = {
  approved: {
    label: "Aprovado",
    variant: "success" as const,
    icon: ArrowUpRight,
  },
  pending: {
    label: "Pendente",
    variant: "warning" as const,
    icon: Clock,
  },
  failed: {
    label: "Falhou",
    variant: "destructive" as const,
    icon: ArrowDownRight,
  },
};

export function TransactionsTable() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      className="bg-card rounded-xl shadow-card border border-border/50 overflow-hidden"
    >
      <div className="p-5 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Transações Recentes
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              Últimas 5 transações realizadas
            </p>
          </div>
          <Button variant="outline" size="sm">
            Ver todas
          </Button>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs uppercase text-muted-foreground font-medium">
                ID
              </TableHead>
              <TableHead className="text-xs uppercase text-muted-foreground font-medium">
                Cliente
              </TableHead>
              <TableHead className="text-xs uppercase text-muted-foreground font-medium">
                Método
              </TableHead>
              <TableHead className="text-xs uppercase text-muted-foreground font-medium">
                Valor
              </TableHead>
              <TableHead className="text-xs uppercase text-muted-foreground font-medium">
                Status
              </TableHead>
              <TableHead className="text-xs uppercase text-muted-foreground font-medium">
                Data
              </TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockTransactions.map((transaction, index) => {
              const status = statusConfig[transaction.status];
              const StatusIcon = status.icon;

              return (
                <motion.tr
                  key={transaction.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className="group hover:bg-accent/50 transition-colors"
                >
                  <TableCell className="font-medium text-foreground">
                    {transaction.id}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">
                        {transaction.customer}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {transaction.email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {transaction.method}
                  </TableCell>
                  <TableCell className="font-semibold text-foreground">
                    {transaction.amount}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={status.variant}
                      className="gap-1 font-medium"
                    >
                      <StatusIcon className="w-3 h-3" />
                      {status.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {transaction.date}
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
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden divide-y divide-border">
        {mockTransactions.map((transaction, index) => {
          const status = statusConfig[transaction.status];
          const StatusIcon = status.icon;

          return (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.05 }}
              className="p-4 hover:bg-accent/30 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-foreground">
                    {transaction.customer}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {transaction.email}
                  </p>
                </div>
                <Badge variant={status.variant} className="gap-1 font-medium">
                  <StatusIcon className="w-3 h-3" />
                  {status.label}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div>
                  <span className="text-muted-foreground">{transaction.id}</span>
                  <span className="mx-2 text-border">•</span>
                  <span className="text-muted-foreground">{transaction.method}</span>
                </div>
                <span className="font-bold text-foreground">
                  {transaction.amount}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {transaction.date}
              </p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
