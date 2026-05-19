import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { get, patch } from "../../services/api";

const STATUS_BADGE = {
  PENDENTE:  { label: "Pendente",  color: "#FBBF24", bg: "rgba(251,191,36,0.08)",   border: "rgba(251,191,36,0.25)"  },
  REALIZADO: { label: "Realizado", color: "#10B981", bg: "rgba(16,185,129,0.08)",   border: "rgba(16,185,129,0.25)"  },
  ATRASADO:  { label: "Atrasado",  color: "#F87171", bg: "rgba(248,113,113,0.08)",  border: "rgba(248,113,113,0.2)"  },
  CANCELADO: { label: "Cancelado", color: "#F87171", bg: "rgba(248,113,113,0.08)",  border: "rgba(248,113,113,0.2)"  },
};

const StatusIcon = ({ status }) => {
  if (status === "REALIZADO") return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M4 10L8.5 14.5L16 6" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
  if (status === "ATRASADO") return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 6v5M10 13v1" stroke="#F87171" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="10" cy="10" r="8" stroke="#F87171" strokeWidth="1.5"/>
    </svg>
  );
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="8" stroke="#FBBF24" strokeWidth="1.5"/>
      <path d="M10 6v5l3 2" stroke="#FBBF24" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
};

function InfoRow({ label, value, mono, last }) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"13px 0", borderBottom: last ? "none" : "1px solid #1C2631" }}>
      <span style={{ fontSize:12, color:"#4B5563", fontWeight:500 }}>{label}</span>
      <span style={{ fontSize:13, color:"#E5E7EB", fontFamily: mono ? "'Space Mono',monospace" : "'DM Sans',sans-serif", fontWeight:500 }}>
        {value}
      </span>
    </div>
  );
}

