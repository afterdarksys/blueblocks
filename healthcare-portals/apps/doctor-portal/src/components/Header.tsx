"use client";

import { useAuth } from "@blueblocks/auth";
import { WalletConnect } from "@blueblocks/ui";
import { Bell, Search, AlertTriangle } from "lucide-react";

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();

  const walletState = isAuthenticated && user
    ? {
        address: user.address,
        balance: "5,678.90",
        isConnected: true,
        role: user.role,
        name: user.name,
      }
    : null;

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="search"
            placeholder="Search patients, records..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Emergency Alert */}
        <button className="flex items-center gap-2 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200">
          <AlertTriangle className="h-4 w-4" />
          Emergency
        </button>

        {/* Notifications */}
        <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Wallet */}
        <WalletConnect
          wallet={walletState}
          onConnect={() => console.log("Connect wallet")}
          onDisconnect={logout}
        />
      </div>
    </header>
  );
}
