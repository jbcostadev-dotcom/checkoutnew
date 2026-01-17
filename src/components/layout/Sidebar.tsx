import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  ArrowLeftRight,
  CreditCard,
  ShoppingCart,
  Users,
  Package,
  Settings,
  Grid3X3,
  ChevronLeft,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: ArrowLeftRight, label: "Transações", path: "/transacoes" },
  { icon: CreditCard, label: "Gateways", path: "/gateways" },
  { icon: ShoppingCart, label: "Checkout", path: "/checkout" },
  { icon: Users, label: "Clientes", path: "/clientes" },
  { icon: Package, label: "Produtos", path: "/produtos" },
  { icon: Settings, label: "Configurações", path: "/configuracoes" },
  { icon: Grid3X3, label: "Aplicativos", path: "/aplicativos" },
];

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  isMobile: boolean;
}

export function Sidebar({ isOpen, onToggle, isMobile }: SidebarProps) {
  const location = useLocation();

  const sidebarVariants = {
    open: {
      width: isMobile ? "100%" : 260,
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] as const },
    },
    closed: {
      width: isMobile ? 0 : 80,
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] as const },
    },
  };

  const itemVariants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: -10 },
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      <motion.aside
        variants={sidebarVariants}
        initial={false}
        animate={isOpen ? "open" : "closed"}
        className={cn(
          "fixed left-0 top-0 h-screen bg-sidebar z-50 flex flex-col overflow-hidden",
          isMobile && !isOpen && "pointer-events-none"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
          <AnimatePresence mode="wait">
            {isOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-semibold text-lg text-sidebar-foreground">
                  PayAdmin
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {!isMobile && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onToggle}
              className={cn(
                "p-2 rounded-lg hover:bg-sidebar-accent transition-colors",
                !isOpen && "mx-auto"
              )}
            >
              <ChevronLeft
                className={cn(
                  "w-5 h-5 text-sidebar-muted transition-transform duration-300",
                  !isOpen && "rotate-180"
                )}
              />
            </motion.button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;

              return (
                <motion.li
                  key={item.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={item.path}
                    onClick={() => isMobile && onToggle()}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-foreground"
                        : "text-sidebar-muted hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                    )}
                  >
                    <div
                      className={cn(
                        "flex items-center justify-center w-9 h-9 rounded-lg transition-colors",
                        isActive
                          ? "gradient-primary"
                          : "bg-sidebar-accent group-hover:bg-sidebar-primary/20"
                      )}
                    >
                      <Icon
                        className={cn(
                          "w-5 h-5 transition-colors",
                          isActive
                            ? "text-primary-foreground"
                            : "text-sidebar-muted group-hover:text-sidebar-foreground"
                        )}
                      />
                    </div>
                    <AnimatePresence mode="wait">
                      {isOpen && (
                        <motion.span
                          variants={itemVariants}
                          initial="closed"
                          animate="open"
                          exit="closed"
                          className="font-medium text-sm whitespace-nowrap"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {isActive && isOpen && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                      />
                    )}
                  </Link>
                </motion.li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border">
          <AnimatePresence mode="wait">
            {isOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xs text-sidebar-muted text-center"
              >
                © 2026 PayAdmin
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.aside>
    </>
  );
}