export default function DetalheAgendamento() {
  const router = useRouter();
  const { id } = router.query;
  const [agendamento, setAgendamento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [confirmando, setConfirmando] = useState(false);

  useEffect(() => {
    if (!id) return;
    get(`/agendamentos/${id}`)
      .then(setAgendamento)
      .catch((err) => setErro(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  async function marcarRealizado() {
    setConfirmando(true);
    try {
      const atualizado = await patch(`/agendamentos/${id}/status?status=REALIZADO`);
      setAgendamento(atualizado);
    } catch (err) {
      alert(err.message);
    } finally {
      setConfirmando(false);
    }
  }

  if (loading) return (
    <div style={{ minHeight:"100vh", background:"#060A0F", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'DM Sans',sans-serif" }}>
      <p style={{ color:"#4B5563", fontSize:14 }}>A carregar...</p>
    </div>
  );

  if (erro || !agendamento) return (
    <div style={{ minHeight:"100vh", background:"#060A0F", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'DM Sans',sans-serif" }}>
      <div style={{ textAlign:"center" }}>
        <p style={{ color:"#F87171", marginBottom:16, fontSize:14 }}>{erro || "Agendamento não encontrado."}</p>
        <button onClick={() => router.back()} style={{ color:"#10B981", fontSize:13, background:"none", border:"none", cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>← Voltar</button>
      </div>
    </div>
  );

  const badge = STATUS_BADGE[agendamento.status] || STATUS_BADGE["PENDENTE"];
  const dataAgendada = new Date(agendamento.dataAgendada + "T00:00:00").toLocaleDateString("pt-PT", { weekday:"long", day:"2-digit", month:"long", year:"numeric" });
  const criadoEm = agendamento.criadoEm
    ? new Date(agendamento.criadoEm).toLocaleDateString("pt-PT", { day:"2-digit", month:"long", year:"numeric", hour:"2-digit", minute:"2-digit" })
    : "—";

  return (
    <main style={{ minHeight:"100vh", background:"#060A0F", padding:"2rem 1rem", fontFamily:"'DM Sans',sans-serif", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", width:600, height:600, borderRadius:"50%", background:"radial-gradient(ellipse,rgba(16,185,129,0.06) 0%,transparent 70%)", top:-100, left:"50%", transform:"translateX(-50%)", pointerEvents:"none" }} />

      <div style={{ maxWidth:480, margin:"0 auto", position:"relative", zIndex:1 }}>

        {/* Topbar */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"2rem" }}>
          <button onClick={() => router.back()} className="vf-back" style={{ fontSize:13, color:"#4B5563", background:"none", border:"none", fontFamily:"'DM Sans',sans-serif", cursor:"pointer", display:"flex", alignItems:"center", gap:6, transition:"color .2s", padding:0 }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M10 2L4 7L10 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Voltar
          </button>
          <span style={{ fontSize:17, fontWeight:600, color:"#F0FDF4" }}>Vacina<span style={{ color:"#10B981" }}>Fácil</span></span>
        </div>

        {/* Hero card */}
        <div style={{ background:"#0D1117", border:"1px solid #1C2631", borderRadius:16, padding:"1.75rem", marginBottom:"1rem" }}>
          <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:"1.25rem" }}>
            <div style={{ width:52, height:52, borderRadius:14, background:badge.bg, border:`1px solid ${badge.border}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <StatusIcon status={agendamento.status} />
            </div>
            <div>
              <p style={{ fontSize:11, fontWeight:500, letterSpacing:"0.08em", textTransform:"uppercase", color:"#4B5563", margin:"0 0 4px" }}>Vacina</p>
              <h1 style={{ fontSize:20, fontWeight:600, color:"#F0FDF4", margin:0 }}>{agendamento.nomeVacina}</h1>
            </div>
          </div>
          <span style={{ fontSize:12, fontWeight:500, padding:"4px 12px", borderRadius:20, background:badge.bg, border:`1px solid ${badge.border}`, color:badge.color }}>
            {badge.label}
          </span>
        </div>

        {/* Detalhes */}
        <div style={{ background:"#0D1117", border:"1px solid #1C2631", borderRadius:16, padding:"0 1.25rem", marginBottom:"1rem" }}>
          <InfoRow label="Utente"         value={agendamento.nomeUtente} />
          <InfoRow label="Código"         value={agendamento.codigoUtente} mono />
          <InfoRow label="Data agendada"  value={dataAgendada} />
          <InfoRow label="Número da dose" value={`Dose ${agendamento.numeroDose}`} />
          <InfoRow label="Estado"         value={badge.label} />
          <InfoRow label="Registado em"   value={criadoEm} last />
        </div>

        {/* Acções */}
        {agendamento.status === "PENDENTE" && (
          <button
            onClick={marcarRealizado}
            disabled={confirmando}
            style={{ width:"100%", background:"#10B981", color:"#052e16", border:"none", borderRadius:12, padding:14, fontSize:14, fontWeight:600, fontFamily:"'DM Sans',sans-serif", cursor: confirmando ? "not-allowed" : "pointer", opacity: confirmando ? 0.5 : 1, transition:"all .15s", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}
          >
            {confirmando ? "A confirmar..." : (
              <>
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <path d="M2.5 7.5L6 11L12.5 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Marcar como realizado
              </>
            )}
          </button>
        )}

        {agendamento.status === "REALIZADO" && (
          <div style={{ background:"rgba(16,185,129,0.06)", border:"1px solid rgba(16,185,129,0.2)", borderRadius:12, padding:"14px 16px", display:"flex", alignItems:"center", gap:10 }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8L6.5 11.5L13 4.5" stroke="#10B981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p style={{ fontSize:13, color:"#10B981", margin:0 }}>Vacina administrada com sucesso.</p>
          </div>
        )}

        {agendamento.status === "ATRASADO" && (
          <div style={{ background:"rgba(248,113,113,0.06)", border:"1px solid rgba(248,113,113,0.2)", borderRadius:12, padding:"14px 16px", display:"flex", alignItems:"center", gap:10 }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 5v4M8 11v1" stroke="#F87171" strokeWidth="1.8" strokeLinecap="round"/>
              <circle cx="8" cy="8" r="6" stroke="#F87171" strokeWidth="1.5"/>
            </svg>
            <p style={{ fontSize:13, color:"#F87171", margin:0 }}>Este agendamento está em atraso. Contacta o centro de saúde.</p>
          </div>
        )}

      </div>
    </main>
  );
}