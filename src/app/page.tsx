import QuickAdd from "@/components/transactions/QuickAdd";
import ResumenRapido from "@/components/common/ResumenRapido";
import { generateMetadata } from "@/lib/head";

export const metadata = generateMetadata({
  title: "Registrar",
});

// Portada: registrar en segundos; lo demás vive en Movimientos y Análisis.
export default function Home() {
  return (
    <main className="flex flex-col gap-3 min-w-full items-center">
      <QuickAdd />
      <ResumenRapido />
    </main>
  );
}
