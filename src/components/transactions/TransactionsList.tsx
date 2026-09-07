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
"use client";

import React from "react";
import HoverEffect from "../effects/HoverEffect";
import SingleTransaction from "./SingleTransaction";
import { Icon } from "@iconify/react";
import {
  downloadJSON,
  exportTransactions,
  printTransactions,
} from "@/lib/download";
import { selectTransactionType } from "@/schema/transactionForm";
import { useBudget } from "@/contexts/BudgetContext";
import SortButtons from "../sorting/SortButtons";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function TransactionsList() {
  const { filteredTransactions, currency } = useBudget();
  const router = useRouter();

  return (
    <HoverEffect bgColor="#3D3D3D" className="cursor-default">
      <div className="flex justify-between flex-col gap-2">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-base md:text-xl border-b-2 border-primary/24">
            Movimientos
          </h2>
          <div
            onClick={() => router.push("/analytics")}
            className="flex items-center gap-1 group/btn text-muted-foreground hover:text-primary transition-colors duration-300 cursor-pointer"
          >
            <h2 className="font-semibold text-sm md:text-base">
              Ver análisis
            </h2>
            <Icon
              icon="icon-park-twotone:chart-line-area"
              width={22}
              className="cursor-pointer"
            />
          </div>
        </div>
        <SortButtons />
      </div>
      <div className="flex flex-col gap-2">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((trx: selectTransactionType) => {
            return <SingleTransaction key={trx.id} trx={trx} />;
          })
        ) : (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <Icon icon="lucide:inbox" className="h-8 w-8 text-muted-foreground" />
            <span className="text-muted-foreground">No hay movimientos en este periodo</span>
            <Link
              href="/"
              className="rounded-md bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600"
            >
              Registrar un movimiento
            </Link>
          </div>
        )}
      </div>
      <div className="border-t mt-4 border-border" />
      <p className="mt-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Exportar</p>
      <div className="mt-2 flex flex-row justify-between items-center gap-2">
        <div
          className="flex w-full gap-2 items-center justify-center cursor-pointer bg-secondary hover:bg-accent transition-colors duration-300 p-2 rounded-md text-sm"
          onClick={() => printTransactions(filteredTransactions, currency)}
        >
          PDF
          <Icon
            icon="ix:pdf-document-filled"
            width={23}
            aria-valuetext="Exportar"
          />
        </div>
        <div
          className="flex w-full gap-2 items-center justify-center cursor-pointer bg-secondary hover:bg-accent transition-colors duration-300 p-2 rounded-md text-sm"
          onClick={() => exportTransactions(filteredTransactions)}
        >
          CSV
          <Icon icon="ix:simulation-table" width={20} aria-valuetext="Exportar" />
        </div>
        <div
          className="flex w-full gap-2 items-center justify-center cursor-pointer bg-secondary hover:bg-accent transition-colors duration-300 p-2 rounded-md text-sm"
          onClick={() => downloadJSON(filteredTransactions, currency)}
        >
          JSON
          <Icon
            icon="ix:json-document-filled"
            width={23}
            aria-valuetext="Exportar"
          />
        </div>
      </div>
    </HoverEffect>
  );
}
