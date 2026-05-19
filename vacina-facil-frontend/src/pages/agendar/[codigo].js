import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { get, post } from "../../services/api";
import Link from "next/link";
import dynamic from "next/dynamic";

const MapaLeaflet = dynamic(() => import("../../components/MapaLeaflet"), {
  ssr: false,
});

const STEPS = [
  "Escolhe a vacina",
  "Escolhe a unidade sanitária",
  "Escolhe a data",
  "Confirma o agendamento",
];

const PROVINCIAS = [
  "Cabo Delgado",
  "Gaza",
  "Inhambane",
  "Manica",
  "Maputo",
  "Nampula",
  "Niassa",
  "Sofala",
  "Tete",
  "Zambézia",
];

function StepIndicator({ current }) {
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: "1.5rem" }}>
      {[1, 2, 3, 4].map((n, i) => (
        <div key={n} style={{ display: "flex", alignItems: "center", flex: i < 3 ? 1 : "none" }}>
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: "50%",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              fontWeight: 600,
              background: n <= current ? "#10B981" : "#060A0F",
              border: n <= current ? "1px solid #10B981" : "1px solid #1C2631",
              color: n <= current ? "#052e16" : "#4B5563",
              transition: "all .3s",
            }}
          >
            {n}
          </div>
          {i < 3 && <div style={{ flex: 1, height: 1, background: "#1C2631" }} />}
        </div>
      ))}
    </div>
  );
}

