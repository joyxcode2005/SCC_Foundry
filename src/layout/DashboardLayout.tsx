import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[var(--cream)] relative">
      {/* Mobile overlay - darkens background when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container - slides in on mobile, static on desktop */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Mobile Header (Hidden on Desktop) */}
        <div className="flex items-center justify-between border-b border-[var(--cream-border)] bg-white p-4 md:hidden sticky top-0 z-30">
          <div className="flex items-center gap-[10px]">
            <div className="relative flex h-7 w-7 items-center justify-center rounded-md bg-[var(--obsidian)]">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 2h4v4H2V2zM8 2h4v4H8V2zM2 8h4v4H2V8zM8 8h4v4H8V8z" fill="var(--cream)" fillOpacity="0.9" />
              </svg>
            </div>
            <span className="font-serif text-[18px] font-bold tracking-tight text-[var(--obsidian)]">
              Foundry
            </span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-[var(--obsidian)] p-1 hover:bg-gray-100 rounded-md transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto">
          {/* Responsive padding: p-4 on mobile, p-12 on medium screens and up */}
          <div className="mx-auto w-full max-w-[1000px] p-4 md:p-12">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}