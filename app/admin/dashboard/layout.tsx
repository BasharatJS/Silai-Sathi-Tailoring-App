"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  LogOut,
  Menu,
  X,
  TrendingUp,
  Palette,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAdminAuthenticated, adminEmail, logoutAdmin, isHydrated } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    // Wait for hydration before checking auth
    if (isHydrated && !isAdminAuthenticated) {
      router.push("/admin/login");
    }
  }, [isAdminAuthenticated, isHydrated, router]);

  const handleLogout = async () => {
    await logoutAdmin();
    router.push("/admin/login");
  };

  const navItems = [
    {
      name: "Dashboard",
      href: "/admin/dashboard?view=dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Orders",
      href: "/admin/dashboard?view=orders",
      icon: Package,
    },
    
    {
      name: "Fabric Collection",
      href: "/admin/dashboard?view=fabrics",
      icon: Palette,
    },
    {
      name: "Analytics",
      href: "/admin/dashboard?view=analytics",
      icon: TrendingUp,
    },
  ];

  // Show loading while hydrating
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 border-4 border-navy border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-charcoal/60">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAdminAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: isSidebarOpen ? 0 : -280,
        }}
        className={`fixed top-0 left-0 h-full bg-gradient-to-b from-navy to-charcoal text-white z-50 transition-all duration-300 ${
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 ${isSidebarOpen ? "w-72" : "w-0 lg:w-20"}`}
      >
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center justify-between mb-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-gold to-orange rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-white" />
              </div>
              {isSidebarOpen && (
                <div>
                  <h1 className="text-xl font-bold">7e<span className="text-gold">Online</span></h1>
                  <p className="text-xs text-white/60">Admin Panel</p>
                </div>
              )}
            </motion.div>
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.name} href={item.href}>
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <Icon className="h-5 w-5" />
                    {isSidebarOpen && (
                      <span className="font-medium">{item.name}</span>
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Admin Info & Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/10">
          {isSidebarOpen ? (
            <div className="mb-4">
              <p className="text-sm text-white/60 mb-1">Logged in as</p>
              <p className="text-sm font-medium truncate">{adminEmail}</p>
            </div>
          ) : null}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 bg-red-500/20 hover:bg-red-500/30 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="h-5 w-5" />
            {isSidebarOpen && <span className="font-medium">Logout</span>}
          </motion.button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          isSidebarOpen ? "lg:pl-72" : "lg:pl-20"
        }`}
      >
        {/* Top Bar */}
        <div className="bg-white shadow-sm sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu className="h-6 w-6 text-charcoal" />
              </button>
              <h2 className="text-2xl font-bold text-navy">
                Order Management
              </h2>
              <div className="w-10 lg:w-0"></div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
