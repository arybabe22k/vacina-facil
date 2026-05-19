import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { get, patch } from "../../services/api";
import Link from "next/link";

function getInitials(nome = "") {
  return nome.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
}

const STATUS_BADGE = {
  PENDENTE: { label: "Pendente" },
  REALIZADO: { label: "Realizado" },
  ATRASADO: { label: "Atrasado" },
  CANCELADO: { label: "Cancelado" },
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

    Promise.all([
      get(`/utentes/${codigo}`),
      get(`/agendamentos/historico/${codigo}`)
    ])
      .then(([u, h]) => {
        setUtente(u);
        setHistorico(h);
      })
      .catch((err) => setErro(err.message))
      .finally(() => setLoading(false));
  }, [codigo]);

  async function marcarRealizado(e, id) {
    e.stopPropagation();

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

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#060A0F", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans',sans-serif" }}>
        <p style={{ color: "#4B5563", fontSize: 14 }}>A carregar...</p>
      </div>
    );
  }

  if (erro) {
    return (
      <div style={{ minHeight: "100vh", background: "#060A0F", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", fontFamily: "'DM Sans',sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#F87171", marginBottom: 16, fontSize: 14 }}>{erro}</p>
          <Link href="/" style={{ color: "#10B981", fontSize: 13, textDecoration: "none" }}>← Voltar</Link>
        </div>
      </div>
    );
  }

  return (
    <main style={{ minHeight: "100vh", background: "#060A0F", padding: "2rem 1rem", fontFamily: "'DM Sans',sans-serif", position: "relative", overflow: "hidden" }}>
      <div style={{ maxWidth: 560, margin: "0 auto", position: "relative", zIndex: 1 }}>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
          <Link href="/" style={{ fontSize: 13, color: "#4B5563", textDecoration: "none" }}>
            ← Início
          </Link>

          <span style={{ fontSize: 17, fontWeight: 600, color: "#F0FDF4" }}>
            Vacina<span style={{ color: "#10B981" }}>Fácil</span>
          </span>
        </div>

        {utente && (
          <div style={{ background: "#0D1117", border: "1px solid #1C2631", borderRadius: 16, padding: "1.4rem 1.5rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ width: 46, height: 46, borderRadius: 12, background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, fontWeight: 600, color: "#10B981" }}>
              {getInitials(utente.nome)}
            </div>

            <div>
              <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "#4B5563", margin: "0 0 3px" }}>
                Utente
              </p>
              <p style={{ fontSize: 17, fontWeight: 600, color: "#F0FDF4", margin: "0 0 6px" }}>
                {utente.nome}
              </p>

              <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, color: "#10B981", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 8, padding: "3px 10px", letterSpacing: "0.08em" }}>
                {utente.codigoUtente}
              </span>
            </div>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: "1.5rem" }}>
          {[
            { n: total, label: "Total", color: "#F0FDF4" },
            { n: realizados, label: "Realizadas", color: "#10B981" },
            { n: pendentes, label: "Pendentes", color: "#FBBF24" },
          ].map(({ n, label, color }) => (
            <div key={label} style={{ background: "#0D1117", border: "1px solid #1C2631", borderRadius: 12, padding: "14px 12px", textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 600, color }}>{n}</div>
              <div style={{ fontSize: 11, color: "#4B5563", marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem", gap: 10 }}>
          <span style={{ fontSize: 14, fontWeight: 500, color: "#9CA3AF" }}>
            Histórico vacinal
          </span>

          <Link href={`/agendar/${codigo}`} style={{ background: "#10B981", color: "#052e16", borderRadius: 10, padding: "9px 16px", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
            Agendar vacina
          </Link>
        </div>

        {historico.length === 0 ? (
          <div style={{ background: "#0D1117", border: "1px solid #1C2631", borderRadius: 16, padding: "3rem", textAlign: "center" }}>
            <p style={{ fontSize: 14, color: "#4B5563", margin: "0 0 4px" }}>
              Nenhum agendamento ainda.
            </p>
            <small style={{ fontSize: 12, color: "#2D3A47" }}>
              Clica em "Agendar vacina" para começar.
            </small>
          </div>
        ) : (
          <div>
            {historico.map((a) => {
              const data = new Date(a.dataAgendada + "T00:00:00").toLocaleDateString("pt-PT", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              });

              const badge = STATUS_BADGE[a.status] || { label: a.status };

              return (
                <div
                  key={a.id}
                  onClick={() => router.push(`/comprovativo/${a.id}`)}
                  style={{
                    background: "#0D1117",
                    border: "1px solid #1C2631",
                    borderRadius: 14,
                    padding: "1.1rem 1.25rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "1rem",
                    marginBottom: 10,
                    cursor: "pointer",
                  }}
                >
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 500, color: "#E5E7EB", margin: "0 0 4px" }}>
                      {a.nomeVacina}
                    </p>

                    <div style={{ fontSize: 12, color: "#4B5563", marginBottom: 3 }}>
                      {data} · Dose {a.numeroDose}
                    </div>

                    {a.nomeUnidade && (
                      <div style={{ fontSize: 12, color: "#6B7280" }}>
                        {a.nomeUnidade} · {a.distrito}
                      </div>
                    )}
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 500, padding: "3px 10px", borderRadius: 20, color: "#10B981", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)" }}>
                      {badge.label}
                    </span>

                    <Link
                      href={`/comprovativo/${a.id}`}
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        fontSize: 11.5,
                        color: "#10B981",
                        textDecoration: "none",
                      }}
                    >
                      Comprovativo
                    </Link>

                    {a.status === "PENDENTE" && (
                      <button
                        onClick={(e) => marcarRealizado(e, a.id)}
                        style={{
                          fontSize: 11.5,
                          color: "#2D3A47",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: 0,
                        }}
                      >
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
  );
}