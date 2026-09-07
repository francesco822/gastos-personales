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

import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { transactions } from "./dbSchema";
import { z } from "zod";

export const insertTransactionSchema = createInsertSchema(transactions, {
  amount: () =>
    z.preprocess(
      (val) =>
        typeof val === "string" && val.trim() !== ""
          ? Number(val)
          : typeof val === "number"
          ? val
          : undefined,
      z
        .number({
          required_error: "El monto es obligatorio",
          invalid_type_error: "El monto debe ser un número",
        })
        .min(0.01, "El monto debe ser mayor a 0")
        .positive("El monto debe ser positivo")
        .refine((val) => /^[0-9]+(\.[0-9]{1,2})?$/.test(val.toString()), {
          message: "El monto debe tener como máximo 2 decimales",
        })
    ),
  description: (schema) =>
    schema
      .max(
        100,
        "La descripción no puede pasar de 100 caracteres"
      )
      .optional(),
  date: () =>
    z.preprocess(
      (val) => (typeof val === "string" ? new Date(val) : val),
      z.date({
        required_error: "La fecha es obligatoria",
        invalid_type_error: "Formato de fecha inválido",
      })
    ),
  is_actual: (schema) => schema.default(true),
  frequency: () => z.enum(["daily", "weekly", "monthly", "yearly"]).optional(),
  is_consistent_amount: () => z.boolean().optional(),
});

export const selectTransactionSchema = createSelectSchema(transactions);

export type insertTransactionType = z.infer<typeof insertTransactionSchema>;
export type selectTransactionType = z.infer<typeof selectTransactionSchema>;
