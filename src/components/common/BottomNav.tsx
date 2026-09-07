"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/", label: "Registrar", icon: "lucide:plus-circle" },
  { href: "/movimientos", label: "Movimientos", icon: "lucide:list" },
  { href: "/analytics", label: "Análisis", icon: "lucide:bar-chart-3" },
];

// Barra inferior fija, estilo app: registrar / movimientos / análisis.
export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Secciones"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto flex max-w-3xl">
        {TABS.map((t) => {
          const active = t.href === "/" ? pathname === "/" : pathname.startsWith(t.href);
          return (
            <Link
              key={t.href}
              href={t.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-semibold uppercase tracking-wider transition-colors",
                active ? "text-blue-500" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon icon={t.icon} className="h-5 w-5" />
              {t.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
