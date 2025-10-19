"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const mock = [
  { id: 1, title: "Ibuprofeno 200mg", createdAt: "2024-03-02T10:00:00Z" },
  { id: 2, title: "Vitamina D 1000UI", createdAt: "2024-06:12T12:30:00Z" },
  { id: 3, title: "Dipirona 500mg", createdAt: "2024-09-21T08:10:00Z" },
];

export default function RecipesPatientPage() {
  return (
    <div className="min-h-screen p-4 container-responsive">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl bg-[#898AC4] p-4 text-white flex items-center justify-between">
          <div>Minhas receitas</div>
        </div>
        <div className="mt-4 rounded-2xl bg-[#C0C9EE] p-4 grid gap-3">
          {mock.map((r) => (
            <Card key={r.id}>
              <div className="text-black flex items-center justify-between">
                <div>
                  <div className="font-medium">{r.title}</div>
                  <div className="text-xs text-black/60">{new Date(r.createdAt).toLocaleString("pt-BR")}</div>
                </div>
                <Button variant="secondary">baixar</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

