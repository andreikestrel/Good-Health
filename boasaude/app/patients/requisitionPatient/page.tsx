"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const mock = [
  { id: 1, title: "Hemograma completo", createdAt: "2024-02-10T10:00:00Z" },
  { id: 2, title: "Raio-X de tórax", createdAt: "2024-06-21T12:30:00Z" },
  { id: 3, title: "Ultrassom abdominal", createdAt: "2024-09-02T08:10:00Z" },
];

export default function RequisitionPatientPage() {
  return (
    <div className="min-h-screen p-4 container-responsive">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl bg-[#898AC4] p-4 text-white flex items-center justify-between">
          <div>Minhas requisições</div>
        </div>
        <div className="mt-4 rounded-2xl bg-[#C0C9EE] p-4 grid gap-3">
          {mock.map((r) => (
            <Card key={r.id}>
              <div className="text-black flex items-center justify-between">
                <div>
                  <div className="font-medium">{r.title}</div>
                  <div className="text-xs text-black/60">{new Date(r.createdAt).toLocaleString("pt-BR")}</div>
                </div>
                <Button variant="secondary">ver</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

