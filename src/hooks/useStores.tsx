import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./useAuth";

type Store = { id: number; id_usuario: number; nome_loja: string; id_template_checkout?: number | null; cnpj_loja?: string | null };

type StoresContextType = {
  stores: Store[];
  selectedStoreId: number | null;
  selectedStore: Store | null;
  setSelectedStoreId: (id: number) => void;
  refresh: () => Promise<void>;
};

const StoresContext = createContext<StoresContextType | undefined>(undefined);

export function StoresProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStoreId, setSelectedStoreIdState] = useState<number | null>(null);

  const key = user ? `selected_store_${user.id}` : null;

  const load = async () => {
    if (!user) {
      setStores([]);
      setSelectedStoreIdState(null);
      return;
    }
    try {
      const res = await fetch(`http://localhost:4000/api/stores/by-user/${user.id}`);
      const data = await res.json();
      if (data.ok) {
        setStores(data.lojas || []);
        const saved = key ? localStorage.getItem(key) : null;
        const initial =
          saved ? Number(saved) : (data.lojas && data.lojas.length ? Number(data.lojas[0].id) : null);
        setSelectedStoreIdState(initial);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const refresh = async () => {
    await load();
  };

  const setSelectedStoreId = (id: number) => {
    setSelectedStoreIdState(id);
    if (key) localStorage.setItem(key, String(id));
  };

  const selectedStore = useMemo(
    () => (selectedStoreId ? stores.find((s) => s.id === selectedStoreId) || null : null),
    [selectedStoreId, stores]
  );

  const value = useMemo(
    () => ({ stores, selectedStoreId, selectedStore, setSelectedStoreId, refresh }),
    [stores, selectedStoreId, selectedStore]
  );

  return <StoresContext.Provider value={value}>{children}</StoresContext.Provider>;
}

export function useStores() {
  const ctx = useContext(StoresContext);
  if (!ctx) throw new Error("useStores deve ser usado dentro de StoresProvider");
  return ctx;
}
