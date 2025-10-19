"use client";

import React from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { Button } from "@/components/ui/Button";
import { IoChatboxEllipses } from "react-icons/io5";
import { CiVolumeHigh } from "react-icons/ci";
import { FaMicrophoneLines, FaMicrophoneLinesSlash } from "react-icons/fa6";
import { listAppointments, listPatients } from "@/lib/data/store";

export default function VideoCallPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const params = useSearchParams();
  const apptId = params.get("id") || "";
  const [showChat, setShowChat] = React.useState(false);
  const [muted, setMuted] = React.useState(false);
  const [volume, setVolume] = React.useState(70);
  const [showVolume, setShowVolume] = React.useState(false);
  const volumeRef = React.useRef<HTMLInputElement | null>(null);

  // Get selected appointment (by id) or fallback to latest
  const latest = React.useMemo(() => {
    const all = listAppointments();
    return apptId ? all.find(a => a.id === apptId) || all[0] : all[0];
  }, [apptId]);
  const patients = React.useMemo(() => listPatients(), []);
  const patientName = latest ? (patients.find(p => p.id === latest.patientId)?.name || "Paciente") : "Paciente";
  const patientSex = React.useMemo(() => {
    const p = latest ? patients.find(px => px.id === latest.patientId) : undefined;
    return p?.sex || "F";
  }, [latest, patients]);
  const senderDisplayName = user?.role === "paciente" ? patientName : (user?.name || "Profissional");

  React.useEffect(() => { if (!isAuthenticated) router.replace("/login"); }, [isAuthenticated, router]);
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen p-4 container-responsive">
      <div className="mx-auto w-full max-w-2xl grid gap-4">
        <div className="rounded-2xl bg-[#898AC4] p-4 text-white flex items-center justify-between">
          <div>VideoConsulta</div>
          <Button variant="secondary" onClick={() => router.back()}>Voltar</Button>
        </div>
          <div className="rounded-2xl bg-[#C0C9EE] p-4 grid gap-4">
          <div className="rounded-xl bg-white/80 p-3 text-black/80 text-center">
            {(() => {
              try {
                const doctorFromQuery = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('doctor') : null;
                const uRaw = typeof window !== 'undefined' ? window.localStorage.getItem('boasaude.auth.user') : null;
                const u = uRaw ? JSON.parse(uRaw) : null;
                if (!u) return 'VideoConsulta';
                if (u.role === 'profissional' || u.role === 'admin') return `Paciente - ${patientName}`;
                return u.role === 'paciente' ? (doctorFromQuery || latest?.professionalName || 'Profissional') : 'VideoConsulta';
              } catch { return 'VideoConsulta'; }
            })()}
          </div>
          <div className="relative w-full rounded-xl overflow-hidden bg-black/10 video-box">
            <Image src={(() => {
              // Determinar imagem pelo papel/sexo
              if (typeof window !== 'undefined') {
                try {
                  const u = JSON.parse(window.localStorage.getItem('boasaude.auth.user') || 'null');
                  if (u?.role === 'paciente') return '/medicoatendimento.png';
                  return patientSex === 'M' ? '/pacienteMasculino.png' : '/pacienteFeminino.png';
                } catch { /* ignore */ }
              }
              return '/medicoatendimento.png';
            })()} alt="Video placeholder" fill className="object-cover" priority />

            {/* Overlay controls */}
            <div className="absolute bottom-3 left-0 right-0 grid place-items-center">
              <div className="flex items-center gap-3 rounded-full bg-black/40 px-3 py-2 opacity-60 hover:opacity-100 focus-within:opacity-100 transition">
                <Button variant="secondary" onClick={() => setShowChat((v) => !v)} aria-label="Chat" className="!h-10 !px-3"><IoChatboxEllipses size={18} /></Button>
                <div className="relative">
                  <Button variant="secondary" onClick={() => { setShowVolume(true); setTimeout(() => volumeRef.current?.focus(), 0); }} aria-label="Volume" className="!h-10 !px-3"><CiVolumeHigh size={18} /></Button>
                  {showVolume && (
                    <div className="absolute left-1/2 -translate-x-1/2 -top-12 bg-white/90 text-black rounded-lg px-3 py-2 shadow">
                      <input ref={volumeRef} type="range" min={0} max={100} value={volume}
                        onChange={(e) => setVolume(parseInt(e.target.value))}
                        onBlur={() => setShowVolume(false)} />
                      <span className="text-xs ml-2">{volume}%</span>
                    </div>
                  )}
                </div>
                <Button variant="secondary" onClick={() => setMuted((m) => !m)} aria-label="Microfone" className="!h-10 !px-3">{muted ? <FaMicrophoneLinesSlash size={18} /> : <FaMicrophoneLines size={18} />}</Button>
              </div>
            </div>
          </div>
          {showChat && (
            <ChatBox senderName={senderDisplayName} />
          )}
        </div>
      </div>
    </div>
  );
}

function ChatBox({ senderName }: { senderName: string }) {
  const [input, setInput] = React.useState("");
  const [messages, setMessages] = React.useState<string[]>([]);
  const listRef = React.useRef<HTMLDivElement | null>(null);

  function send(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setMessages((m) => [...m, `${senderName}: ${text}`]);
    setInput("");
    setTimeout(() => { listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' }); }, 0);
  }

  return (
    <div className="rounded-xl bg-white/90 p-3 text-black grid gap-2 max-h-60">
      <div ref={listRef} className="max-h-40 overflow-y-auto pr-2">
        {messages.map((m, i) => (
          <div key={i} className="text-sm mb-1">{m}</div>
        ))}
      </div>
      <form onSubmit={send} className="flex gap-2">
        <input className="h-10 flex-1 rounded-lg bg-black/5 px-3" placeholder="Digite uma mensagem..." value={input} onChange={(e) => setInput(e.target.value)} />
        <Button type="submit" className="!h-10">Enviar</Button>
      </form>
    </div>
  );
}


