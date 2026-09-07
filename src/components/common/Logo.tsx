"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Cabecera con la marca MyWorkIn: wordmark blanco en oscuro, navy en claro.
export default function Logo() {
  const router = useRouter();

  return (
    <span
      className="flex w-full items-center justify-start gap-4 cursor-pointer select-none pl-9 pr-20 min-h-8"
      onClick={() => router.push("/")}
    >
      <span className="flex items-center gap-3">
        <Image
          alt="MyWorkIn"
          src="/mw-logo-navy.png"
          width={404}
          height={88}
          className="h-5 w-auto dark:hidden"
          draggable={false}
          priority
        />
        <Image
          alt="MyWorkIn"
          src="/mw-logo-white.png"
          width={404}
          height={88}
          className="hidden h-5 w-auto dark:block"
          draggable={false}
          priority
        />
        <span className="h-5 w-px bg-border" />
        <span className="text-[11px] font-semibold uppercase tracking-[0.13em] text-muted-foreground">
          Gastos
        </span>
      </span>
    </span>
  );
}
