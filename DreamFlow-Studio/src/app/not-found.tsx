import Link from "next/link";
import { Compass } from "lucide-react";
import { Logo } from "@/components/layout/logo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[var(--bg-app)] px-6 text-center">
      <Logo />
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-100 text-brand-600">
        <Compass size={28} />
      </div>
      <div>
        <h1 className="font-display text-2xl font-bold text-[var(--text-primary)]">Página não encontrada</h1>
        <p className="mt-2 max-w-sm text-sm text-[var(--text-secondary)]">
          O caminho que você tentou acessar não existe ou foi movido.
        </p>
      </div>
      <Link
        href="/"
        className="inline-flex h-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 px-6 text-sm font-medium text-white shadow-[var(--shadow-brand-sm)] transition hover:shadow-[var(--shadow-brand-md)]"
      >
        Voltar ao Dashboard
      </Link>
    </div>
  );
}
