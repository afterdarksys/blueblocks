"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, User, AlertTriangle, Activity, FileText } from "lucide-react";
import { cn } from "@blueblocks/ui";

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Patient", href: "/patient", icon: User },
  { name: "Emergency", href: "/emergency", icon: AlertTriangle },
  { name: "Vitals", href: "/vitals", icon: Activity },
  { name: "Notes", href: "/notes", icon: FileText },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 safe-area-inset-bottom">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const isEmergency = item.name === "Emergency";
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full text-xs transition-colors",
                isActive ? "text-white" : "text-gray-400",
                isEmergency && "text-red-500"
              )}
            >
              <div className={cn(
                "p-2 rounded-xl mb-1",
                isActive && !isEmergency && "bg-gray-700",
                isEmergency && "bg-red-600 text-white animate-pulse"
              )}>
                <item.icon className="h-6 w-6" />
              </div>
              <span className={cn(isEmergency && "text-red-400")}>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
