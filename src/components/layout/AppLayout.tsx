import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import MobileNav from "./MobileNav";
import Sidebar from "./Sidebar";

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_34%),radial-gradient(circle_at_top_right,rgba(139,92,246,0.14),transparent_30%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_32%),radial-gradient(circle_at_top_right,rgba(139,92,246,0.12),transparent_34%)]">
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="min-w-0 flex-1">
          <Header onMenuClick={() => setMobileOpen(true)} />
          <main className="mx-auto w-full max-w-7xl px-4 py-6 md:px-8 md:py-8">
            <Outlet />
          </main>
        </div>
      </div>
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </div>
  );
}
