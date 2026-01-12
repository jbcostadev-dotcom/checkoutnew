import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Product {
  name: string;
  image_url: string;
  revenue: number;
  quantity_sold: number;
}

interface TopProductsProps {
  isDark: boolean;
}

export function TopProductsSection({ isDark }: TopProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase
        .from('products')
        .select('*')
        .order('revenue', { ascending: false })
        .limit(4);

      if (data) {
        setProducts(data);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className={`${isDark ? 'bg-neutral-800' : 'bg-gray-800'} rounded-lg p-6`}>
      <h3 className="text-white text-lg font-bold mb-6">Mais vendidos</h3>

      <div className="space-y-4">
        {products.map((product, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-12 h-12 rounded object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{product.name}</p>
              <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                R${product.revenue.toFixed(2)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-white font-bold text-sm">{product.quantity_sold}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
