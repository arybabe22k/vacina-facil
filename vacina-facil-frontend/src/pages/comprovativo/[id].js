import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { get } from "../../services/api";
import Link from "next/link";

export default function Comprovativo() {
  const router = useRouter();
  const { id } = router.query;

  const [agendamento, setAgendamento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (!id) return;

    get(`/agendamentos/${id}`)
      .then(setAgendamento)
      .catch((err) => setErro(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p style={{ padding: 30 }}>A carregar comprovativo...</p>;
  if (erro) return <p style={{ padding: 30, color: "red" }}>{erro}</p>;

  return (
    <>
      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }

          body {
            background: white !important;
          }

          .page {
            background: white !important;
            padding: 0 !important;
          }

          .comprovativo {
            box-shadow: none !important;
            border-radius: 0 !important;
            width: 100% !important;
          }
        }

        @media (max-width: 600px) {
          .comprovativo {
            padding: 1.2rem !important;
          }

          .linha {
            flex-direction: column !important;
            gap: 4px !important;
          }

          .linha strong {
            text-align: left !important;
          }
        }
      `}</style>

      <main
        className="page"
        style={{
          minHeight: "100vh",
          background: "#060A0F",
          padding: "2rem 1rem",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <div
          className="no-print"
          style={{
            maxWidth: 720,
            margin: "0 auto 1.5rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
          }}
        >
          <Link
            href={`/historico/${agendamento.codigoUtente}`}
            style={{ color: "#10B981", textDecoration: "none", fontSize: 14 }}
          >
            ← Voltar
          </Link>

          <button
            onClick={() => window.print()}
            style={{
              background: "#10B981",
              color: "#052e16",
              border: "none",
              borderRadius: 10,
              padding: "10px 16px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Imprimir / Guardar PDF
          </button>
        </div>

        <section
          className="comprovativo"
          style={{
            maxWidth: 720,
            margin: "0 auto",
            background: "#FFFFFF",
            color: "#111827",
            borderRadius: 16,
            padding: "2rem",
            boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <h1 style={{ margin: 0, fontSize: 30 }}>
              Vacina<span style={{ color: "#10B981" }}>Fácil</span>
            </h1>
            <p style={{ margin: "8px 0 0", color: "#6B7280", fontSize: 14 }}>
              Comprovativo de Agendamento de Vacinação
            </p>
          </div>

          <Box titulo="Dados do Utente">
            <Linha label="Nome" value={agendamento.nomeUtente} />
            <Linha label="Código do utente" value={agendamento.codigoUtente} />
          </Box>

          <Box titulo="Dados da Vacinação">
            <Linha label="Vacina" value={agendamento.nomeVacina} />
            <Linha label="Dose" value={`Dose ${agendamento.numeroDose}`} />
            <Linha
              label="Data agendada"
              value={new Date(agendamento.dataAgendada + "T00:00:00").toLocaleDateString("pt-PT", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            />
            <Linha label="Estado" value={agendamento.status} />
          </Box>

          <Box titulo="Unidade Sanitária">
            <Linha label="Unidade" value={agendamento.nomeUnidade || "—"} />
            <Linha label="Distrito" value={agendamento.distrito || "—"} />
            <Linha label="Província" value={agendamento.provincia || "—"} />
          </Box>

          <p style={{ fontSize: 12, color: "#6B7280", textAlign: "center", marginTop: "2rem" }}>
            Este comprovativo foi gerado pelo sistema VacinaFácil.
          </p>
        </section>
      </main>
    </>
  );
}

function Box({ titulo, children }) {
  return (
    <div
      style={{
        border: "1px solid #E5E7EB",
        borderRadius: 12,
        padding: "1.2rem",
        marginBottom: "1.3rem",
      }}
    >
      <h2 style={{ fontSize: 16, margin: "0 0 1rem" }}>{titulo}</h2>
      {children}
    </div>
  );
}

function Linha({ label, value }) {
  return (
    <div
      className="linha"
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 20,
        borderBottom: "1px solid #F3F4F6",
        padding: "8px 0",
        fontSize: 14,
      }}
    >
      <span style={{ color: "#6B7280" }}>{label}</span>
      <strong style={{ textAlign: "right" }}>{value}</strong>
    </div>
  );
}