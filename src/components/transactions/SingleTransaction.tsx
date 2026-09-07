"use client";

import React from "react";
import { Icon } from "@iconify/react";
import { formatDate } from "@/lib/formateDate";
import { selectTransactionType } from "@/schema/transactionForm";
import PriceDisplay from "../common/Currency";
import { useBudget } from "@/contexts/BudgetContext";
import { cn } from "@/lib/utils";
import DeleteTransactionDialog from "./DeleteTransactionDialog";
import EditTransactionDialog from "./EditTransactionDialog";
import RecurringStatusDialog from "./RecurringStatusDialog";
import PhotoDialog from "./PhotoDialog";
import { AmountMismatchDialog } from "./InconsistencePrompt";
import { ICONOS_CATEGORIA } from "./QuickAdd";

// Fila de un movimiento con acciones visibles: foto, editar y eliminar.
export default function SingleTransaction({
  trx,
}: Readonly<{ trx: selectTransactionType }>) {
  const { updateTransaction } = useBudget();
  const esGasto = trx.type === "expense";
  const categoria = trx.category && trx.category !== "None" ? trx.category : null;

  const accion =
    "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold transition hover:bg-accent";

  return (
    <div
      className={cn(
        "rounded-md border border-border bg-card p-3 flex flex-col gap-2",
        trx.status === "paused" && "opacity-60"
      )}
    >
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
            esGasto ? "bg-red-500/15 text-red-500" : "bg-green-500/15 text-green-500"
          )}
          aria-hidden
        >
          <Icon
            icon={categoria ? ICONOS_CATEGORIA[categoria] ?? "lucide:tag" : esGasto ? "lucide:arrow-down-right" : "lucide:arrow-up-right"}
            className="h-5 w-5"
          />
        </span>
        <div className="min-w-0 flex-1">
          <div className="truncate font-semibold">
            {trx.description || categoria || (esGasto ? "Gasto" : "Ingreso")}
          </div>
          <div className="flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
            {categoria && trx.description && <span>{categoria}</span>}
            <span>{formatDate(trx.date)}</span>
            {trx.is_recurring && (
              <span className="flex items-center gap-1 text-blue-500">
                <Icon icon="lucide:repeat" className="h-3.5 w-3.5" />
                {trx.status === "active" ? "Recurrente" : trx.status === "paused" ? "Pausado" : "Detenido"}
              </span>
            )}
          </div>
        </div>
        <div
          className={cn("flex items-center gap-1 whitespace-nowrap text-base font-bold tabular-nums", esGasto ? "text-red-500" : "text-green-500")}
        >
          {esGasto ? "-" : "+"}
          <PriceDisplay trx={trx} />
          {trx.is_actual === false && (
            <AmountMismatchDialog
              trxId={trx.id}
              trxAmount={trx.amount}
              onConfirm={(amt) => updateTransaction({ ...trx, is_actual: true, amount: amt })}
            />
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 border-t border-border pt-2">
        <PhotoDialog
          trx={trx}
          trigger={
            <button type="button" className={cn(accion, trx.has_photo ? "text-blue-500" : "text-muted-foreground")}>
              <Icon icon={trx.has_photo ? "lucide:image" : "lucide:camera"} className="h-4 w-4" />
              {trx.has_photo ? "Ver foto" : "Foto"}
            </button>
          }
        />
        <EditTransactionDialog
          trx={trx}
          trigger={
            <button type="button" className={cn(accion, "text-muted-foreground")}>
              <Icon icon="lucide:pencil" className="h-4 w-4" />
              Editar
            </button>
          }
        />
        {trx.is_recurring && (
          <RecurringStatusDialog trx={trx} />
        )}
        <span className="flex-1" />
        <DeleteTransactionDialog
          trx={trx}
          trigger={
            <button type="button" className={cn(accion, "text-red-500 hover:bg-red-500/10")}>
              <Icon icon="lucide:trash-2" className="h-4 w-4" />
              Eliminar
            </button>
          }
        />
      </div>
    </div>
  );
}
