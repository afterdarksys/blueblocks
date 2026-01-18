"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  Pill,
  AlertTriangle,
  Calendar,
  Settings,
} from "lucide-react";
import { cn } from "@blueblocks/ui";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "My Patients", href: "/patients", icon: Users },
  { name: "Patient Records", href: "/records", icon: FileText },
  { name: "Prescribe", href: "/prescribe", icon: Pill },
  { name: "Emergency Access", href: "/emergency", icon: AlertTriangle },
  { name: "Schedule", href: "/schedule", icon: Calendar },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
            <span className="text-white font-bold text-sm">BB</span>
          </div>
          <div>
            <span className="font-semibold text-gray-900">BlueBlocks</span>
            <span className="text-xs text-green-600 block -mt-1">Doctor Portal</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const isEmergency = item.name === "Emergency Access";
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? isEmergency
                    ? "bg-red-50 text-red-700"
                    : "bg-green-50 text-green-700"
                  : isEmergency
                  ? "text-red-600 hover:bg-red-50"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Settings */}
      <div className="px-3 py-4 border-t">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
        >
          <Settings className="h-5 w-5" />
          Settings
        </Link>
      </div>

      {/* User Card */}
      <div className="p-4 border-t">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white font-bold">
            DR
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">Dr. Sarah Johnson</p>
            <p className="text-xs text-gray-500 truncate">Internal Medicine</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
