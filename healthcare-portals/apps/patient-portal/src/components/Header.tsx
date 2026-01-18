"use client";

import { useAuth } from "@blueblocks/auth";
import { WalletConnect } from "@blueblocks/ui";
import { Bell, Search } from "lucide-react";

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();

  const walletState = isAuthenticated && user
    ? {
        address: user.address,
        balance: "1,234.56",
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
            placeholder="Search records, prescriptions..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Wallet */}
        <WalletConnect
          wallet={walletState}
          onConnect={() => {
            // Implement wallet connection
            console.log("Connect wallet");
          }}
          onDisconnect={logout}
        />
      </div>
    </header>
  );
}
