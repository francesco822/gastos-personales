// Comprime la foto en el navegador (max 1280 px, JPEG 0.8) y la sube a
// /api/attachments. Usa <img> + canvas, que funciona en iOS/Android/PC y
// respeta la orientacion EXIF; createImageBitmap queda como plan B.

export const MAX_SIDE = 1280;

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("formato de imagen no soportado"));
    };
    img.src = url;
  });
}

export async function compressImage(
  file: File
): Promise<{ mime: string; data: string; previewUrl: string }> {
  if (!file.type.startsWith("image/") && !/\.(heic|heif|jpe?g|png|webp)$/i.test(file.name)) {
    throw new Error("el archivo no es una imagen");
  }
  let width = 0;
  let height = 0;
  let source: CanvasImageSource;
  try {
    const img = await loadImage(file);
    width = img.naturalWidth;
    height = img.naturalHeight;
    source = img;
  } catch (err) {
    if (typeof createImageBitmap !== "function") throw err;
    const bmp = await createImageBitmap(file);
    width = bmp.width;
    height = bmp.height;
    source = bmp;
  }
  if (!width || !height) throw new Error("no se pudo leer la imagen");

  const scale = Math.min(1, MAX_SIDE / Math.max(width, height));
  const w = Math.max(1, Math.round(width * scale));
  const h = Math.max(1, Math.round(height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("no se pudo procesar la imagen");
  ctx.drawImage(source, 0, 0, w, h);
  const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
  const data = dataUrl.split(",")[1];
  if (!data) throw new Error("no se pudo comprimir la imagen");
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
