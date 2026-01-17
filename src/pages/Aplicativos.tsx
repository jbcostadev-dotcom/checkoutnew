import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { motion } from "framer-motion";
import { Search, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { useStores } from "@/hooks/useStores";

const apps = [
  {
    name: "Google Analytics",
    description: "Acompanhe métricas e comportamento dos usuários",
    icon: "📊",
    category: "Analytics",
    connected: true,
  },
  {
    name: "Shopify",
    description: "Sincronize produtos da sua loja",
    icon: "🛍️",
    category: "E-commerce",
    connected: false,
  },
  {
    name: "Mailchimp",
    description: "Automação de email marketing",
    icon: "📧",
    category: "Marketing",
    connected: true,
  },
  {
    name: "Zapier",
    description: "Conecte com milhares de aplicativos",
    icon: "⚡",
    category: "Automação",
    connected: false,
  },
  {
    name: "Slack",
    description: "Receba notificações em tempo real",
    icon: "💬",
    category: "Comunicação",
    connected: false,
  },
  {
    name: "HubSpot",
    description: "CRM e gestão de leads",
    icon: "🎯",
    category: "CRM",
    connected: false,
  },
  {
    name: "Notion",
    description: "Documentação e base de conhecimento",
    icon: "📝",
    category: "Produtividade",
    connected: true,
  },
];

const Aplicativos = () => {
  const { selectedStore } = useStores();
  const [shopUrl, setShopUrl] = useState("");
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [syncing, setSyncing] = useState(false);

  const handleSaveShopify = async () => {
    try {
      if (!selectedStore?.id) {
        toast({ title: "Selecione uma loja", description: "Escolha a loja no topo" });
        return;
      }
      const res = await fetch("http://localhost:4000/api/shopify/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_loja: selectedStore.id,
          url_shopify: shopUrl,
          api_key: clientId,
          client_secret: clientSecret,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        toast({ title: "Configuração salva", description: "Dados da Shopify armazenados" });
      } else {
        toast({ title: "Erro ao salvar", description: data.error || "Tente novamente" });
      }
    } catch (e: any) {
      toast({ title: "Erro de conexão", description: e.message });
    }
  };
  const handleSyncProducts = async () => {
    try {
      if (!selectedStore?.id) {
        toast({ title: "Selecione uma loja", description: "Escolha a loja no topo" });
        return;
      }
      setSyncing(true);
      const res = await fetch("http://localhost:4000/api/shopify/sync/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_loja: selectedStore.id }),
      });
      const data = await res.json();
      setSyncing(false);
      if (data.ok) {
        toast({ title: "Sincronização concluída", description: `Produtos importados: ${data.total}` });
      } else {
        toast({ title: "Erro ao sincronizar", description: data.error || "Verifique suas credenciais" });
      }
    } catch (e: any) {
      setSyncing(false);
      toast({ title: "Erro de conexão", description: e.message });
    }
  };
  useEffect(() => {
    const load = async () => {
      if (!selectedStore?.id) return;
      const r = await fetch(`http://localhost:4000/api/shopify/config/${selectedStore.id}`);
      const d = await r.json();
      if (d.ok && d.config) {
        setShopUrl(d.config.url_shopify || "");
        setClientId(d.config.api_key || "");
        setClientSecret(d.config.client_secret || "");
      } else {
        setShopUrl("");
        setClientId("");
        setClientSecret("");
      }
    };
    load();
  }, [selectedStore?.id]);
  return (
    <DashboardLayout title="Aplicativos">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Integrações
            </h2>
            <p className="text-sm text-muted-foreground">
              Conecte seu painel com outras ferramentas
            </p>
          </div>
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar aplicativo..."
              className="pl-9 bg-card border-border"
            />
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {apps.map((app, index) => (
          <motion.div
            key={app.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4 }}
            className="bg-card rounded-xl p-5 shadow-card border border-border/50 hover:shadow-card-hover transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-2xl">
                {app.icon}
              </div>
              <Badge variant={app.connected ? "success" : "secondary"}>
                {app.connected ? "Conectado" : "Disponível"}
              </Badge>
            </div>

            <h3 className="font-semibold text-foreground mb-1">{app.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {app.description}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <Badge variant="outline">{app.category}</Badge>
              {app.name === "Shopify" ? (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm">
                      Configurar
                      <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Shopify {selectedStore ? `• ${selectedStore.nome_loja}` : ""}</DialogTitle>
                      <DialogDescription>
                        Configure abaixo os dados da aplicação
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="rounded-xl border border-border p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="text-sm font-medium text-foreground">
                              Produto
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-muted-foreground">Sincronize os produtos da sua Shopify</p>
                            <Button variant="outline" size="sm" onClick={handleSyncProducts} disabled={syncing}>
                              {syncing ? "Sincronizando..." : "Sincronizar"}
                            </Button>
                          </div>
                        </div>
                        <div className="rounded-xl border border-border p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="text-sm font-medium text-foreground">
                              Tema
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Última Sincronia: --
                          </p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <Label htmlFor="shop-url">URL da loja Shopify *</Label>
                          <Input
                            id="shop-url"
                            placeholder="minhaloja.myshopify.com"
                            value={shopUrl}
                            onChange={(e) => setShopUrl(e.target.value)}
                          />
                          <p className="text-xs text-muted-foreground">
                            A URL não pode conter os seguintes valores: www., https://, http://, /, .br
                          </p>
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="client-id">
                            API Key (Client ID) *
                          </Label>
                          <Input
                            id="client-id"
                            placeholder="Client ID"
                            value={clientId}
                            onChange={(e) => setClientId(e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="client-secret">Client Secret *</Label>
                          <Input
                            id="client-secret"
                            type="password"
                            placeholder="Client Secret"
                            value={clientSecret}
                            onChange={(e) => setClientSecret(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="secondary">Cancelar</Button>
                      </DialogClose>
                      <Button onClick={handleSaveShopify}>Salvar</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              ) : (
                <Button variant="ghost" size="sm">
                  {app.connected ? "Configurar" : "Conectar"}
                  <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Aplicativos;
