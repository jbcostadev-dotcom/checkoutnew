import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, Navigate } from "react-router-dom";
import { useState } from "react";

const Login = () => {
  const { login, token } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    const ok = await login(email, senha);
    setLoading(false);
    if (ok) {
      toast({ title: "Login efetuado" });
      navigate("/");
    } else {
      toast({ title: "Erro no login", description: "Verifique suas credenciais" });
    }
  };

  if (token) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-card">
        <h1 className="text-lg font-semibold mb-4 text-foreground">Entrar</h1>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="senha">Senha</Label>
            <Input id="senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} />
          </div>
          <Button className="w-full" onClick={submit} disabled={loading}>{loading ? "Entrando..." : "Entrar"}</Button>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
