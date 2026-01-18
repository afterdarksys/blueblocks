"use client";

import * as React from "react";
import { Wallet, Copy, ExternalLink, LogOut, Check, ChevronDown } from "lucide-react";
import { cn, formatAddress } from "../lib/utils";
import { Button } from "./Button";

export interface WalletState {
  address: string;
  balance: string;
  isConnected: boolean;
  role?: "patient" | "doctor" | "pharmacist" | "paramedic";
  name?: string;
}

export interface WalletConnectProps {
  wallet: WalletState | null;
  onConnect: () => void;
  onDisconnect: () => void;
  isConnecting?: boolean;
  className?: string;
}

export function WalletConnect({
  wallet,
  onConnect,
  onDisconnect,
  isConnecting,
  className,
}: WalletConnectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    if (wallet?.address) {
      await navigator.clipboard.writeText(wallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!wallet?.isConnected) {
    return (
      <Button onClick={onConnect} loading={isConnecting} className={className}>
        <Wallet className="h-4 w-4 mr-2" />
        Connect Wallet
      </Button>
    );
  }

  return (
    <div className={cn("relative", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-white hover:bg-gray-50 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
          {wallet.name?.[0] || wallet.address.slice(2, 4).toUpperCase()}
        </div>
        <div className="text-left">
          <p className="text-sm font-medium">{wallet.name || formatAddress(wallet.address)}</p>
          <p className="text-xs text-gray-500">{wallet.balance} BBT</p>
        </div>
        <ChevronDown className={cn("h-4 w-4 text-gray-400 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-64 rounded-lg border bg-white shadow-lg z-50">
            <div className="p-4 border-b">
              <p className="text-sm font-medium">{wallet.name || "Wallet"}</p>
              <div className="flex items-center gap-2 mt-1">
                <code className="text-xs text-gray-500 font-mono">
                  {formatAddress(wallet.address, 8)}
                </code>
                <button
                  onClick={handleCopy}
                  className="p-1 hover:bg-gray-100 rounded"
                  title="Copy address"
                >
                  {copied ? (
                    <Check className="h-3 w-3 text-green-600" />
                  ) : (
                    <Copy className="h-3 w-3 text-gray-400" />
                  )}
                </button>
              </div>
              {wallet.role && (
                <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 capitalize">
                  {wallet.role}
                </span>
              )}
            </div>

            <div className="p-2">
              <div className="px-3 py-2">
                <p className="text-xs text-gray-500">Balance</p>
                <p className="text-lg font-semibold">{wallet.balance} BBT</p>
              </div>

              <a
                href={`https://explorer.blueblocks.io/address/${wallet.address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
              >
                <ExternalLink className="h-4 w-4" />
                View on Explorer
              </a>

              <button
                onClick={() => {
                  onDisconnect();
                  setIsOpen(false);
                }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
              >
                <LogOut className="h-4 w-4" />
                Disconnect
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Simplified wallet badge for headers
export function WalletBadge({
  address,
  role,
  className,
}: {
  address: string;
  role?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600" />
      <span className="text-sm font-mono">{formatAddress(address)}</span>
      {role && (
        <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 capitalize">{role}</span>
      )}
    </div>
  );
}
