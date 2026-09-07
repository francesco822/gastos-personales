"use client";

import React, { useRef } from "react";
import { Icon } from "@iconify/react";

// Campo "Foto" del formulario: abre la camara en el celular o el selector de
// archivos en la PC, y muestra la miniatura elegida.
export default function PhotoField({
  previewUrl,
  onPick,
  onClear,
  busy,
}: Readonly<{
  previewUrl: string | null;
  onPick: (file: File) => void;
  onClear: () => void;
  busy?: boolean;
}>) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex justify-between items-center gap-2">
      <span className="text-sm font-medium">Foto</span>
      <div className="flex items-center gap-2 max-w-60 md:max-w-sm">
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
        {previewUrl ? (
          <>
            <img
              src={previewUrl}
              alt="Foto del movimiento"
              className="h-14 w-14 rounded-md object-cover border border-border"
            />
            <button
              type="button"
              onClick={onClear}
              className="text-xs text-muted-foreground hover:text-red-500"
              aria-label="Quitar foto"
            >
              Quitar
            </button>
          </>
        ) : (
          <button
            type="button"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
            className="flex items-center gap-2 rounded-md border border-border bg-secondary px-3 py-2 text-sm hover:bg-accent transition"
          >
            <Icon icon="lucide:camera" className="h-4 w-4" />
            {busy ? "Procesando..." : "Tomar o subir foto"}
          </button>
        )}
      </div>
    </div>
  );
}
