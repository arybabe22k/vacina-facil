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
    if (!codigo.trim()) return setErro("Introduz o teu código.");
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
    <main className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white">
            Vacina<span className="text-emerald-400">Fácil</span>
          </h1>
          <p className="text-gray-400 mt-2 text-sm">
            Gestão vacinal simples, sem necessidade de conta
          </p>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-900 rounded-xl p-1 mb-6">
          {["entrar", "registar"].map((m) => (
            <button
              key={m}
              onClick={() => { setModo(m); setErro(""); }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                modo === m
                  ? "bg-emerald-500 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {m === "entrar" ? "Já tenho código" : "Registar"}
            </button>
          ))}
        </div>

        {/* Card */}
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
          {modo === "entrar" ? (
            <form onSubmit={handleEntrar} className="space-y-4">
              <div>
                <label className="text-gray-400 text-xs uppercase tracking-wider">
                  Código do utente
                </label>
                <input
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  placeholder="Ex: VF004821"
                  className="w-full mt-1 bg-gray-800 text-white rounded-lg px-4 py-3
                             border border-gray-700 focus:border-emerald-500 focus:outline-none
                             font-mono text-lg tracking-widest text-center uppercase"
                />
              </div>
              {erro && <p className="text-red-400 text-sm">{erro}</p>}
              <button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-white
                           font-semibold py-3 rounded-xl transition-all"
              >
                Ver histórico →
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegistar} className="space-y-4">
              {[
                { label: "Nome completo", key: "nome", type: "text", placeholder: "João Maputo" },
                { label: "Data de nascimento", key: "dataNascimento", type: "date", placeholder: "" },
                { label: "Telefone", key: "telefone", type: "text", placeholder: "841234567" },
                { label: "BI (opcional)", key: "bi", type: "text", placeholder: "123456789A" },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label className="text-gray-400 text-xs uppercase tracking-wider">
                    {label}
                  </label>
                  <input
                    type={type}
                    value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    placeholder={placeholder}
                    className="w-full mt-1 bg-gray-800 text-white rounded-lg px-4 py-3
                               border border-gray-700 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              ))}
              {erro && <p className="text-red-400 text-sm">{erro}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50
                           text-white font-semibold py-3 rounded-xl transition-all"
              >
                {loading ? "A registar..." : "Registar e continuar →"}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-gray-600 text-xs mt-6">
          O teu código é gerado automaticamente no registo
        </p>
      </div>
    </main>
  );
}
