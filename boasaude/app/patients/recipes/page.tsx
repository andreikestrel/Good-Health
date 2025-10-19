"use client";

import React, { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { listRecipes, listRecipesByPatient, listPatients } from "@/lib/data/store";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

function RecipesListPageInner() {
  const router = useRouter();
  const params = useSearchParams();
  const { isAuthenticated } = useAuth();
  const patientId = params.get("patientId") || "";
  const [version, setVersion] = useState(0);

  const items = useMemo(() => (patientId ? listRecipesByPatient(patientId) : listRecipes()), [patientId, version]);
  const patients = useMemo(() => listPatients(), [version]);
  const getName = (id: string) => patients.find((p) => p.id === id)?.name || "Paciente";

  if (!isAuthenticated) {
    router.replace("/login");
    return null;
  }

  return (
    <div className="min-h-screen p-4 container-responsive">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl bg-[#898AC4] p-4 text-white flex items-center justify-between">
          <div>Receitas</div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => router.push(`/patients/recipes/create_n_edit${patientId ? `?patientId=${patientId}` : ""}`)}>Nova receita</Button>
            <Button variant="secondary" onClick={() => router.back()}>Voltar</Button>
          </div>
        </div>

        <div className="mt-4 rounded-2xl bg-[#C0C9EE] p-4 grid gap-3">
          {items.map((r) => (
            <Card key={r.id}>
              <div className="text-black flex items-center justify-between">
                <div>
                  <div className="font-medium">{r.title}</div>
                  <div className="text-xs text-black/60">{new Date(r.createdAt).toLocaleString("pt-BR")} · {getName(r.patientId)}</div>
                </div>
                <Button variant="secondary" onClick={() => router.push(`/patients/details?id=${r.patientId}`)}>ver paciente</Button>
              </div>
            </Card>
          ))}
          {items.length === 0 && <div className="text-center text-black/60">Sem receitas</div>}
        </div>
      </div>
    </div>
  );
}

export default function RecipesListPage() {
  return (
    <Suspense fallback={null}>
      <RecipesListPageInner />
    </Suspense>
  );
}

