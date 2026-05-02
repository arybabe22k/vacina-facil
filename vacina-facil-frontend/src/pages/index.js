import { useState } from "react";
import { useRouter } from "next/router";
import { post } from "../services/api";

export default function Home() {
  const router = useRouter();
  const [modo, setModo] = useState("entrar");
  const [codigo, setCodigo] = useState("");
  const [form, setForm] = useState({ nome: "", dataNascimento: "", telefone: "", bi: "" });
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  function handleEntrar(e) {
    e.preventDefault();
    if (!codigo.trim()) return setErro("Introduz o teu código de utente.");
    router.push(`/historico/${codigo.trim().toUpperCase()}`);
  }

  async function handleRegistar(e) {
    e.preventDefault();
    setErro("");
    setLoading(true);
    try {
      const utente = await post("/utentes", form);
      router.push(`/historico/${utente.codigoUtente}`);
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{`
        .vf-input-code {
          font-family: 'Space Mono', monospace !important;
          font-size: 18px !important;
          letter-spacing: 0.18em !important;
          text-align: center !important;
        }
        .vf-input:focus { border-color: #10B981 !important; }
        .vf-btn:hover:not(:disabled) { background: #059669 !important; transform: translateY(-1px); }
        .vf-btn:active:not(:disabled) { transform: translateY(0); }
        .vf-tab-active { background: #10B981 !important; color: #052e16 !important; }
      `}</style>

      <main
        style={{
          minHeight: "100vh",
          background: "#060A0F",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem 1rem",
          fontFamily: "'DM Sans', sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(16,185,129,0.07) 0%, transparent 70%)",
            top: -100,
            left: "50%",
            transform: "translateX(-50%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ width: "100%", maxWidth: 420, position: "relative", zIndex: 1 }}>

          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{ width: 38, height: 38, background: "#10B981", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2L12.5 7.5H18L13.5 11L15.5 17L10 13.5L4.5 17L6.5 11L2 7.5H7.5L10 2Z" fill="white" opacity="0.9"/>
                </svg>
              </div>
              <h1 style={{ fontSize: 26, fontWeight: 600, color: "#F0FDF4", letterSpacing: "-0.5px", margin: 0 }}>
                Vacina<span style={{ color: "#10B981" }}>Fácil</span>
              </h1>
            </div>
            <p style={{ fontSize: 13, color: "#4B5563", margin: 0, letterSpacing: "0.02em" }}>
              Gestão vacinal simples, sem necessidade de conta
            </p>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", background: "#0D1117", border: "1px solid #1C2631", borderRadius: 12, padding: 4, marginBottom: "1.5rem" }}>
            {[{ key: "entrar", label: "Já tenho código" }, { key: "registar", label: "Registar" }].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => { setModo(key); setErro(""); }}
                className={modo === key ? "vf-tab-active" : ""}
                style={{
                  flex: 1, padding: "9px", borderRadius: 9, border: "none",
                  fontSize: 13, fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
                  cursor: "pointer", transition: "all 0.2s",
                  background: "transparent", color: modo === key ? "#052e16" : "#4B5563",
                }}
              >{label}</button>
            ))}
          </div>

          {/* Panel */}
          <div style={{ background: "#0D1117", border: "1px solid #1C2631", borderRadius: 16, padding: "1.75rem" }}>
            {modo === "entrar" ? (
              <form onSubmit={handleEntrar}>
                <div style={{ textAlign: "center", marginBottom: "1.25rem" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, color: "#065f46", background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 20, padding: "3px 10px", fontWeight: 500, marginBottom: "0.75rem" }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#10B981", display: "inline-block" }} />
                    Acesso rápido
                  </span>
                  <p style={{ fontSize: 13, color: "#4B5563", margin: 0 }}>
                    Introduz o teu código de utente para aceder ao teu histórico vacinal.
                  </p>
                </div>
                <div style={{ marginBottom: "1.1rem" }}>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "#4B5563", marginBottom: 6 }}>
                    Código do utente
                  </label>
                  <input
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                    placeholder="VF004821"
                    maxLength={10}
                    className="vf-input vf-input-code"
                    style={{ width: "100%", background: "#060A0F", border: "1px solid #1C2631", borderRadius: 10, padding: "11px 14px", color: "#E5E7EB", boxSizing: "border-box", outline: "none", transition: "border-color 0.2s" }}
                  />
                  <p style={{ fontSize: 12, color: "#2D3A47", marginTop: 5 }}>Código recebido no momento do registo</p>
                </div>
                {erro && <div style={{ fontSize: 12.5, color: "#F87171", padding: "8px 12px", background: "rgba(248,113,113,0.07)", border: "1px solid rgba(248,113,113,0.15)", borderRadius: 8, marginBottom: "0.75rem" }}>{erro}</div>}
                <button type="submit" className="vf-btn" style={{ width: "100%", background: "#10B981", color: "#052e16", border: "none", borderRadius: 12, padding: 13, fontSize: 14, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: "pointer", transition: "all 0.15s", marginTop: "0.5rem", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  Ver histórico
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7H12M8 3L12 7L8 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegistar}>
                <div style={{ marginBottom: "1.1rem" }}>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "#4B5563", marginBottom: 6 }}>Nome completo</label>
                  <input className="vf-input" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="João Maputo" style={{ width: "100%", background: "#060A0F", border: "1px solid #1C2631", borderRadius: 10, padding: "11px 14px", fontSize: 14, color: "#E5E7EB", fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box", outline: "none", transition: "border-color 0.2s" }} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: "1.1rem" }}>
                  {[{ label: "Nascimento", key: "dataNascimento", type: "date" }, { label: "Telefone", key: "telefone", type: "text", placeholder: "841234567" }].map(({ label, key, type, placeholder }) => (
                    <div key={key}>
                      <label style={{ display: "block", fontSize: 11, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "#4B5563", marginBottom: 6 }}>{label}</label>
                      <input className="vf-input" type={type} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} placeholder={placeholder} style={{ width: "100%", background: "#060A0F", border: "1px solid #1C2631", borderRadius: 10, padding: "11px 14px", fontSize: 14, color: "#E5E7EB", fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box", outline: "none", transition: "border-color 0.2s" }} />
                    </div>
                  ))}
                </div>
                <div style={{ marginBottom: "1.1rem" }}>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "#4B5563", marginBottom: 6 }}>
                    BI <span style={{ color: "#2D3A47", textTransform: "none", fontSize: 11, letterSpacing: 0 }}>(opcional)</span>
                  </label>
                  <input className="vf-input" value={form.bi} onChange={(e) => setForm({ ...form, bi: e.target.value })} placeholder="123456789A" style={{ width: "100%", background: "#060A0F", border: "1px solid #1C2631", borderRadius: 10, padding: "11px 14px", fontSize: 14, color: "#E5E7EB", fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box", outline: "none", transition: "border-color 0.2s" }} />
                </div>
                {erro && <div style={{ fontSize: 12.5, color: "#F87171", padding: "8px 12px", background: "rgba(248,113,113,0.07)", border: "1px solid rgba(248,113,113,0.15)", borderRadius: 8, marginBottom: "0.75rem" }}>{erro}</div>}
                <button type="submit" disabled={loading} className="vf-btn" style={{ width: "100%", background: "#10B981", color: "#052e16", border: "none", borderRadius: 12, padding: 13, fontSize: 14, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.5 : 1, transition: "all 0.15s", marginTop: "0.5rem", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  {loading ? "A registar..." : (<>Registar e continuar <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7H12M8 3L12 7L8 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg></>)}
                </button>
              </form>
            )}
          </div>

          <p style={{ textAlign: "center", fontSize: 11.5, color: "#2D3A47", marginTop: "1.25rem" }}>
            O teu código é gerado automaticamente no registo
          </p>
        </div>
      </main>
    </>
  );
}