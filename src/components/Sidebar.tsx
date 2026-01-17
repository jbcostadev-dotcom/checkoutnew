import { ChevronDown, Package, Settings, BarChart3, ShoppingCart, Zap, TrendingUp, Users, Lightbulb, Sun, Moon } from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  isDark: boolean;
  onThemeToggle: () => void;
}

export function Sidebar({ isDark, onThemeToggle }: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>(['main']);

  const toggleItem = (item: string) => {
    setExpandedItems(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const menuItems = [
    {
      id: 'jet-sports',
      label: 'Jet Sports',
      icon: Package,
      hasSubmenu: true,
      submenu: [
        { label: 'Dashboard', icon: BarChart3 },
      ]
    },
    {
      id: 'gateways',
      label: 'Gateways',
      icon: Zap,
      badge: '0'
    },
    {
      id: 'checkout',
      label: 'Checkout',
      icon: ShoppingCart,
      active: true
    },
    {
      id: 'reports',
      label: 'Relatórios',
      icon: TrendingUp
    },
    {
      id: 'sales',
      label: 'Vendas',
      icon: ShoppingCart,
      hasSubmenu: true
    },
    {
      id: 'products',
      label: 'Produtos',
      icon: Package,
      badge: '0'
    },
    {
      id: 'marketing',
      label: 'Marketing',
      icon: Lightbulb,
      hasSubmenu: true
    },
    {
      id: 'ab-testing',
      label: 'Teste A/B',
      icon: Zap,
      badge: 'NOVO'
    },
    {
      id: 'apps',
      label: 'Aplicativos',
      icon: TrendingUp
    },
    {
      id: 'developers',
      label: 'Desenvolvedores',
      icon: Users
    }
  ];

  return (
    <aside className={`w-52 ${isDark ? 'bg-neutral-900' : 'bg-gray-50'} border-r ${isDark ? 'border-neutral-800' : 'border-gray-200'} flex flex-col min-h-screen`}>
      <div className="p-6 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-yellow-400 rounded flex items-center justify-center">
            <span className="text-neutral-900 font-bold text-lg">✓</span>
          </div>
          <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Vega</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto">
        {menuItems.map((item) => (
          <div key={item.id}>
            <button
              onClick={() => item.hasSubmenu && toggleItem(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 hover:opacity-80 transition ${
                item.active
                  ? isDark
                    ? 'bg-neutral-800 text-white'
                    : 'bg-gray-200 text-gray-900'
                  : isDark
                  ? 'text-gray-400'
                  : 'text-gray-600'
              }`}
            >
              <item.icon size={20} />
              <span className="flex-1 text-sm font-medium text-left">{item.label}</span>
              {item.badge && (
                <span className={`text-xs px-2 py-1 rounded ${
                  item.badge === 'NOVO'
                    ? 'bg-yellow-400 text-neutral-900 font-semibold'
                    : isDark
                    ? 'bg-neutral-700 text-gray-300'
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  {item.badge}
                </span>
              )}
              {item.hasSubmenu && (
                <ChevronDown
                  size={16}
                  className={`transition-transform ${expandedItems.includes(item.id) ? 'rotate-180' : ''}`}
                />
              )}
            </button>

            {item.hasSubmenu && expandedItems.includes(item.id) && item.submenu && (
              <div className={`${isDark ? 'bg-neutral-950' : 'bg-gray-100'}`}>
                {item.submenu.map((subitem, idx) => (
                  <button
                    key={idx}
                    className={`w-full flex items-center gap-3 px-4 py-2 pl-12 text-sm ${
                      isDark
                        ? 'text-gray-400 hover:text-gray-200'
                        : 'text-gray-600 hover:text-gray-900'
                    } hover:opacity-80 transition`}
                  >
                    <subitem.icon size={16} />
                    <span>{subitem.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      <div className={`p-4 border-t ${isDark ? 'border-neutral-800' : 'border-gray-200'} space-y-3`}>
        <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          © 2025 • <a href="#" className="hover:underline">Termos</a>
        </div>

        <div className="flex items-center justify-center gap-2">
          <button
            onClick={onThemeToggle}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition ${
              isDark
                ? 'bg-gray-700 hover:bg-gray-600'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isDark
              ? 'bg-neutral-800 hover:bg-neutral-700'
              : 'bg-gray-200 hover:bg-gray-300'
          } transition`}>
            <Settings size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
}
