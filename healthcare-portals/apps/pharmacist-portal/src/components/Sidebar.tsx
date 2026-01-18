"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Pill, CheckCircle, History, Search, Settings } from "lucide-react";
import { cn } from "@blueblocks/ui";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Verify Prescription", href: "/verify", icon: CheckCircle },
  { name: "Dispense", href: "/dispense", icon: Pill },
  { name: "Prescriptions Queue", href: "/prescriptions", icon: Search },
  { name: "Dispense History", href: "/history", icon: History },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-64 bg-white border-r flex flex-col">
      <div className="h-16 flex items-center px-6 border-b">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
            <span className="text-white font-bold text-sm">BB</span>
          </div>
          <div>
            <span className="font-semibold text-gray-900">BlueBlocks</span>
            <span className="text-xs text-purple-600 block -mt-1">Pharmacist Portal</span>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href}
              className={cn("flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive ? "bg-purple-50 text-purple-700" : "text-gray-600 hover:bg-gray-50")}>
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="px-3 py-4 border-t">
        <Link href="/settings" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
          <Settings className="h-5 w-5" />Settings
        </Link>
      </div>
      <div className="p-4 border-t">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-50">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold">RX</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">CVS Pharmacy</p>
            <p className="text-xs text-gray-500 truncate">License: PH-12345</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