export default function Agendar() {
  const router = useRouter();
  const { codigo } = router.query;

  const [vacinas, setVacinas] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [provincia, setProvincia] = useState("");
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    vacinaId: "",
    unidadeSanitariaId: "",
    dataAgendada: "",
    numeroDose: 1,
  });

  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    get("/calendario-vacinal").then(setVacinas).catch(console.error);
    get("/unidades-sanitarias").then(setUnidades).catch(console.error);

    setForm((f) => ({
      ...f,
      dataAgendada: new Date().toISOString().split("T")[0],
    }));
  }, []);

  const today = new Date().toISOString().split("T")[0];

  const unidadesFiltradas = provincia
    ? unidades.filter((u) => u.provincia === provincia)
    : unidades;

  const vacinaSel = vacinas.find((v) => v.id === Number(form.vacinaId));
  const unidadeSel = unidades.find((u) => u.id === Number(form.unidadeSanitariaId));

  async function handleSubmit() {
    setErro("");

    if (!form.vacinaId) {
      setErro("Seleciona uma vacina.");
      setStep(1);
      return;
    }

    if (!form.unidadeSanitariaId) {
      setErro("Seleciona uma unidade sanitária.");
      setStep(2);
      return;
    }

    if (!form.dataAgendada) {
      setErro("Escolhe uma data.");
      setStep(3);
      return;
    }

    setLoading(true);

    try {
      await post("/agendamentos", {
        codigoUtente: codigo,
        vacinaId: Number(form.vacinaId),
        unidadeSanitariaId: Number(form.unidadeSanitariaId),
        dataAgendada: form.dataAgendada,
        numeroDose: form.numeroDose,
      });

      router.push(`/historico/${codigo}`);
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  }

  const btnStyle = {
    width: "100%",
    background: "#10B981",
    color: "#052e16",
    border: "none",
    borderRadius: 12,
    padding: 13,
    fontSize: 14,
    fontWeight: 600,
    fontFamily: "'DM Sans',sans-serif",
    cursor: "pointer",
    transition: "all .15s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  };

  const inputStyle = {
    width: "100%",
    background: "#060A0F",
    border: "1px solid #1C2631",
    borderRadius: 10,
    padding: "11px 14px",
    fontSize: 14,
    color: "#E5E7EB",
    fontFamily: "'DM Sans',sans-serif",
    boxSizing: "border-box",
    outline: "none",
  };

  const labelStyle = {
    display: "block",
    fontSize: 11,
    fontWeight: 500,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#4B5563",
    marginBottom: 6,
  };

  return (
    <>
      <main
        style={{
          minHeight: "100vh",
          background: "#060A0F",
          display: "flex",
          alignItems: step === 2 ? "flex-start" : "center",
          justifyContent: "center",
          padding: "2rem 1rem",
          fontFamily: "'DM Sans',sans-serif",
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
            background: "radial-gradient(ellipse,rgba(16,185,129,0.06) 0%,transparent 70%)",
            top: -100,
            left: "50%",
            transform: "translateX(-50%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            width: "100%",
            maxWidth: step === 2 ? 980 : 520,
            position: "relative",
            zIndex: 1,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
            <Link
              href={`/historico/${codigo}`}
              style={{
                fontSize: 13,
                color: "#4B5563",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              ← Voltar
            </Link>

            <span style={{ fontSize: 17, fontWeight: 600, color: "#F0FDF4" }}>
              Vacina<span style={{ color: "#10B981" }}>Fácil</span>
            </span>
          </div>

          <div style={{ background: "#0D1117", border: "1px solid #1C2631", borderRadius: 16, padding: "1.75rem" }}>
            <StepIndicator current={step} />

            <p style={{ fontSize: 16, fontWeight: 600, color: "#F0FDF4", margin: "0 0 1.5rem" }}>
              {STEPS[step - 1]}
            </p>

            {erro && (
              <div
                style={{
                  fontSize: 12.5,
                  color: "#F87171",
                  padding: "8px 12px",
                  background: "rgba(248,113,113,0.07)",
                  border: "1px solid rgba(248,113,113,0.15)",
                  borderRadius: 8,
                  marginBottom: "0.75rem",
                }}
              >
                {erro}
              </div>
            )}

            {step === 1 && (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: "1rem" }}>
                  {vacinas.map((v) => (
                    <button
                      key={v.id}
                      onClick={() =>
                        setForm({
                          ...form,
                          vacinaId: String(v.id),
                          numeroDose: v.dose?.includes("2")
                            ? 2
                            : v.dose?.includes("3")
                            ? 3
                            : v.dose?.includes("4")
                            ? 4
                            : 1,
                        })
                      }
                      style={{
                        background: form.vacinaId === String(v.id) ? "rgba(16,185,129,0.12)" : "#060A0F",
                        border: form.vacinaId === String(v.id) ? "1px solid #10B981" : "1px solid #1C2631",
                        borderRadius: 10,
                        padding: "10px 12px",
                        cursor: "pointer",
                        textAlign: "left",
                      }}
                    >
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#E5E7EB" }}>{v.vacina}</div>
                      <div style={{ fontSize: 11, color: "#10B981", marginTop: 3 }}>{v.idadeRecomendada}</div>
                      <div style={{ fontSize: 11, color: "#4B5563", marginTop: 2 }}>{v.dose}</div>
                    </button>
                  ))}
                </div>

                <button
                  disabled={!form.vacinaId}
                  onClick={() => setStep(2)}
                  style={{
                    ...btnStyle,
                    opacity: form.vacinaId ? 1 : 0.4,
                    cursor: form.vacinaId ? "pointer" : "not-allowed",
                  }}
                >
                  Continuar →
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <div style={{ marginBottom: "1rem", maxWidth: 320 }}>
                  <label style={labelStyle}>Província</label>
                  <select
                    value={provincia}
                    onChange={(e) => {
                      setProvincia(e.target.value);
                      setForm({ ...form, unidadeSanitariaId: "" });
                    }}
                    style={inputStyle}
                  >
                    <option value="">Todas as províncias</option>
                    {PROVINCIAS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1.1fr",
                    gap: 16,
                    marginBottom: "1rem",
                  }}
                >
                  <div style={{ maxHeight: 430, overflowY: "auto", paddingRight: 4 }}>
                    {unidadesFiltradas.length === 0 ? (
                      <p style={{ color: "#4B5563", fontSize: 13, margin: 0 }}>
                        Nenhuma unidade encontrada para esta província.
                      </p>
                    ) : (
                      unidadesFiltradas.map((u) => (
                        <button
                          key={u.id}
                          onClick={() => setForm({ ...form, unidadeSanitariaId: String(u.id) })}
                          style={{
                            width: "100%",
                            background:
                              form.unidadeSanitariaId === String(u.id)
                                ? "rgba(16,185,129,0.12)"
                                : "#060A0F",
                            border:
                              form.unidadeSanitariaId === String(u.id)
                                ? "1px solid #10B981"
                                : "1px solid #1C2631",
                            borderRadius: 10,
                            padding: "10px 12px",
                            cursor: "pointer",
                            textAlign: "left",
                            marginBottom: 8,
                          }}
                        >
                          <div style={{ fontSize: 13, fontWeight: 600, color: "#E5E7EB" }}>{u.nome}</div>
                          <div style={{ fontSize: 11, color: "#10B981", marginTop: 3 }}>
                            {u.distrito} · {u.provincia}
                          </div>
                          {u.endereco && (
                            <div style={{ fontSize: 11, color: "#4B5563", marginTop: 2 }}>
                              {u.endereco}
                            </div>
                          )}
                          {u.horario && (
                            <div style={{ fontSize: 11, color: "#4B5563", marginTop: 2 }}>
                              Horário: {u.horario}
                            </div>
                          )}
                        </button>
                      ))
                    )}
                  </div>

                  <div
                    style={{
                      height: 430,
                      background: "#060A0F",
                      border: "1px solid #1C2631",
                      borderRadius: 14,
                      overflow: "hidden",
                    }}
                  >
                    <MapaLeaflet
                      unidades={unidadesFiltradas}
                      selecionada={unidadeSel}
                      onSelect={(u) =>
                        setForm({ ...form, unidadeSanitariaId: String(u.id) })
                      }
                    />
                  </div>
                </div>

                {unidadeSel && (
                  <div
                    style={{
                      background: "rgba(16,185,129,0.06)",
                      border: "1px solid rgba(16,185,129,0.18)",
                      borderRadius: 10,
                      padding: "10px 12px",
                      marginBottom: "1rem",
                    }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#E5E7EB" }}>
                      Unidade selecionada: {unidadeSel.nome}
                    </div>
                    <div style={{ fontSize: 12, color: "#4B5563", marginTop: 3 }}>
                      {unidadeSel.distrito} · {unidadeSel.provincia}
                    </div>
                  </div>
                )}

                <button
                  disabled={!form.unidadeSanitariaId}
                  onClick={() => setStep(3)}
                  style={{
                    ...btnStyle,
                    opacity: form.unidadeSanitariaId ? 1 : 0.4,
                    cursor: form.unidadeSanitariaId ? "pointer" : "not-allowed",
                  }}
                >
                  Continuar →
                </button>
              </>
            )}

            {step === 3 && (
              <>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 8,
                    background: "rgba(16,185,129,0.05)",
                    border: "1px solid rgba(16,185,129,0.15)",
                    borderRadius: 10,
                    padding: "10px 12px",
                    marginBottom: "1.1rem",
                  }}
                >
                  <p style={{ fontSize: 12, color: "#4B5563", margin: 0, lineHeight: 1.5 }}>
                    A data não pode ser anterior a hoje. Escolhe um dia disponível no centro de saúde.
                  </p>
                </div>

                <div style={{ marginBottom: "1.1rem" }}>
                  <label style={labelStyle}>Data agendada</label>
                  <input
                    type="date"
                    value={form.dataAgendada}
                    min={today}
                    onChange={(e) => setForm({ ...form, dataAgendada: e.target.value })}
                    style={inputStyle}
                  />
                </div>

                <button onClick={() => setStep(4)} style={btnStyle}>
                  Continuar →
                </button>
              </>
            )}

            {step === 4 && (
              <>
                <div style={{ marginBottom: "1.1rem" }}>
                  <label style={labelStyle}>Número da dose</label>

                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <button
                      onClick={() => setForm({ ...form, numeroDose: Math.max(1, form.numeroDose - 1) })}
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 9,
                        background: "#060A0F",
                        border: "1px solid #1C2631",
                        color: "#9CA3AF",
                        fontSize: 18,
                        cursor: "pointer",
                      }}
                    >
                      −
                    </button>

                    <div
                      style={{
                        flex: 1,
                        textAlign: "center",
                        background: "#060A0F",
                        border: "1px solid #1C2631",
                        borderRadius: 10,
                        padding: 9,
                        fontSize: 16,
                        fontWeight: 600,
                        color: "#F0FDF4",
                      }}
                    >
                      {form.numeroDose}
                    </div>

                    <button
                      onClick={() => setForm({ ...form, numeroDose: Math.min(10, form.numeroDose + 1) })}
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 9,
                        background: "#060A0F",
                        border: "1px solid #1C2631",
                        color: "#9CA3AF",
                        fontSize: 18,
                        cursor: "pointer",
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div
                  style={{
                    background: "#060A0F",
                    border: "1px solid #1C2631",
                    borderRadius: 10,
                    padding: "12px 14px",
                    marginBottom: "1.1rem",
                  }}
                >
                  <p
                    style={{
                      fontSize: 11,
                      fontWeight: 500,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "#4B5563",
                      margin: "0 0 8px",
                    }}
                  >
                    Resumo
                  </p>

                  {[
                    { label: "Vacina", val: vacinaSel?.vacina ?? "—" },
                    { label: "Unidade", val: unidadeSel?.nome ?? "—" },
                    { label: "Local", val: unidadeSel ? `${unidadeSel.distrito} · ${unidadeSel.provincia}` : "—" },
                    {
                      label: "Data",
                      val: form.dataAgendada
                        ? new Date(form.dataAgendada + "T00:00:00").toLocaleDateString("pt-PT", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })
                        : "—",
                    },
                    { label: "Dose", val: `Dose ${form.numeroDose}` },
                  ].map(({ label, val }) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                      <span style={{ color: "#4B5563" }}>{label}</span>
                      <span style={{ color: "#E5E7EB", fontWeight: 500, textAlign: "right" }}>{val}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  style={{
                    ...btnStyle,
                    opacity: loading ? 0.5 : 1,
                    cursor: loading ? "not-allowed" : "pointer",
                  }}
                >
                  {loading ? "A agendar..." : "Confirmar agendamento →"}
                </button>
              </>
            )}
          </div>
        </div>
      </main>
    </>
  );
}