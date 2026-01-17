import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Transacoes from "./pages/Transacoes";
import Gateways from "./pages/Gateways";
import Checkout from "./pages/Checkout";
import Clientes from "./pages/Clientes";
import Produtos from "./pages/Produtos";
import Configuracoes from "./pages/Configuracoes";
import Aplicativos from "./pages/Aplicativos";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import NotFound from "./pages/NotFound";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import { StoresProvider } from "./hooks/useStores";

const queryClient = new QueryClient();

function RequireAuth({ children }: { children: JSX.Element }) {
  const { token } = useAuth();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <StoresProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/cadastro" element={<Cadastro />} />

              <Route path="/" element={<RequireAuth><Index /></RequireAuth>} />
              <Route path="/transacoes" element={<RequireAuth><Transacoes /></RequireAuth>} />
              <Route path="/gateways" element={<RequireAuth><Gateways /></RequireAuth>} />
              <Route path="/checkout" element={<RequireAuth><Checkout /></RequireAuth>} />
              <Route path="/clientes" element={<RequireAuth><Clientes /></RequireAuth>} />
              <Route path="/produtos" element={<RequireAuth><Produtos /></RequireAuth>} />
              <Route path="/configuracoes" element={<RequireAuth><Configuracoes /></RequireAuth>} />
              <Route path="/aplicativos" element={<RequireAuth><Aplicativos /></RequireAuth>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </StoresProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
