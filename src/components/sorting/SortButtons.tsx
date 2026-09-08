"use client";

import { useBudget } from "@/contexts/BudgetContext";
import { Icon } from "@iconify/react";
import React from "react";
import { cn } from "@/lib/utils";

const ORDENES: { key: "date" | "amount" | "recurring"; label: string }[] = [
  { key: "date", label: "Fecha" },
  { key: "amount", label: "Monto" },
  { key: "recurring", label: "Recurrentes" },
];

// Filtro por tipo y orden con texto, sin iconos crípticos.
export default function SortButtons() {
  const {
    sortTransactions,
    sortKey,
    sortOrder,
    toggleSortOrder,
    transactionTypeFilter,
    filterByType,
  } = useBudget();

  const pill = "rounded-md px-3 py-1.5 text-xs font-semibold transition";

  return (
    <div className="flex flex-col gap-2 mb-2">
      <div className="grid grid-cols-3 gap-1 rounded-md bg-secondary p-1">
        {(
          [
            ["all", "Todos"],
            ["expense", "Gastos"],
            ["income", "Ingresos"],
          ] as const
        ).map(([v, label]) => (
          <button
            key={v}
            type="button"
            onClick={() => filterByType(v)}
            className={cn(
              pill,
              transactionTypeFilter === v
                ? v === "expense"
                  ? "bg-red-500 text-white"
                  : v === "income"
                  ? "bg-green-500 text-white"
                  : "bg-blue-500 text-white"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
        <span className="mr-1">Ordenar por</span>
        {ORDENES.map((o) => (
          <button
            key={o.key}
            type="button"
            onClick={() => sortTransactions(o.key)}
            className={cn(
              pill,
              "py-1",
              sortKey === o.key || (o.key === "date" && sortKey === "id")
                ? "bg-accent text-foreground"
                : "hover:text-foreground"
            )}
          >
            {o.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => toggleSortOrder()}
          className={cn(pill, "ml-auto flex items-center gap-1 py-1 hover:text-foreground")}
          aria-label={sortOrder === "asc" ? "Orden ascendente" : "Orden descendente"}
        >
          <Icon icon={sortOrder === "asc" ? "lucide:arrow-up-narrow-wide" : "lucide:arrow-down-wide-narrow"} className="h-4 w-4" />
          {sortOrder === "asc" ? "Antiguos primero" : "Recientes primero"}
        </button>
      </div>
    </div>
  );
}
