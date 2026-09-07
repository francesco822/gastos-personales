"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { isSameDay, isSameMonth, parseISO } from "date-fns";
import { useBudget } from "@/contexts/BudgetContext";
import { formatCurrency } from "./Currency";

// Debajo del formulario: cuánto llevas hoy y en el mes, y accesos a las otras vistas.
export default function ResumenRapido() {
  const { transactions, currency } = useBudget();

  const { hoy, mes, ingresosMes } = useMemo(() => {
    const ahora = new Date();
    let hoy = 0;
    let mes = 0;
    let ingresosMes = 0;
    for (const t of transactions) {
      if (t.is_recurring) continue;
      const d = parseISO(t.date);
      if (t.type === "expense") {
        if (isSameDay(d, ahora)) hoy += t.amount;
        if (isSameMonth(d, ahora)) mes += t.amount;
      } else if (isSameMonth(d, ahora)) {
        ingresosMes += t.amount;
      }
    }
    return { hoy, mes, ingresosMes };
  }, [transactions]);

  const cur = currency.length === 3 ? currency.toUpperCase() : "PEN";

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="grid grid-cols-3 gap-2">
        <Dato etiqueta="Gastado hoy" valor={formatCurrency(hoy, cur)} color="text-red-500" />
        <Dato etiqueta="Gastado este mes" valor={formatCurrency(mes, cur)} color="text-red-500" />
        <Dato etiqueta="Ingresos del mes" valor={formatCurrency(ingresosMes, cur)} color="text-green-500" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Acceso href="/movimientos" icono="lucide:list" titulo="Movimientos" detalle="Ver, editar o eliminar" />
        <Acceso href="/analytics" icono="lucide:bar-chart-3" titulo="Análisis" detalle="Hábitos y categorías" />
      </div>
    </div>
  );
}

function Dato({ etiqueta, valor, color }: { etiqueta: string; valor: string; color: string }) {
  return (
    <div className="rounded-md border border-border bg-card px-2 py-3 text-center">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{etiqueta}</div>
      <div className={`mt-1 text-sm font-bold tabular-nums ${color}`}>{valor}</div>
    </div>
  );
}

function Acceso({ href, icono, titulo, detalle }: { href: string; icono: string; titulo: string; detalle: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-md border border-border bg-card p-3 transition hover:border-blue-500 hover:bg-accent"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-blue-500/15 text-blue-500">
        <Icon icon={icono} className="h-5 w-5" />
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="text-sm font-semibold">{titulo}</span>
        <span className="truncate text-xs text-muted-foreground">{detalle}</span>
      </span>
      <Icon icon="lucide:chevron-right" className="ml-auto h-4 w-4 shrink-0 text-muted-foreground" />
    </Link>
  );
}
