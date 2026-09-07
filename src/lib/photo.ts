// Comprime la foto en el navegador (max 1280 px, JPEG 0.8) y la sube a
// /api/attachments. Devuelve true si quedo guardada.

export const MAX_SIDE = 1280;

export async function compressImage(
  file: File
): Promise<{ mime: string; data: string; previewUrl: string }> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No se pudo procesar la imagen");
  ctx.drawImage(bitmap, 0, 0, w, h);
  const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
  const data = dataUrl.split(",")[1];
  return { mime: "image/jpeg", data, previewUrl: dataUrl };
}

export async function uploadPhoto(
  transactionId: number,
  compressed: { mime: string; data: string }
): Promise<boolean> {
  const res = await fetch("/api/attachments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      transaction_id: transactionId,
      mime: compressed.mime,
      data: compressed.data,
    }),
  });
  return res.ok;
}

export async function deletePhoto(transactionId: number): Promise<boolean> {
  const res = await fetch("/api/attachments", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ transaction_id: transactionId }),
  });
  return res.ok;
}

export function photoUrl(transactionId: number, version?: string | number) {
  return `/api/attachments?transaction_id=${transactionId}${
    version ? `&v=${version}` : ""
  }`;
}
