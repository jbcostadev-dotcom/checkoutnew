import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";

const Auth = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nomeLoja, setNomeLoja] = useState("");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginSenha, setLoginSenha] = useState("");

  const cadastrar = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          email,
          senha,
          nome_loja: nomeLoja,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        toast({ title: "Cadastro realizado", description: "Conta criada com sucesso" });
        setNome("");
        setEmail("");
        setSenha("");
        setNomeLoja("");
      } else {
        toast({ title: "Erro no cadastro", description: data.error || "Verifique os dados" });
      }
    } catch (e: any) {
      toast({ title: "Erro de conexão", description: e.message });
    }
  };

  const entrar = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginEmail,
          senha: loginSenha,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        toast({ title: "Login efetuado", description: `Bem-vindo, ${data.user.nome}` });
        setLoginEmail("");
        setLoginSenha("");
      } else {
        toast({ title: "Erro no login", description: data.error || "Credenciais inválidas" });
      }
    } catch (e: any) {
      toast({ title: "Erro de conexão", description: e.message });
    }
  };

  return (
    <DashboardLayout title="Autenticação">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Tabs defaultValue="login" className="max-w-xl">
          <TabsList className="mb-4">
            <TabsTrigger value="login">Entrar</TabsTrigger>
            <TabsTrigger value="cadastro">Cadastrar</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="login-email">E-mail</Label>
              <Input id="login-email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="login-senha">Senha</Label>
              <Input id="login-senha" type="password" value={loginSenha} onChange={(e) => setLoginSenha(e.target.value)} />
            </div>
            <Button onClick={entrar}>Entrar</Button>
          </TabsContent>

          <TabsContent value="cadastro" className="space-y-3">
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
            <div className="space-y-1">
              <Label htmlFor="senha">Senha</Label>
              <Input id="senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="nome-loja">Nome da loja</Label>
              <Input id="nome-loja" value={nomeLoja} onChange={(e) => setNomeLoja(e.target.value)} />
            </div>
            <Button onClick={cadastrar}>Cadastrar</Button>
          </TabsContent>
        </Tabs>
      </motion.div>
    </DashboardLayout>
  );
};

export default Auth;
