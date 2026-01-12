import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';

function App() {
  const [isDark, setIsDark] = useState(true);

  return (
    <div className={`min-h-screen flex ${isDark ? 'bg-neutral-950' : 'bg-gray-900'}`}>
      <Sidebar isDark={isDark} onThemeToggle={() => setIsDark(!isDark)} />
      <Dashboard isDark={isDark} />
    </div>
  );
}

export default App;
