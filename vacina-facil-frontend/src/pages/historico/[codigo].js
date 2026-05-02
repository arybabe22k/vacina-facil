import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { get, patch } from "../../services/api";
import Link from "next/link";

function getInitials(nome = "") {
  return nome.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
}

const STATUS_BADGE = {
  PENDENTE:  { label: "Pendente",  cls: "badge-pendente"  },
  REALIZADO: { label: "Realizado", cls: "badge-realizado" },
  CANCELADO: { label: "Cancelado", cls: "badge-cancelado" },
};

const VaccineIcon = ({ status }) => {
  if (status === "REALIZADO") return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 8L6.5 11.5L13 4.5" stroke="#10B981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
  if (status === "PENDENTE") return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="5.5" stroke="#FBBF24" strokeWidth="1.5"/>
      <path d="M8 5.5V8.5L10 10" stroke="#FBBF24" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M5 5L11 11M11 5L5 11" stroke="#F87171" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
};

export default function Historico() {
  const router = useRouter();
  const { codigo } = router.query;
  const [utente, setUtente] = useState(null);
  const [historico, setHistorico] = useState([]);
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!codigo) return;
    Promise.all([get(`/utentes/${codigo}`), get(`/agendamentos/historico/${codigo}`)])
      .then(([u, h]) => { setUtente(u); setHistorico(h); })
      .catch((err) => setErro(err.message))
      .finally(() => setLoading(false));
  }, [codigo]);

  async function marcarRealizado(id) {
    try {
      const atualizado = await patch(`/agendamentos/${id}/status?status=REALIZADO`);
      setHistorico((prev) => prev.map((a) => (a.id === id ? atualizado : a)));
    } catch (err) {
      alert(err.message);
    }
  }

  const total = historico.length;
  const realizados = historico.filter((a) => a.status === "REALIZADO").length;
  const pendentes = historico.filter((a) => a.status === "PENDENTE").length;

  if (loading) return (
    <div style={{ minHeight:"100vh", background:"#060A0F", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'DM Sans',sans-serif" }}>
      <style>{`@keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}`}</style>
      <p style={{ color:"#4B5563", fontSize:14, animation:"pulse 1.5s infinite" }}>A carregar...</p>
    </div>
  );

  if (erro) return (
    <div style={{ minHeight:"100vh", background:"#060A0F", display:"flex", alignItems:"center", justifyContent:"center", padding:"1rem", fontFamily:"'DM Sans',sans-serif" }}>
      <div style={{ textAlign:"center" }}>
        <p style={{ color:"#F87171", marginBottom:16, fontSize:14 }}>{erro}</p>
        <Link href="/" style={{ color:"#10B981", fontSize:13, textDecoration:"none" }}>← Voltar</Link>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}
        .vf-back:hover{color:#E5E7EB !important;}
        .vf-item{transition:border-color .2s;}
        .vf-item:hover{border-color:#2D3A47 !important;}
        .vf-btn-ag:hover{background:#059669 !important;transform:translateY(-1px);}
        .vf-marcar:hover{color:#10B981 !important;}
        .badge-pendente{color:#FBBF24;background:rgba(251,191,36,0.08);border:1px solid rgba(251,191,36,0.25);}
        .badge-realizado{color:#10B981;background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.25);}
        .badge-cancelado{color:#F87171;background:rgba(248,113,113,0.08);border:1px solid rgba(248,113,113,0.2);}
      `}</style>

      <main style={{ minHeight:"100vh", background:"#060A0F", padding:"2rem 1rem", fontFamily:"'DM Sans',sans-serif", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", width:600, height:600, borderRadius:"50%", background:"radial-gradient(ellipse,rgba(16,185,129,0.06) 0%,transparent 70%)", top:-100, left:"50%", transform:"translateX(-50%)", pointerEvents:"none" }} />

        <div style={{ maxWidth:560, margin:"0 auto", position:"relative", zIndex:1 }}>

          {/* Topbar */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"2rem" }}>
            <Link href="/" className="vf-back" style={{ fontSize:13, color:"#4B5563", textDecoration:"none", display:"flex", alignItems:"center", gap:6, transition:"color .2s" }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M10 2L4 7L10 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Início
            </Link>
            <span style={{ fontSize:17, fontWeight:600, color:"#F0FDF4" }}>Vacina<span style={{ color:"#10B981" }}>Fácil</span></span>
          </div>

          {/* Utente card */}
          {utente && (
            <div style={{ background:"#0D1117", border:"1px solid #1C2631", borderRadius:16, padding:"1.4rem 1.5rem", marginBottom:"1.5rem", display:"flex", alignItems:"center", gap:"1rem" }}>
              <div style={{ width:46, height:46, borderRadius:12, background:"rgba(16,185,129,0.12)", border:"1px solid rgba(16,185,129,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, fontWeight:600, color:"#10B981", flexShrink:0 }}>
                {getInitials(utente.nome)}
              </div>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:11, fontWeight:500, letterSpacing:"0.08em", textTransform:"uppercase", color:"#4B5563", margin:"0 0 3px" }}>Utente</p>
                <p style={{ fontSize:17, fontWeight:600, color:"#F0FDF4", margin:"0 0 6px" }}>{utente.nome}</p>
                <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                  <span style={{ fontFamily:"'Space Mono',monospace", fontSize:12, color:"#10B981", background:"rgba(16,185,129,0.1)", border:"1px solid rgba(16,185,129,0.2)", borderRadius:8, padding:"3px 10px", letterSpacing:"0.08em" }}>{utente.codigoUtente}</span>
                  {utente.telefone && <span style={{ fontSize:12, color:"#4B5563" }}>📱 {utente.telefone}</span>}
                </div>
              </div>
            </div>
          )}

          {/* Stats */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:"1.5rem" }}>
            {[{ n:total, label:"Total", color:"#F0FDF4" }, { n:realizados, label:"Realizadas", color:"#10B981" }, { n:pendentes, label:"Pendentes", color:"#FBBF24" }].map(({ n, label, color }) => (
              <div key={label} style={{ background:"#0D1117", border:"1px solid #1C2631", borderRadius:12, padding:"14px 12px", textAlign:"center" }}>
                <div style={{ fontSize:22, fontWeight:600, color }}>{n}</div>
                <div style={{ fontSize:11, color:"#4B5563", marginTop:2 }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Section header */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"1rem" }}>
            <span style={{ fontSize:14, fontWeight:500, color:"#9CA3AF", letterSpacing:"0.03em" }}>Histórico vacinal</span>
            <Link href={`/agendar/${codigo}`} className="vf-btn-ag" style={{ background:"#10B981", color:"#052e16", borderRadius:10, padding:"9px 16px", fontSize:13, fontWeight:600, fontFamily:"'DM Sans',sans-serif", display:"flex", alignItems:"center", gap:6, transition:"all .15s", textDecoration:"none" }}>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1V12M1 6.5H12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
              Agendar vacina
            </Link>
          </div>

          {/* Lista */}
          {historico.length === 0 ? (
            <div style={{ background:"#0D1117", border:"1px solid #1C2631", borderRadius:16, padding:"3rem", textAlign:"center" }}>
              <p style={{ fontSize:14, color:"#4B5563", margin:"0 0 4px" }}>Nenhum agendamento ainda.</p>
              <small style={{ fontSize:12, color:"#2D3A47" }}>Clica em "Agendar vacina" para começar.</small>
            </div>
          ) : (
            <div>
              {historico.map((a) => {
                const data = new Date(a.dataAgendada + "T00:00:00").toLocaleDateString("pt-PT", { day:"2-digit", month:"short", year:"numeric" });
                const badge = STATUS_BADGE[a.status] || { label: a.status, cls: "" };
                return (
                  <div key={a.id} className="vf-item" style={{ background:"#0D1117", border:"1px solid #1C2631", borderRadius:14, padding:"1.1rem 1.25rem", display:"flex", alignItems:"center", justifyContent:"space-between", gap:"1rem", marginBottom:10 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                      <div style={{ width:38, height:38, borderRadius:10, background:"#111827", border:"1px solid #1C2631", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                        <VaccineIcon status={a.status} />
                      </div>
                      <div>
                        <p style={{ fontSize:14, fontWeight:500, color:"#E5E7EB", margin:"0 0 4px" }}>{a.nomeVacina}</p>
                        <div style={{ fontSize:12, color:"#4B5563", display:"flex", alignItems:"center", gap:6 }}>
                          {data}
                          <span style={{ width:3, height:3, borderRadius:"50%", background:"#2D3A47", display:"inline-block" }} />
                          Dose {a.numeroDose}
                        </div>
                      </div>
                    </div>
                    <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:6, flexShrink:0 }}>
                      <span className={`badge ${badge.cls}`} style={{ fontSize:11, fontWeight:500, padding:"3px 10px", borderRadius:20, whiteSpace:"nowrap" }}>{badge.label}</span>
                      {a.status === "PENDENTE" && (
                        <button onClick={() => marcarRealizado(a.id)} className="vf-marcar" style={{ fontSize:11.5, color:"#2D3A47", background:"none", border:"none", fontFamily:"'DM Sans',sans-serif", cursor:"pointer", padding:0, transition:"color .2s" }}>
                          Marcar como realizado
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
