import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, Navigate } from "react-router-dom";
import { useState } from "react";

const Cadastro = () => {
  const { register, token } = useAuth();
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nomeLoja, setNomeLoja] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    const ok = await register(nome, email, senha, nomeLoja);
    setLoading(false);
    if (ok) {
      toast({ title: "Cadastro realizado" });
      navigate("/");
    } else {
      toast({ title: "Erro no cadastro", description: "Verifique os dados" });
    }
  };

  if (token) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-xl rounded-xl border border-border bg-card p-6 shadow-card">
        <h1 className="text-lg font-semibold mb-4 text-foreground">Cadastrar</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="nome">Nome</Label>
            <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </div>
        <div className="space-y-1 mt-3">
          <Label htmlFor="senha">Senha</Label>
          <Input id="senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} />
        </div>
        <div className="space-y-1 mt-3">
          <Label htmlFor="nome-loja">Nome da loja</Label>
          <Input id="nome-loja" value={nomeLoja} onChange={(e) => setNomeLoja(e.target.value)} />
        </div>
        <Button className="mt-4 w-full" onClick={submit} disabled={loading}>{loading ? "Cadastrando..." : "Cadastrar"}</Button>
      </motion.div>
    </div>
  );
};

export default Cadastro;
