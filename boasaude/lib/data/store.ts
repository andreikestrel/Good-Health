"use client";

// Lightweight localStorage store for demo purposes only.

export type Sex = "M" | "F" | "O";

export type Patient = {
  id: string;
  name: string;
  cpf?: string;
  email?: string;
  phone?: string;
  birthDate?: string; // YYYY-MM-DD
  sex?: Sex;
  cep?: string;
  uf?: string;
  address?: string;
  complement?: string;
  createdAt: string;
};

export type Appointment = {
  id: string;
  patientId: string;
  professionalName?: string;
  datetime: string; // ISO string
  notes?: string;
  video?: boolean;
  createdAt: string;
};

export type Recipe = {
  id: string;
  patientId: string;
  title: string;
  notes?: string;
  createdAt: string;
};

export type Requisition = {
  id: string;
  patientId: string;
  title: string;
  notes?: string;
  createdAt: string;
};

const PATIENTS_KEY = "boasaude.data.patients";
const APPTS_KEY = "boasaude.data.appointments";
const RECIPES_KEY = "boasaude.data.recipes";
const REQS_KEY = "boasaude.data.requisitions";

function uid(prefix = "id"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}_${Date.now().toString(36)}`;
}

function readArray<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(key);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeArray<T>(key: string, value: T[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

// Patients
export function listPatients(): Patient[] {
  return readArray<Patient>(PATIENTS_KEY).sort((a, b) => a.name.localeCompare(b.name));
}

export function getPatient(id: string): Patient | undefined {
  return listPatients().find((p) => p.id === id);
}

export function savePatient(input: Omit<Patient, "id" | "createdAt"> & { id?: string }): Patient {
  const all = listPatients();
  const now = new Date().toISOString();
  if (input.id) {
    const existingIndex = all.findIndex((p) => p.id === input.id);
    if (existingIndex >= 0) {
      const updated: Patient = { ...all[existingIndex], ...input } as Patient;
      all[existingIndex] = updated;
      writeArray(PATIENTS_KEY, all);
      return updated;
    }
  }
  const created: Patient = { ...input, id: uid("pat"), createdAt: now } as Patient;
  all.push(created);
  writeArray(PATIENTS_KEY, all);
  return created;
}

export function deletePatient(id: string) {
  const next = listPatients().filter((p) => p.id !== id);
  writeArray(PATIENTS_KEY, next);
}

// Appointments
export function listAppointments(): Appointment[] {
  return readArray<Appointment>(APPTS_KEY).sort((a, b) => b.datetime.localeCompare(a.datetime));
}

export function listAppointmentsByPatient(patientId: string): Appointment[] {
  return listAppointments().filter((a) => a.patientId === patientId);
}

export function getAppointment(id: string): Appointment | undefined {
  return listAppointments().find((a) => a.id === id);
}

export function saveAppointment(input: Omit<Appointment, "id" | "createdAt"> & { id?: string }): Appointment {
  const all = listAppointments();
  const now = new Date().toISOString();
  if (input.id) {
    const idx = all.findIndex((a) => a.id === input.id);
    if (idx >= 0) {
      const updated: Appointment = { ...all[idx], ...input } as Appointment;
      all[idx] = updated;
      writeArray(APPTS_KEY, all);
      return updated;
    }
  }
  const created: Appointment = { ...input, id: uid("apt"), createdAt: now } as Appointment;
  all.push(created);
  writeArray(APPTS_KEY, all);
  return created;
}

export function deleteAppointment(id: string) {
  const next = listAppointments().filter((a) => a.id !== id);
  writeArray(APPTS_KEY, next);
}

// Recipes
export function listRecipes(): Recipe[] {
  return readArray<Recipe>(RECIPES_KEY).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function listRecipesByPatient(patientId: string): Recipe[] {
  return listRecipes().filter((r) => r.patientId === patientId);
}

export function getRecipe(id: string): Recipe | undefined {
  return listRecipes().find((r) => r.id === id);
}

export function saveRecipe(input: Omit<Recipe, "id" | "createdAt"> & { id?: string }): Recipe {
  const all = listRecipes();
  const now = new Date().toISOString();
  if (input.id) {
    const idx = all.findIndex((r) => r.id === input.id);
    if (idx >= 0) {
      const updated: Recipe = { ...all[idx], ...input } as Recipe;
      all[idx] = updated;
      writeArray(RECIPES_KEY, all);
      return updated;
    }
  }
  const created: Recipe = { ...input, id: uid("rec"), createdAt: now } as Recipe;
  all.push(created);
  writeArray(RECIPES_KEY, all);
  return created;
}

export function deleteRecipe(id: string) {
  const next = listRecipes().filter((r) => r.id !== id);
  writeArray(RECIPES_KEY, next);
}

// Requisitions
export function listRequisitions(): Requisition[] {
  return readArray<Requisition>(REQS_KEY).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function listRequisitionsByPatient(patientId: string): Requisition[] {
  return listRequisitions().filter((r) => r.patientId === patientId);
}

export function getRequisition(id: string): Requisition | undefined {
  return listRequisitions().find((r) => r.id === id);
}

export function saveRequisition(input: Omit<Requisition, "id" | "createdAt"> & { id?: string }): Requisition {
  const all = listRequisitions();
  const now = new Date().toISOString();
  if (input.id) {
    const idx = all.findIndex((r) => r.id === input.id);
    if (idx >= 0) {
      const updated: Requisition = { ...all[idx], ...input } as Requisition;
      all[idx] = updated;
      writeArray(REQS_KEY, all);
      return updated;
    }
  }
  const created: Requisition = { ...input, id: uid("req"), createdAt: now } as Requisition;
  all.push(created);
  writeArray(REQS_KEY, all);
  return created;
}

export function deleteRequisition(id: string) {
  const next = listRequisitions().filter((r) => r.id !== id);
  writeArray(REQS_KEY, next);
}
// Seed a sample item for easier first run
export function ensureSeed() {
  if (typeof window === "undefined") return;
  const patients = listPatients();
  if (patients.length === 0) {
    const p = savePatient({ name: "João da Silva", email: "paciente@email.com", phone: "(53) 99999-9999" });
    saveAppointment({ patientId: p.id, datetime: new Date(Date.now() + 24 * 3600 * 1000).toISOString(), professionalName: "Dr. Teste", notes: "Retorno" });
    saveRecipe({ patientId: p.id, title: "Amoxicilina 500mg", notes: "Tomar a cada 8h" });
    saveRequisition({ patientId: p.id, title: "Exame de sangue completo", notes: "Jejum 8h" });
  }
}


