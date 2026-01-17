import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  variant: "primary" | "success" | "warning" | "danger";
  delay?: number;
}

const variantStyles = {
  primary: {
    bg: "bg-primary/10",
    iconBg: "gradient-primary",
    text: "text-primary",
  },
  success: {
    bg: "bg-success/10",
    iconBg: "gradient-success",
    text: "text-success",
  },
  warning: {
    bg: "bg-warning/10",
    iconBg: "gradient-warning",
    text: "text-warning",
  },
  danger: {
    bg: "bg-destructive/10",
    iconBg: "gradient-danger",
    text: "text-destructive",
  },
};

export function MetricCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  variant,
  delay = 0,
}: MetricCardProps) {
  const styles = variantStyles[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1, duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-card rounded-xl p-5 shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer border border-border/50"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-1">
            {title}
          </p>
          <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
            {value}
          </h3>
          {change && (
            <div className="flex items-center gap-1">
              <span
                className={cn(
                  "text-xs font-medium",
                  changeType === "positive" && "text-success",
                  changeType === "negative" && "text-destructive",
                  changeType === "neutral" && "text-muted-foreground"
                )}
              >
                {change}
              </span>
              <span className="text-xs text-muted-foreground">vs último mês</span>
            </div>
          )}
        </div>
        <div
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center",
            styles.iconBg
          )}
        >
          <Icon className="w-6 h-6 text-primary-foreground" />
        </div>
      </div>
    </motion.div>
  );
}
