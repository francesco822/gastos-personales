"use client";

import React, { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Icon } from "@iconify/react";
import { toast } from "sonner";
import { selectTransactionType } from "@/schema/transactionForm";
import { useBudget } from "@/contexts/BudgetContext";
import { compressImage, deletePhoto, photoUrl, uploadPhoto } from "@/lib/photo";

// Ver, cambiar o quitar la foto de un movimiento ya guardado.
export default function PhotoDialog({
  trx,
  trigger,
}: Readonly<{ trx: selectTransactionType; trigger: React.ReactNode }>) {
  const { updateTransaction } = useBudget();
  const [version, setVersion] = useState(() => Date.now());
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const onPick = async (file: File) => {
    setBusy(true);
    try {
      const compressed = await compressImage(file);
      const ok = await uploadPhoto(trx.id, compressed);
      if (!ok) throw new Error("No se pudo subir");
      updateTransaction({ ...trx, has_photo: true });
      setVersion(Date.now());
      toast.success("Foto guardada 📸");
    } catch (e) {
      toast.error(`No se pudo guardar la foto: ${e}`);
    } finally {
      setBusy(false);
    }
  };

  const onDelete = async () => {
    setBusy(true);
    const ok = await deletePhoto(trx.id);
    setBusy(false);
    if (ok) {
      updateTransaction({ ...trx, has_photo: false });
      toast.success("Foto eliminada");
    } else {
      toast.error("No se pudo eliminar la foto");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogTitle>
          {trx.has_photo ? "Foto del movimiento" : "Agregar foto"}
        </DialogTitle>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onPick(f);
            e.currentTarget.value = "";
          }}
        />
        {trx.has_photo ? (
          <a href={photoUrl(trx.id, version)} target="_blank" rel="noreferrer">
            <img
              src={photoUrl(trx.id, version)}
              alt="Foto del movimiento"
              className="w-full max-h-[60vh] object-contain rounded-md border border-border bg-black/20"
            />
          </a>
        ) : (
          <p className="text-sm text-muted-foreground">
            Adjunta la foto del comprobante o de la pantalla de Yape.
          </p>
        )}
        <div className="flex gap-2 justify-end">
          {trx.has_photo && (
            <button
              type="button"
              disabled={busy}
              onClick={onDelete}
              className="rounded-md border border-border px-3 py-2 text-sm text-red-500 hover:bg-accent"
            >
              Quitar
            </button>
          )}
          <button
            type="button"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
            className="flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500"
          >
            <Icon icon="lucide:camera" className="h-4 w-4" />
            {busy ? "Guardando..." : trx.has_photo ? "Cambiar foto" : "Tomar o subir foto"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
