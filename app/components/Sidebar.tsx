"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Phone,
  Package,
  Wrench,
  MessageSquare,
  Settings,
  Activity,
  Bot,
} from "lucide-react";

const navItems = [
  { href: "/", label: "İdarə Panelə", icon: LayoutDashboard },
  { href: "/calls", label: "Zəng Tarixçəsi", icon: Phone },
  { href: "/products", label: "Məhsullar", icon: Package },
  { href: "/services", label: "Xidmətlər", icon: Wrench },
  { href: "/nlp-test", label: "NLP Test", icon: MessageSquare },
  { href: "/analytics", label: "Analitika", icon: Activity },
  { href: "/settings", label: "Parametrlər", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-card border-r border-border flex flex-col">
      <div className="px-6 py-5 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-foreground">VoiceAI</h1>
            <p className="text-xs text-muted">Zəng Cavab Sistemi</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-white"
                  : "text-muted hover:bg-primary/10 hover:text-foreground"
              }`}
            >
              <Icon className="w-4.5 h-4.5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-border">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-success/10">
          <span className="w-2 h-2 rounded-full bg-success pulse-ring" />
          <span className="text-xs font-medium text-success">Sistem Aktiv</span>
        </div>
      </div>
    </aside>
  );
}
