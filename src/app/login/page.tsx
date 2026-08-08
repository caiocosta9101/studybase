import { redirect } from "next/navigation";
import { loginAction } from "./actions";
import { getCurrentUser } from "@/lib/auth/session";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string | string[];
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const currentUser = await getCurrentUser();

  if (currentUser) {
    redirect("/dashboard");
  }

  const params = await searchParams;
  const hasInvalidCredentialsError = params.error === "invalid_credentials";

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-6">
      <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-soft sm:p-8">
        <div>
          <span className="grid h-11 w-11 place-items-center rounded-lg bg-slate-950 text-sm font-black text-white shadow-soft">
            SB
          </span>
          <p className="mt-6 text-sm font-bold uppercase tracking-[0.18em] text-sky-700">Acesso à base</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Entrar no StudyBase</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">Use a credencial da sua conta para continuar organizando seus aprendizados.</p>
        </div>

        {hasInvalidCredentialsError ? (
          <p role="alert" className="mt-6 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800">
            E-mail ou senha inválidos.
          </p>
        ) : null}

        <form action={loginAction} className="mt-6 grid gap-5">
          <label className="grid gap-2">
            <span className="text-sm font-bold text-slate-900">E-mail</span>
            <input
              name="email"
              type="email"
              required
              autoComplete="username"
              className="h-12 rounded-lg border border-slate-300 bg-slate-50 px-4 text-sm outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-bold text-slate-900">Senha</span>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="h-12 rounded-lg border border-slate-300 bg-slate-50 px-4 text-sm outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
            />
          </label>

          <button type="submit" className="mt-1 h-12 rounded-lg bg-slate-950 px-4 text-sm font-bold text-white shadow-soft transition hover:bg-slate-800">
            Entrar
          </button>
        </form>
      </section>
    </main>
  );
}
