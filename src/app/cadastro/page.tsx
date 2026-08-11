import Link from "next/link";
import { redirect } from "next/navigation";
import { registerAction } from "./actions";
import { getCurrentUser } from "@/lib/auth/session";

type RegistrationPageProps = {
  searchParams: Promise<{
    error?: string | string[];
  }>;
};

const registrationErrorMessages: Record<string, string> = {
  invalid_data: "Não foi possível validar os dados informados.",
  invalid_name: "Informe um nome válido com até 100 caracteres.",
  invalid_email: "Informe um e-mail válido.",
  invalid_password: "A senha deve ter entre 12 e 128 caracteres.",
  password_mismatch: "As senhas não coincidem.",
  registration_failed: "Não foi possível concluir o cadastro com os dados informados.",
  registration_unavailable: "Não foi possível concluir o cadastro agora. Tente novamente mais tarde."
};

export default async function RegistrationPage({ searchParams }: RegistrationPageProps) {
  const currentUser = await getCurrentUser();

  if (currentUser) {
    redirect("/dashboard");
  }

  const params = await searchParams;
  const errorMessage = typeof params.error === "string" ? registrationErrorMessages[params.error] : undefined;

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-6">
      <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-soft sm:p-8">
        <div>
          <span className="grid h-11 w-11 place-items-center rounded-lg bg-slate-950 text-sm font-black text-white shadow-soft">
            SB
          </span>
          <p className="mt-6 text-sm font-bold uppercase tracking-[0.18em] text-sky-700">Crie sua base</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Cadastrar no StudyBase</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">Crie sua conta para organizar aprendizados em uma base pessoal.</p>
        </div>

        {errorMessage ? (
          <p role="alert" className="mt-6 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800">
            {errorMessage}
          </p>
        ) : null}

        <form action={registerAction} className="mt-6 grid gap-5">
          <label className="grid gap-2">
            <span className="text-sm font-bold text-slate-900">Nome</span>
            <input
              name="name"
              type="text"
              required
              maxLength={100}
              autoComplete="name"
              className="h-12 rounded-lg border border-slate-300 bg-slate-50 px-4 text-sm outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-bold text-slate-900">E-mail</span>
            <input
              name="email"
              type="email"
              required
              maxLength={254}
              autoComplete="email"
              className="h-12 rounded-lg border border-slate-300 bg-slate-50 px-4 text-sm outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-bold text-slate-900">Senha</span>
            <input
              name="password"
              type="password"
              required
              minLength={12}
              maxLength={128}
              autoComplete="new-password"
              className="h-12 rounded-lg border border-slate-300 bg-slate-50 px-4 text-sm outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
            />
            <span className="text-xs leading-5 text-slate-500">Use entre 12 e 128 caracteres.</span>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-bold text-slate-900">Confirmar senha</span>
            <input
              name="passwordConfirmation"
              type="password"
              required
              minLength={12}
              maxLength={128}
              autoComplete="new-password"
              className="h-12 rounded-lg border border-slate-300 bg-slate-50 px-4 text-sm outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
            />
          </label>

          <button type="submit" className="mt-1 h-12 rounded-lg bg-slate-950 px-4 text-sm font-bold text-white shadow-soft transition hover:bg-slate-800">
            Criar conta
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Já possui uma conta?{" "}
          <Link href="/login" className="font-bold text-sky-700 hover:text-sky-900">
            Entrar
          </Link>
        </p>
      </section>
    </main>
  );
}
