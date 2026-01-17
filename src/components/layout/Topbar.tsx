import { motion } from "framer-motion";
import { Menu, Search, Bell, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import StoreSelector from "@/components/StoreSelector";

interface TopbarProps {
  title: string;
  onMenuClick: () => void;
  isMobile: boolean;
}

export function Topbar({ title, onMenuClick, isMobile }: TopbarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const displayName = user?.nome || "Usuário";
  const avatarSeed = user?.email || "user";

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-30 h-16 bg-card/80 backdrop-blur-md border-b border-border flex items-center justify-between px-4 lg:px-6"
    >
      <div className="flex items-center gap-4">
        {isMobile && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-accent transition-colors"
          >
            <Menu className="w-5 h-5 text-muted-foreground" />
          </motion.button>
        )}
        <h1 className="text-lg lg:text-xl font-semibold text-foreground">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <StoreSelector />
        {/* Search - hidden on mobile */}
        <div className="hidden md:flex relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar..."
            className="pl-9 w-64 bg-secondary/50 border-0 focus-visible:ring-1 focus-visible:ring-primary/30"
          />
        </div>

        {/* Notifications */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-2 rounded-lg hover:bg-accent transition-colors"
        >
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
        </motion.button>

        {/* User Menu (somente quando logado) */}
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-3 p-1.5 pr-3 rounded-full hover:bg-accent transition-colors"
              >
                <Avatar className="w-8 h-8 border-2 border-primary/20">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(avatarSeed)}`} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {displayName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden lg:block text-sm font-medium text-foreground">
                  {displayName}
                </span>
              </motion.button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Perfil
              </DropdownMenuItem>
              <DropdownMenuItem>Configurações</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
              >
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </motion.header>
  );
}
