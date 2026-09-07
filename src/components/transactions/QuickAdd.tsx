"use client";

import React, { useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useBudget } from "@/contexts/BudgetContext";
import { useApp } from "@/contexts/AppContext";
import { expenseCategories, incomeCategories } from "@/lib/categories";
import { compressImage, uploadPhoto } from "@/lib/photo";
import { cn } from "@/lib/utils";
import PhotoField from "./PhotoField";

export const ICONOS_CATEGORIA: Record<string, string> = {
  Comida: "lucide:utensils",
  Alquiler: "lucide:home",
  Servicios: "lucide:plug-zap",
  Transporte: "lucide:car",
  Entretenimiento: "lucide:clapperboard",
  Compras: "lucide:shopping-bag",
  Amada: "lucide:heart",
  Familia: "lucide:users",
  Sueldo: "lucide:briefcase",
  Freelance: "lucide:laptop",
  Inversión: "lucide:trending-up",
  Bono: "lucide:gift",
  Otro: "lucide:tag",
};

type Tipo = "income" | "expense";
const FMT = "yyyy-MM-dd'T'HH:mm";
const FMT_DB = "yyyy-MM-dd'T'HH:mm:ss";

// Mini formulario de la portada: registrar un gasto o ingreso en segundos.
export default function QuickAdd() {
  const { addTransaction, currency } = useBudget();
  const { soundEffects } = useApp();
  const [tipo, setTipo] = useState<Tipo>("expense");
  const [monto, setMonto] = useState("");
  const [categoria, setCategoria] = useState<string>("None");
  const [descripcion, setDescripcion] = useState("");
  const [fecha, setFecha] = useState(() => format(new Date(), FMT));
  const [masOpciones, setMasOpciones] = useState(false);
  const [photo, setPhoto] = useState<{ mime: string; data: string; previewUrl: string } | null>(null);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [listo, setListo] = useState(false);

  const categorias = useMemo(
    () => (tipo === "expense" ? expenseCategories : incomeCategories).filter((c) => c !== "None"),
    [tipo]
  );

  const cambiarTipo = (t: Tipo) => {
    setTipo(t);
    setCategoria("None");
  };

  const onPickPhoto = async (file: File) => {
    setPhotoBusy(true);
    try {
      setPhoto(await compressImage(file));
    } catch (e) {
      toast.error(`No se pudo leer la foto: ${(e as Error).message}`);
    } finally {
      setPhotoBusy(false);
    }
  };

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (guardando) return;
    const valor = parseFloat(monto.replace(",", "."));
    if (!valor || valor <= 0) {
      toast.error("Escribe el monto");
      return;
    }
    setGuardando(true);
    try {
      const localDate = fecha ? new Date(fecha) : new Date();
      const redondeado = Math.round(valor * 100) / 100;
      const cuerpo = {
        type: tipo,
        amount: redondeado,
        original_amount: redondeado,
        original_currency: currency.toUpperCase(),
        description: descripcion.trim(),
        date: format(localDate, FMT_DB),
        category: categoria,
        is_actual: true,
        is_recurring: false,
        is_consistent_amount: true,
        status: "active",
      };
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cuerpo),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "No se pudo guardar");
      let guardado = data.transaction;
      if (photo && guardado?.id) {
        const ok = await uploadPhoto(guardado.id, photo);
        if (ok) guardado = { ...guardado, has_photo: true };
        else toast.error("Se guardó el movimiento, pero la foto no");
      }
      addTransaction(guardado);
      if (soundEffects === "On") {
        const audio = new Audio(tipo === "income" ? "/audio/new-income.wav" : "/audio/new-expense.wav");
        audio.volume = 0.1;
        audio.play().catch(() => {});
      }
      toast.success(tipo === "income" ? "Ingreso registrado 💰" : "Gasto registrado 💸");
      setMonto("");
      setDescripcion("");
      setCategoria("None");
      setPhoto(null);
      setFecha(format(new Date(), FMT));
      setListo(true);
      setTimeout(() => setListo(false), 1800);
    } catch (err) {
      toast.error(`Algo salió mal: ${(err as Error).message}`);
    } finally {
      setGuardando(false);
    }
  };

  const esGasto = tipo === "expense";

  return (
    <form
      onSubmit={guardar}
      className="w-full rounded-md border border-border bg-card p-4 flex flex-col gap-4"
      aria-label="Registrar movimiento"
    >
      <div className="grid grid-cols-2 gap-2 rounded-md bg-secondary p-1">
        <button
          type="button"
          onClick={() => cambiarTipo("expense")}
          className={cn(
            "rounded-md py-2 text-sm font-semibold transition",
            esGasto ? "bg-red-500 text-white" : "text-muted-foreground hover:text-foreground"
          )}
        >
          Gasto
        </button>
        <button
          type="button"
          onClick={() => cambiarTipo("income")}
          className={cn(
            "rounded-md py-2 text-sm font-semibold transition",
            !esGasto ? "bg-green-500 text-white" : "text-muted-foreground hover:text-foreground"
          )}
        >
          Ingreso
        </button>
      </div>

      <label className="flex items-end justify-center gap-2 py-2">
        <span className="pb-2 text-2xl font-semibold text-muted-foreground">S/</span>
        <input
          inputMode="decimal"
          autoComplete="off"
          placeholder="0.00"
          value={monto}
          onChange={(e) => setMonto(e.target.value.replace(/[^0-9.,]/g, ""))}
          className="w-44 bg-transparent text-center text-5xl font-bold tabular-nums outline-none placeholder:text-muted-foreground/40"
          aria-label="Monto"
        />
      </label>

      <div className="flex flex-wrap justify-center gap-2">
        {categorias.map((c) => {
          const activa = categoria === c;
          return (
            <button
              key={c}
              type="button"
              onClick={() => setCategoria(activa ? "None" : c)}
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition",
                activa
                  ? esGasto
                    ? "border-red-500 bg-red-500/15 text-red-500"
                    : "border-green-500 bg-green-500/15 text-green-500"
                  : "border-border bg-secondary text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon icon={ICONOS_CATEGORIA[c] ?? "lucide:tag"} className="h-4 w-4" />
              {c}
            </button>
          );
        })}
      </div>

      <input
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value.slice(0, 100))}
        placeholder={esGasto ? "¿En qué fue? (opcional)" : "¿De dónde vino? (opcional)"}
        className="w-full rounded-md border border-border bg-background px-3 py-2 text-base outline-none focus:border-blue-500"
      />
      <PhotoField
        previewUrl={photo?.previewUrl ?? null}
        onPick={onPickPhoto}
        onClear={() => setPhoto(null)}
        busy={photoBusy}
      />

      <button
        type="button"
        onClick={() => setMasOpciones((v) => !v)}
        className="flex items-center gap-1 self-start text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground"
      >
        <Icon icon={masOpciones ? "lucide:chevron-up" : "lucide:chevron-down"} className="h-4 w-4" />
        {masOpciones ? "Ocultar fecha" : "Cambiar fecha"}
      </button>
      {masOpciones && (
        <label className="flex items-center justify-between gap-3 text-sm">
          <span className="font-medium">Fecha y hora</span>
          <input
            type="datetime-local"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="rounded-md border border-border bg-background p-2 text-base"
          />
        </label>
      )}

      <button
        type="submit"
        disabled={guardando}
        className={cn(
          "w-full rounded-md py-3 text-base font-semibold text-white transition disabled:opacity-60",
          listo ? "bg-green-500" : esGasto ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
        )}
      >
        {guardando ? "Guardando..." : listo ? "✓ Guardado" : esGasto ? "Guardar gasto" : "Guardar ingreso"}
      </button>
    </form>
  );
}
