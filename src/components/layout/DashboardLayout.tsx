import { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
}

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
        isMobile={isMobile}
      />

      <main
        className={cn(
          "min-h-screen transition-all duration-300",
          !isMobile && sidebarOpen ? "ml-[260px]" : !isMobile ? "ml-20" : "ml-0"
        )}
      >
        <Topbar
          title={title}
          onMenuClick={toggleSidebar}
          isMobile={isMobile}
        />
        <div className="p-4 lg:p-6">{children}</div>
      </main>
    </div>
  );
}
