import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { motion } from "framer-motion";
import {
  User,
  Bell,
  Shield,
  CreditCard,
  Globe,
  Palette,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const settingSections = [
  {
    title: "Conta",
    items: [
      {
        icon: User,
        label: "Perfil",
        description: "Gerencie suas informações pessoais",
      },
      {
        icon: Bell,
        label: "Notificações",
        description: "Configure alertas e notificações",
      },
      {
        icon: Shield,
        label: "Segurança",
        description: "Senhas e autenticação em duas etapas",
      },
    ],
  },
  {
    title: "Pagamentos",
    items: [
      {
        icon: CreditCard,
        label: "Métodos de Pagamento",
        description: "Gerencie formas de recebimento",
      },
      {
        icon: Globe,
        label: "Taxas e Câmbio",
        description: "Configure taxas e conversão",
      },
    ],
  },
  {
    title: "Aparência",
    items: [
      {
        icon: Palette,
        label: "Tema e Cores",
        description: "Personalize a aparência do painel",
      },
    ],
  },
];

const Configuracoes = () => {
  return (
    <DashboardLayout title="Configurações">
      <div className="max-w-3xl">
        {settingSections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sectionIndex * 0.1 }}
            className="mb-8"
          >
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              {section.title}
            </h2>
            <div className="bg-card rounded-xl shadow-card border border-border/50 overflow-hidden divide-y divide-border">
              {section.items.map((item, itemIndex) => {
                const Icon = item.icon;
                return (
                  <motion.button
                    key={item.label}
                    whileHover={{ x: 4 }}
                    className="w-full flex items-center gap-4 p-4 hover:bg-accent/50 transition-colors text-left"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{item.label}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Configuracoes;
