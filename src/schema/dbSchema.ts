import { sqliteTable, integer, text, real } from "drizzle-orm/sqlite-core";

// Esquema portado de PostgreSQL a SQLite/Turso. Los enums de Postgres pasan a
// columnas de texto con la lista de valores permitidos.
export const transactionTypes = ["income", "expense"] as const;
export const incomeCategoryValues = [
  "Sueldo",
  "Freelance",
  "Inversión",
  "Bono",
  "Otro",
] as const;
export const expenseCategoryValues = [
  "Comida",
  "Alquiler",
  "Servicios",
  "Transporte",
  "Entretenimiento",
  "Compras",
  "Amada",
  "Familia",
  "Otro",
] as const;
export const frequencyValues = ["daily", "weekly", "monthly", "yearly"] as const;

export const transactions = sqliteTable("transactions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  type: text("type", { enum: transactionTypes }),
  amount: real("amount").notNull(),
  original_amount: real("original_amount"),
  original_currency: text("original_currency"),
  description: text("description"),
  date: text("date").notNull(),
  category: text("category"),
  is_actual: integer("is_actual", { mode: "boolean" }).default(true).notNull(),

  recurring_parent_id: integer("recurring_parent_id"),
  is_recurring: integer("is_recurring", { mode: "boolean" })
    .default(false)
    .notNull(),
  frequency: text("frequency", { enum: frequencyValues }),
  is_consistent_amount: integer("is_consistent_amount", { mode: "boolean" })
    .default(true),
  status: text("status").default("active").notNull(),
  has_photo: integer("has_photo", { mode: "boolean" }).default(false).notNull(),
});

// Foto adjunta (comprobante / pantalla de Yape) por movimiento, guardada
// comprimida en base64. Una por movimiento; se sirve por /api/attachments.
export const attachments = sqliteTable("attachments", {
  transaction_id: integer("transaction_id").primaryKey(),
  mime: text("mime").notNull(),
  data: text("data").notNull(),
  created_at: text("created_at").notNull(),
});

export const achievements = sqliteTable("achievements", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  unlocked: integer("unlocked", { mode: "boolean" }).default(false).notNull(),
  unlocked_at: text("unlocked_at"),
});
