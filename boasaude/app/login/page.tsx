"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  React.useEffect(() => {
    if (isAuthenticated) {
      const dest = user?.role === "paciente" ? "/dashboardPatient" : "/dashboard";
      router.replace(dest);
    }
  }, [isAuthenticated, user?.role, router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = await login(email, password);
    if (!result.ok) setError(result.message || "Erro ao entrar");
    // redirecionamento acontece pelo useEffect acima quando isAuthenticated=true
  }

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <div className="w-full max-w-sm rounded-3xl bg-[#C0C9EE] p-8 grid gap-8">
        <div className="grid place-items-center">
          <Image src="/Health.svg" alt="Boa Saúde" width={120} height={120} priority />
        </div>
        <form onSubmit={onSubmit} className="grid gap-4">
          <Input
            label="Usuario / email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email"
            required
          />
          <Input
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="senha"
            required
          />
          {error && <p className="text-red-700 text-sm">{error}</p>}
          <Button type="submit" full>
            Entrar
          </Button>
        </form>
        <div className="rounded-xl bg-white/80 text-black text-xs p-3 space-y-2">
  <div className="font-semibold text-center text-sm mb-2">
    Usuários para teste
  </div>
  <div className="grid gap-1 text-center">
    <div><span className="font-medium">Paciente:</span> paciente@email.com / paciente123</div>
    <div><span className="font-medium">Profissional:</span> profissional@email.com / profissional123</div>
    <div><span className="font-medium">Admin:</span> admin@email.com / admin123</div>
  </div>

  <div className="border-t border-black/10 pt-2 text-center text-[10px] leading-tight">
    SGHSS (Sistema de Gestão Hospitalar e de Serviços de Saúde) - Projeto Multidisciplinar
    <br/>
    Desenvolvido por <span className="font-medium">Andrei Barbosa</span><br />
    RU: 4529136<br />
    <a
      href="https://github.com/andreikestrel/Good-Health"
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 hover:underline break-all"
    >
      Repositório github
    </a>
  </div>
</div>

        <button className="text-center text-sm opacity-80" onClick={() => router.push('/login/alert')}>
          NOVO USUARIO
        </button>
      </div>

      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="grid gap-4">
          <Button full onClick={() => router.push("/login/newUser?role=profissional")}>Sou profissional</Button>
          <Button full onClick={() => router.push("/login/newUser?role=admin")}>Sou administrador</Button>
        </div>
      </Modal>
    </div>
  );
}

