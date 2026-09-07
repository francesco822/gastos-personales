import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { attachments, transactions } from "@/schema/dbSchema";
import { verifyRequest } from "@/lib/auth";

const MAX_BYTES = 3 * 1024 * 1024; // base64 de la foto ya comprimida en el cliente

// GET /api/attachments?transaction_id=N -> la imagen en binario
export async function GET(req: NextRequest) {
  if (!(await verifyRequest(req))) {
    return NextResponse.json({ message: "No autorizado" }, { status: 401 });
  }
  const id = Number(req.nextUrl.searchParams.get("transaction_id"));
  if (!id) return NextResponse.json({ message: "Falta transaction_id" }, { status: 400 });

  const rows = await db.select().from(attachments).where(eq(attachments.transaction_id, id));
  if (!rows.length) return NextResponse.json({ message: "Sin foto" }, { status: 404 });

  const bytes = Buffer.from(rows[0].data, "base64");
  return new NextResponse(bytes, {
    status: 200,
    headers: {
      "Content-Type": rows[0].mime,
      "Content-Length": String(bytes.length),
      "Cache-Control": "private, max-age=0, no-store",
    },
  });
}

// POST { transaction_id, mime, data(base64) } -> guarda o reemplaza la foto
export async function POST(req: NextRequest) {
  if (!(await verifyRequest(req))) {
    return NextResponse.json({ message: "No autorizado" }, { status: 401 });
  }
  const { transaction_id, mime, data } = await req.json();
  const id = Number(transaction_id);
  if (!id || typeof data !== "string" || !data) {
    return NextResponse.json({ message: "Datos incompletos" }, { status: 400 });
  }
  if (!/^image\/(jpeg|png|webp)$/.test(mime)) {
    return NextResponse.json({ message: "Formato no permitido" }, { status: 400 });
  }
  if (data.length > MAX_BYTES * 1.4) {
    return NextResponse.json({ message: "La foto es muy pesada" }, { status: 413 });
  }
  const exists = await db.select({ id: transactions.id }).from(transactions).where(eq(transactions.id, id));
  if (!exists.length) return NextResponse.json({ message: "Movimiento no existe" }, { status: 404 });

  await db.delete(attachments).where(eq(attachments.transaction_id, id));
  await db.insert(attachments).values({
    transaction_id: id,
    mime,
    data,
    created_at: new Date().toISOString(),
  });
  await db.update(transactions).set({ has_photo: true }).where(eq(transactions.id, id));
  return NextResponse.json({ message: "Foto guardada", transaction_id: id }, { status: 201 });
}

// DELETE { transaction_id } -> quita la foto
export async function DELETE(req: NextRequest) {
  if (!(await verifyRequest(req))) {
    return NextResponse.json({ message: "No autorizado" }, { status: 401 });
  }
  const { transaction_id } = await req.json();
  const id = Number(transaction_id);
  if (!id) return NextResponse.json({ message: "Falta transaction_id" }, { status: 400 });
  await db.delete(attachments).where(eq(attachments.transaction_id, id));
  await db.update(transactions).set({ has_photo: false }).where(eq(transactions.id, id));
  return NextResponse.json({ message: "Foto eliminada" });
}
