/*
 *   Copyright (c) 2025 Laith Alkhaddam aka Iconical or Sleepyico.
 *   All rights reserved.

 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at

 *   http://www.apache.org/licenses/LICENSE-2.0

 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 */

import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { cn } from "@/lib/utils";
import { useBudget } from "@/contexts/BudgetContext";
import { toast } from "sonner";
import { Icon } from "@iconify/react";
import PriceDisplay from "../common/Currency";
import { formatDate } from "@/lib/formateDate";
import { selectTransactionType } from "@/schema/transactionForm";
import { useApp } from "@/contexts/AppContext";

export default function DeleteTransactionDialog({
  trx,
  trigger,
}: Readonly<{ trx: selectTransactionType; trigger?: React.ReactNode }>) {
  const { removeTransaction } = useBudget();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { soundEffects } = useApp();

  const handleDelete = async (id: number): Promise<void> => {
    setConfirmOpen(false);

    const response = await fetch("/api/transactions", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    const data = await response.json();

    if (response.ok) {
      removeTransaction(id);
      toast.success("Movimiento eliminado");
      const audio = new Audio("/audio/delete.wav");
      audio.volume = 0.4;
      if (soundEffects === "On") {
        audio.play();
      }
    } else {
      console.error(`Error: ${data.message}`);
    }
  };

  return (
    <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
      <AlertDialogTrigger asChild>
        {trigger ?? (
        <div className="text-white transition-colors flex items-center justify-between gap-4 cursor-pointer rounded-sm py-1 px-2 group hover:bg-accent text-sm">
          <span>Eliminar movimiento</span>
          <Icon
            icon="mdi:trash-can-empty"
            width={22}
            className="text-red-500"
          />
        </div>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar eliminación</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Seguro que quieres eliminar este movimiento de{" "}
            <PriceDisplay
              trx={{
                amount: trx.amount,
              }}
              className={cn(
                "inline-flex font-semibold",
                trx.type === "income" ? "text-[#42cf7f]" : "text-[#e24444]"
              )}
            />{" "}
            registrado el{" "}
            <span className="text-black/80 dark:text-white/80">
              {formatDate(trx.date)}
            </span>
            ? Esta acción no se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="w-full mt-2">
          <button
            onClick={() => setConfirmOpen(false)}
            className="px-4 py-2 border rounded-md w-full"
          >
            Cancelar
          </button>
          <button
            onClick={() => handleDelete(trx.id)}
            className="px-4 py-2 bg-red-500 text-white hover:bg-red-600 rounded-md w-full"
          >
            Sí, eliminar
          </button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
