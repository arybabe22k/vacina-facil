import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { get, post } from "../../services/api";
import Link from "next/link";

const STEPS = ["Escolhe a vacina", "Escolhe a data", "Confirma o agendamento"];

function StepIndicator({ current }) {
  return (
    <div style={{ display:"flex", alignItems:"center", marginBottom:"1.5rem" }}>
      {[1,2,3].map((n, i) => (
        <div key={n} style={{ display:"flex", alignItems:"center", flex: i < 2 ? 1 : "none" }}>
          <div style={{ width:22, height:22, borderRadius:"50%", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:600, background: n <= current ? "#10B981" : "#060A0F", border: n <= current ? "1px solid #10B981" : "1px solid #1C2631", color: n <= current ? "#052e16" : "#4B5563", transition:"all .3s" }}>{n}</div>
          {i < 2 && <div style={{ flex:1, height:1, background:"#1C2631" }} />}
        </div>
      ))}
    </div>
  );
}

export default function Agendar() {
  const router = useRouter();
  const { codigo } = router.query;
  const [vacinas, setVacinas] = useState([]);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ vacinaId:"", dataAgendada: "", numeroDose:1 });
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    get("/vacinas").then(setVacinas).catch(console.error);
    setForm((f) => ({ ...f, dataAgendada: new Date().toISOString().split("T")[0] }));
  }, []);

  const today = new Date().toISOString().split("T")[0];
  const vacinaSel = vacinas.find((v) => v.id === Number(form.vacinaId));

  async function handleSubmit() {
    setErro("");
    setLoading(true);
    try {
      await post("/agendamentos", { ...form, codigoUtente: codigo, vacinaId: Number(form.vacinaId) });
      router.push(`/historico/${codigo}`);
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  }

  const btnStyle = { width:"100%", background:"#10B981", color:"#052e16", border:"none", borderRadius:12, padding:13, fontSize:14, fontWeight:600, fontFamily:"'DM Sans',sans-serif", cursor:"pointer", transition:"all .15s", display:"flex", alignItems:"center", justifyContent:"center", gap:8 };
  const inputStyle = { width:"100%", background:"#060A0F", border:"1px solid #1C2631", borderRadius:10, padding:"11px 14px", fontSize:14, color:"#E5E7EB", fontFamily:"'DM Sans',sans-serif", boxSizing:"border-box", outline:"none", transition:"border-color .2s" };
  const labelStyle = { display:"block", fontSize:11, fontWeight:500, letterSpacing:"0.08em", textTransform:"uppercase", color:"#4B5563", marginBottom:6 };

  return (
    <>
      <style>{`
        .vf-vc{transition:all .15s;}
        .vf-vc:hover{border-color:#2D3A47 !important;}
        .vf-vc.sel{border-color:#10B981 !important;background:rgba(16,185,129,0.06) !important;}
        .vf-dose-btn:hover{border-color:#10B981 !important;color:#10B981 !important;}
        .vf-back:hover{color:#E5E7EB !important;}
        .vf-btn:hover:not(:disabled){background:#059669 !important;transform:translateY(-1px);}
        .vf-input:focus{border-color:#10B981 !important;}
      `}</style>

      <main style={{ minHeight:"100vh", background:"#060A0F", display:"flex", alignItems:"center", justifyContent:"center", padding:"2rem 1rem", fontFamily:"'DM Sans',sans-serif", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", width:600, height:600, borderRadius:"50%", background:"radial-gradient(ellipse,rgba(16,185,129,0.06) 0%,transparent 70%)", top:-100, left:"50%", transform:"translateX(-50%)", pointerEvents:"none" }} />

        <div style={{ width:"100%", maxWidth:420, position:"relative", zIndex:1 }}>

          {/* Topbar */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"2rem" }}>
            <Link href={`/historico/${codigo}`} className="vf-back" style={{ fontSize:13, color:"#4B5563", textDecoration:"none", display:"flex", alignItems:"center", gap:6, transition:"color .2s" }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M10 2L4 7L10 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Voltar
            </Link>
            <span style={{ fontSize:17, fontWeight:600, color:"#F0FDF4" }}>Vacina<span style={{ color:"#10B981" }}>Fácil</span></span>
          </div>

          {/* Panel */}
          <div style={{ background:"#0D1117", border:"1px solid #1C2631", borderRadius:16, padding:"1.75rem" }}>
            <StepIndicator current={step} />
            <p style={{ fontSize:16, fontWeight:600, color:"#F0FDF4", margin:"0 0 1.5rem" }}>{STEPS[step - 1]}</p>

            {/* Step 1 */}
            {step === 1 && (
              <>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:"1rem" }}>
                  {vacinas.map((v) => (
                    <button key={v.id} onClick={() => setForm({ ...form, vacinaId: String(v.id) })} className={`vf-vc${form.vacinaId === String(v.id) ? " sel" : ""}`} style={{ background:"#060A0F", border:"1px solid #1C2631", borderRadius:10, padding:"10px 12px", cursor:"pointer", textAlign:"left" }}>
                      <div style={{ fontSize:13, fontWeight:500, color:"#E5E7EB" }}>{v.nome}</div>
                      {v.doses && <div style={{ fontSize:11, color:"#4B5563", marginTop:2 }}>{v.doses} dose{v.doses > 1 ? "s" : ""}</div>}
                    </button>
                  ))}
                </div>
                <button disabled={!form.vacinaId} onClick={() => setStep(2)} className="vf-btn" style={{ ...btnStyle, opacity: form.vacinaId ? 1 : 0.4, cursor: form.vacinaId ? "pointer" : "not-allowed" }}>
                  Continuar <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7H12M8 3L12 7L8 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <>
                <div style={{ display:"flex", alignItems:"flex-start", gap:8, background:"rgba(16,185,129,0.05)", border:"1px solid rgba(16,185,129,0.15)", borderRadius:10, padding:"10px 12px", marginBottom:"1.1rem" }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink:0, marginTop:1 }}><circle cx="7" cy="7" r="6" stroke="#10B981" strokeWidth="1.2"/><path d="M7 6V10M7 4.5V5" stroke="#10B981" strokeWidth="1.4" strokeLinecap="round"/></svg>
                  <p style={{ fontSize:12, color:"#4B5563", margin:0, lineHeight:1.5 }}>A data não pode ser anterior a hoje. Escolhe um dia disponível no centro de saúde.</p>
                </div>
                <div style={{ marginBottom:"1.1rem" }}>
                  <label style={labelStyle}>Data agendada</label>
                  <input type="date" className="vf-input" value={form.dataAgendada} min={today} onChange={(e) => setForm({ ...form, dataAgendada: e.target.value })} style={inputStyle} />
                </div>
                <button onClick={() => setStep(3)} className="vf-btn" style={btnStyle}>
                  Continuar <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7H12M8 3L12 7L8 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <>
                <div style={{ marginBottom:"1.1rem" }}>
                  <label style={labelStyle}>Número da dose</label>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <button onClick={() => setForm({ ...form, numeroDose: Math.max(1, form.numeroDose - 1) })} className="vf-dose-btn" style={{ width:36, height:36, borderRadius:9, background:"#060A0F", border:"1px solid #1C2631", color:"#9CA3AF", fontSize:18, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", transition:"all .15s", flexShrink:0, fontFamily:"'DM Sans',sans-serif" }}>−</button>
                    <div style={{ flex:1, textAlign:"center", background:"#060A0F", border:"1px solid #1C2631", borderRadius:10, padding:9, fontSize:16, fontWeight:600, color:"#F0FDF4", fontFamily:"'Space Mono',monospace" }}>{form.numeroDose}</div>
                    <button onClick={() => setForm({ ...form, numeroDose: Math.min(10, form.numeroDose + 1) })} className="vf-dose-btn" style={{ width:36, height:36, borderRadius:9, background:"#060A0F", border:"1px solid #1C2631", color:"#9CA3AF", fontSize:18, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", transition:"all .15s", flexShrink:0, fontFamily:"'DM Sans',sans-serif" }}>+</button>
                  </div>
                </div>

                {/* Resumo */}
                <div style={{ background:"#060A0F", border:"1px solid #1C2631", borderRadius:10, padding:"12px 14px", marginBottom:"1.1rem" }}>
                  <p style={{ fontSize:11, fontWeight:500, letterSpacing:"0.08em", textTransform:"uppercase", color:"#4B5563", margin:"0 0 8px" }}>Resumo</p>
                  {[
                    { label:"Vacina", val: vacinaSel?.nome ?? "—" },
                    { label:"Data", val: form.dataAgendada ? new Date(form.dataAgendada + "T00:00:00").toLocaleDateString("pt-PT", { day:"2-digit", month:"long", year:"numeric" }) : "—" },
                    { label:"Dose", val: `Dose ${form.numeroDose}` },
                  ].map(({ label, val }) => (
                    <div key={label} style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginBottom:4 }}>
                      <span style={{ color:"#4B5563" }}>{label}</span>
                      <span style={{ color:"#E5E7EB", fontWeight:500 }}>{val}</span>
                    </div>
                  ))}
                </div>

                {erro && <div style={{ fontSize:12.5, color:"#F87171", padding:"8px 12px", background:"rgba(248,113,113,0.07)", border:"1px solid rgba(248,113,113,0.15)", borderRadius:8, marginBottom:"0.75rem" }}>{erro}</div>}

                <button onClick={handleSubmit} disabled={loading} className="vf-btn" style={{ ...btnStyle, opacity: loading ? 0.5 : 1, cursor: loading ? "not-allowed" : "pointer" }}>
                  {loading ? "A agendar..." : (<>Confirmar agendamento <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7H12M8 3L12 7L8 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg></>)}
                </button>
              </>
            )}
          </div>
        </div>
      </main>
    </>
  );
}