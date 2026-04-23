import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { post } from "../services/api";
import Link from "next/link";

export default function Agendar() {
  const router = useRouter();
  const { codigo } = router.query;
  const [vacinas, setVacinas] = useState([]);
  const [form, setForm] = useState({ vacinaId: "", dataAgendada: "", numeroDose: 1 });
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    get("/vacinas").then(setVacinas).catch(console.error);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setLoading(true);
    try {
      await post("/agendamentos", {
        ...form,
        codigoUtente: codigo,
        vacinaId: Number(form.vacinaId),
      });
      router.push(`/historico/${codigo}`);
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        <div className="flex items-center justify-between mb-8">
          <Link href={`/historico/${codigo}`} className="text-gray-500 hover:text-white text-sm">
            ← Voltar
          </Link>
          <h1 className="text-white font-bold">
            Vacina<span className="text-emerald-400">Fácil</span>
          </h1>
        </div>

        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <h2 className="text-white font-semibold text-lg mb-6">Agendar vacina</h2>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Vacina */}
            <div>
              <label className="text-gray-400 text-xs uppercase tracking-wider">Vacina</label>
              <select
                value={form.vacinaId}
                onChange={(e) => setForm({ ...form, vacinaId: e.target.value })}
                required
                className="w-full mt-1 bg-gray-800 text-white rounded-lg px-4 py-3
                           border border-gray-700 focus:border-emerald-500 focus:outline-none"
              >
                <option value="">Selecciona uma vacina</option>
                {vacinas.map((v) => (
                  <option key={v.id} value={v.id}>{v.nome}</option>
                ))}
              </select>
            </div>

            {/* Data */}
            <div>
              <label className="text-gray-400 text-xs uppercase tracking-wider">Data agendada</label>
              <input
                type="date"
                value={form.dataAgendada}
                onChange={(e) => setForm({ ...form, dataAgendada: e.target.value })}
                required
                min={new Date().toISOString().split("T")[0]}
                className="w-full mt-1 bg-gray-800 text-white rounded-lg px-4 py-3
                           border border-gray-700 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            {/* Dose */}
            <div>
              <label className="text-gray-400 text-xs uppercase tracking-wider">Número da dose</label>
              <input
                type="number"
                min="1"
                max="10"
                value={form.numeroDose}
                onChange={(e) => setForm({ ...form, numeroDose: Number(e.target.value) })}
                className="w-full mt-1 bg-gray-800 text-white rounded-lg px-4 py-3
                           border border-gray-700 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            {erro && <p className="text-red-400 text-sm">{erro}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50
                         text-white font-semibold py-3 rounded-xl transition-all"
            >
              {loading ? "A agendar..." : "Confirmar agendamento →"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
