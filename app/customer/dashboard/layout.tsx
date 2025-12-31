"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  LayoutDashboard,
  Palette,
  ShoppingBag,
  Package,
  User,
  Menu,
  X,
  LogOut,
  Scissors,
  ChevronDown,
  Settings,
  History,
  TrendingUp,
} from "lucide-react";
import { CustomerAuthProvider, useCustomerAuth } from "@/contexts/CustomerAuthContext";
import CustomerLoginModal from "@/components/CustomerLoginModal";
import ProfileCompletionModal from "@/components/ProfileCompletionModal";

function CustomerLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const activeView = searchParams.get("view") || "dashboard";
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const { user, isAuthenticated, profile, loading, logout } = useCustomerAuth();

  const navItems = [
    {
      name: "Dashboard",
      href: "/customer/dashboard?view=dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Browse Fabrics",
      href: "/customer/dashboard?view=fabrics",
      icon: Palette,
    },
    {
      name: "Browse Products",
      href: "/customer/dashboard?view=products",
      icon: ShoppingBag,
    },
    {
      name: "My Orders",
      href: "/customer/dashboard?view=orders",
      icon: Package,
    },
    {
      name: "Analytics",
      href: "/customer/dashboard?view=analytics",
      icon: TrendingUp,
    },
    {
      name: "Profile",
      href: "/customer/dashboard?view=profile",
      icon: User,
    },
  ];

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
        className={`fixed top-0 left-0 h-full w-72 bg-gradient-to-b from-navy to-charcoal text-white z-50 transition-all duration-300 ${
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-6 border-b border-white/10">
            <Link href="/">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-3 cursor-pointer"
              >
                <div className="relative">
                  <Scissors className="h-8 w-8 text-gold rotate-45" />
                  <motion.div
                    className="absolute -top-1 -right-1 w-2 h-2 bg-orange rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                </div>
                <div>
                  <h1 className="text-xl font-bold">
                    7e<span className="text-gold">Online</span>
                  </h1>
                  <p className="text-xs text-white/60">Customer Portal</p>
                </div>
              </motion.div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.href.split("=")[1];

              return (
                <Link key={item.name} href={item.href}>
                  <motion.div
                    whileHover={{ x: 5 }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all ${
                      isActive
                        ? "bg-gold text-navy font-semibold"
                        : "hover:bg-white/10"
                    }`}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <span className="text-sm">{item.name}</span>
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          {isAuthenticated && profile && (
            <div className="p-4 border-t border-white/10">
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-gold to-orange rounded-full flex items-center justify-center text-navy font-bold flex-shrink-0">
                    {profile.displayName?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div className="flex-1 text-left overflow-hidden">
                    <p className="text-sm font-semibold truncate">
                      {profile.displayName || "User"}
                    </p>
                    <p className="text-xs text-white/60 truncate">
                      {user?.email || user?.phoneNumber || profile.email || profile.phoneNumber}
                    </p>
                  </div>
                  <ChevronDown className={`h-4 w-4 flex-shrink-0 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {showProfileMenu && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowProfileMenu(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute bottom-full left-4 right-4 mb-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-20"
                      >
                        <div className="py-2">
                          <Link href="/customer/dashboard?view=profile">
                            <button
                              onClick={() => setShowProfileMenu(false)}
                              className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700"
                            >
                              <Settings className="h-5 w-5" />
                              <span>Profile Settings</span>
                            </button>
                          </Link>
                          <Link href="/customer/dashboard?view=orders">
                            <button
                              onClick={() => setShowProfileMenu(false)}
                              className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700"
                            >
                              <History className="h-5 w-5" />
                              <span>Order History</span>
                            </button>
                          </Link>
                          <Link href="/">
                            <button
                              onClick={() => setShowProfileMenu(false)}
                              className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700"
                            >
                              <LogOut className="h-5 w-5" />
                              <span>Back to Home</span>
                            </button>
                          </Link>
                          <div className="border-t border-gray-100 mt-2 pt-2">
                            <button
                              onClick={async () => {
                                await logout();
                                setShowProfileMenu(false);
                              }}
                              className="w-full px-4 py-2.5 text-left hover:bg-red-50 flex items-center gap-3 text-red-600"
                            >
                              <LogOut className="h-5 w-5" />
                              <span>Logout</span>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="transition-all duration-300 lg:ml-72">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                  className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Menu className="h-6 w-6 text-charcoal" />
                </button>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-navy">
                    {navItems.find((item) => item.href.split("=")[1] === activeView)
                      ?.name || "Dashboard"}
                  </h2>
                  <p className="text-sm text-charcoal/60">
                    Welcome to your tailoring portal
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {isAuthenticated ? (
                  <Link href="/customer/order/new">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 px-4 sm:px-6 py-2.5 bg-gradient-to-r from-navy to-gold text-white rounded-lg font-semibold hover:shadow-lg transition-all cursor-pointer"
                    >
                      <Scissors className="h-4 w-4" />
                      <span className="hidden sm:inline">Start Order</span>
                    </motion.button>
                  </Link>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowLoginModal(true)}
                    className="flex items-center gap-2 px-4 sm:px-6 py-2.5 bg-gradient-to-r from-navy to-gold text-white rounded-lg font-semibold hover:shadow-lg transition-all cursor-pointer"
                  >
                    <Scissors className="h-4 w-4" />
                    <span className="hidden sm:inline">Start Order</span>
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-6 lg:p-8">
          {loading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="inline-block h-12 w-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
                <p className="text-charcoal/60 mt-4">Loading...</p>
              </div>
            </div>
          ) : !isAuthenticated ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center max-w-md">
                <Scissors className="h-20 w-20 text-gold mx-auto mb-6" />
                <h2 className="text-3xl font-bold text-navy mb-4">
                  Welcome to 7eOnline
                </h2>
                <p className="text-charcoal/70 mb-6">
                  Please login to access your dashboard and start your tailoring journey
                </p>
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="px-8 py-3 bg-gradient-to-r from-navy to-gold text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  Login Now
                </button>
              </div>
            </div>
          ) : (
            children
          )}
        </div>
      </div>

      {/* Login Modal */}
      <CustomerLoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={() => setShowLoginModal(false)}
      />
    </div>
  );
}

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CustomerAuthProvider>
      <CustomerLayoutContent>{children}</CustomerLayoutContent>
    </CustomerAuthProvider>
  );
}
