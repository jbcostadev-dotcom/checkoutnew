import { useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useStores } from "@/hooks/useStores";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export default function StoreSelector() {
  const { stores, selectedStore, setSelectedStoreId, refresh } = useStores();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [nomeLoja, setNomeLoja] = useState("");

  if (!stores.length) return null;

  const label = selectedStore?.nome_loja || "Selecione a loja";
  const initials = label.slice(0, 2).toUpperCase();

  return (
    <>
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="inline-flex items-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 rounded-md justify-between px-1"
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-haspopup="dialog"
        >
          <div className="flex items-center">
            <span className="relative flex shrink-0 overflow-hidden h-8 w-8 rounded-lg mr-2">
              <span className="flex h-full w-full items-center justify-center bg-muted rounded-lg">{initials}</span>
            </span>
            {label}
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevrons-up-down size-5 opacity-50">
            <path d="m7 15 5 5 5-5"></path>
            <path d="m7 9 5-5 5 5"></path>
          </svg>
        </button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-72">
        <Command>
          <CommandInput placeholder="Buscar loja..." />
          <CommandEmpty>Nenhuma loja encontrada</CommandEmpty>
          <CommandList>
            <CommandGroup>
              {stores.map((s) => (
                <CommandItem
                  key={s.id}
                  onSelect={() => {
                    setSelectedStoreId(s.id);
                    setOpen(false);
                  }}
                >
                  <span className="relative flex shrink-0 overflow-hidden h-6 w-6 rounded-lg mr-2">
                    <span className="flex h-full w-full items-center justify-center bg-muted rounded-lg">
                      {s.nome_loja.slice(0, 2).toUpperCase()}
                    </span>
                  </span>
                  {s.nome_loja}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false);
                  setCreateOpen(true);
                }}
              >
                <div className="flex items-center gap-2 w-full">
                  <span>
                    Criar uma loja <br />
                    <span className="text-xs">Comece a faturar criando sua loja agora.</span>
                  </span>
                </div>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
    <Dialog open={createOpen} onOpenChange={setCreateOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar loja</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="nome-loja">Nome da loja</Label>
            <Input id="nome-loja" value={nomeLoja} onChange={(e) => setNomeLoja(e.target.value)} />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              onClick={async () => {
                if (!user?.id || !nomeLoja.trim()) return;
                const res = await fetch("http://localhost:4000/api/stores", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ id_usuario: user.id, nome_loja: nomeLoja.trim() }),
                });
                const data = await res.json();
                if (data.ok) {
                  await refresh();
                  setSelectedStoreId(data.loja.id);
                  setCreateOpen(false);
                  setNomeLoja("");
                }
              }}
            >
              Criar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
}
