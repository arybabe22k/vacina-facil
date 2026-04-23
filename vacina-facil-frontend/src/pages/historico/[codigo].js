import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { post } from "../services/api";
import Link from "next/link";

const STATUS_COLORS = {
  PENDENTE:  "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  REALIZADO: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  CANCELADO: "bg-red-500/10 text-red-400 border-red-500/30",
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
      get(`/agendamentos/historico/${codigo}`),
    ])
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

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <p className="text-gray-400 animate-pulse">A carregar...</p>
    </div>
  );

  if (erro) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="text-center">
        <p className="text-red-400 mb-4">{erro}</p>
        <Link href="/" className="text-emerald-400 hover:underline">← Voltar</Link>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-gray-950 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="text-gray-500 hover:text-white text-sm transition-colors">
            ← Início
          </Link>
          <h1 className="text-white font-bold text-lg">
            Vacina<span className="text-emerald-400">Fácil</span>
          </h1>
        </div>

        {/* Utente card */}
        {utente && (
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 mb-6">
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Utente</p>
            <h2 className="text-white text-xl font-semibold">{utente.nome}</h2>
            <div className="flex items-center gap-3 mt-3">
              <span className="font-mono text-emerald-400 bg-emerald-500/10
                               border border-emerald-500/30 px-3 py-1 rounded-lg text-sm">
                {utente.codigoUtente}
              </span>
              {utente.telefone && (
                <span className="text-gray-500 text-sm">📱 {utente.telefone}</span>
              )}
            </div>
          </div>
        )}

        {/* Agendar button */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white font-semibold">Histórico vacinal</h3>
          <Link
            href={`/agendar/${codigo}`}
            className="bg-emerald-500 hover:bg-emerald-400 text-white text-sm
                       font-medium px-4 py-2 rounded-xl transition-all"
          >
            + Agendar vacina
          </Link>
        </div>

        {/* Lista */}
        {historico.length === 0 ? (
          <div className="bg-gray-900 rounded-2xl p-10 border border-gray-800 text-center">
            <p className="text-gray-500">Nenhum agendamento ainda.</p>
            <p className="text-gray-600 text-sm mt-1">
              Clica em "Agendar vacina" para começar.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {historico.map((a) => (
              <div
                key={a.id}
                className="bg-gray-900 rounded-2xl p-5 border border-gray-800
                           flex items-center justify-between gap-4"
              >
                <div>
                  <p className="text-white font-medium">{a.nomeVacina}</p>
                  <p className="text-gray-500 text-sm mt-1">
                    📅 {new Date(a.dataAgendada + "T00:00:00").toLocaleDateString("pt-PT")}
                    &nbsp;·&nbsp; Dose {a.numeroDose}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`text-xs px-3 py-1 rounded-full border font-medium ${STATUS_COLORS[a.status]}`}>
                    {a.status}
                  </span>
                  {a.status === "PENDENTE" && (
                    <button
                      onClick={() => marcarRealizado(a.id)}
                      className="text-xs text-gray-500 hover:text-emerald-400 transition-colors"
                    >
                      Marcar como realizado
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
