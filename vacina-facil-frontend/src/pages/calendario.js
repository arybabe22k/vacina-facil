import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { get } from "../services/api";
import Link from "next/link";

const GRUPOS = [
  { key: "todos", label: "Todos" },
  { key: "bebé", label: "Bebé" },
  { key: "criança", label: "Criança" },
  { key: "adolescente", label: "Adolescente" },
  { key: "grávida", label: "Grávida" },
];

const COLORS = {
  "bebé":        { icon: "#60A5FA", bg: "rgba(96,165,250,0.1)",   border: "rgba(96,165,250,0.2)",   emoji: "🍼" },
  "criança":     { icon: "#A78BFA", bg: "rgba(167,139,250,0.1)",  border: "rgba(167,139,250,0.2)",  emoji: "🧒" },
  "adolescente": { icon: "#F472B6", bg: "rgba(244,114,182,0.1)",  border: "rgba(244,114,182,0.2)",  emoji: "👤" },
  "grávida":     { icon: "#FBBF24", bg: "rgba(251,191,36,0.1)",   border: "rgba(251,191,36,0.2)",   emoji: "🤰" },
};

const GROUP_ORDER = ["bebé", "criança", "adolescente", "grávida"];
const GROUP_LABELS = { bebé: "Bebé", criança: "Criança", adolescente: "Adolescente", grávida: "Grávida" };

function VaccineCard({ item }) {
  const c = COLORS[item.grupo] || COLORS["bebé"];
  return (
    <div className="vf-card" style={{ background:"#0D1117", border:"1px solid #1C2631", borderRadius:14, padding:"1.1rem 1.25rem", marginBottom:8, display:"flex", gap:14, alignItems:"flex-start" }}>
      <div style={{ width:38, height:38, borderRadius:10, background:c.bg, border:`1px solid ${c.border}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 2v4M8 10v4M2 8h4M10 8h4" stroke={c.icon} strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
      </div>
      <div style={{ flex:1 }}>
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:8, marginBottom:4 }}>
          <span style={{ fontSize:14, fontWeight:500, color:"#E5E7EB" }}>{item.vacina}</span>
          <span style={{ fontSize:11, fontWeight:500, padding:"2px 9px", borderRadius:20, whiteSpace:"nowrap", flexShrink:0, background:c.bg, border:`1px solid ${c.border}`, color:c.icon }}>
            {item.dose}
          </span>
        </div>
        <div style={{ fontSize:12, color:"#4B5563", marginBottom:5, display:"flex", alignItems:"center", gap:5 }}>
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <circle cx="5.5" cy="5.5" r="4.5" stroke="#4B5563" strokeWidth="1"/>
            <path d="M5.5 3.5v2.5l1.5 1" stroke="#4B5563" strokeWidth="1" strokeLinecap="round"/>
          </svg>
          {item.idadeRecomendada}
        </div>
        <p style={{ fontSize:12, color:"#374151", lineHeight:1.5, margin:0 }}>{item.observacao}</p>
      </div>
    </div>
  );
}

export default function Calendario() {
  const router = useRouter();
  const { codigo } = router.query;

  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [filtro, setFiltro] = useState("todos");

  useEffect(() => {
    get("/calendario-vacinal")
      .then(setDados)
      .catch((err) => setErro(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filtro === "todos" ? dados : dados.filter((d) => d.grupo === filtro);
  const byGroup = GROUP_ORDER.reduce((acc, g) => {
    const items = filtered.filter((d) => d.grupo === g);
    if (items.length) acc[g] = items;
    return acc;
  }, {});

  const voltarHref = codigo ? `/historico/${codigo}` : "/";

  if (loading) return (
    <div style={{ minHeight:"100vh", background:"#060A0F", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'DM Sans',sans-serif" }}>
      <p style={{ color:"#4B5563", fontSize:14 }}>A carregar...</p>
    </div>
  );

  if (erro) return (
    <div style={{ minHeight:"100vh", background:"#060A0F", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'DM Sans',sans-serif" }}>
      <div style={{ textAlign:"center" }}>
        <p style={{ color:"#F87171", marginBottom:16, fontSize:14 }}>{erro}</p>
        <Link href={voltarHref} style={{ color:"#10B981", fontSize:13, textDecoration:"none" }}>← Voltar</Link>
      </div>
    </div>
  );

  return (
    <main style={{ minHeight:"100vh", background:"#060A0F", padding:"2rem 1rem", fontFamily:"'DM Sans',sans-serif", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", width:600, height:600, borderRadius:"50%", background:"radial-gradient(ellipse,rgba(16,185,129,0.05) 0%,transparent 70%)", top:-100, left:"50%", transform:"translateX(-50%)", pointerEvents:"none" }} />

      <div style={{ maxWidth:600, margin:"0 auto", position:"relative", zIndex:1 }}>

        {/* Topbar */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"2rem" }}>
          <Link href={voltarHref} className="vf-back" style={{ fontSize:13, color:"#4B5563", textDecoration:"none", display:"flex", alignItems:"center", gap:6, transition:"color .2s" }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M10 2L4 7L10 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            {codigo ? "Voltar" : "Início"}
          </Link>
          <span style={{ fontSize:17, fontWeight:600, color:"#F0FDF4" }}>Vacina<span style={{ color:"#10B981" }}>Fácil</span></span>
        </div>

        {/* Header */}
        <div style={{ marginBottom:"1.75rem" }}>
          <h1 style={{ fontSize:22, fontWeight:600, color:"#F0FDF4", margin:"0 0 6px" }}>Calendário Vacinal</h1>
          <p style={{ fontSize:13, color:"#4B5563", margin:0 }}>Programa Nacional de Vacinação — Moçambique</p>
        </div>

        {/* Filtros */}
        <div style={{ display:"flex", gap:8, marginBottom:"1.5rem", flexWrap:"wrap" }}>
          {GRUPOS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFiltro(key)}
              className="vf-filter"
              style={{
                padding:"6px 14px", borderRadius:20, border:"1px solid", fontSize:12, fontWeight:500,
                fontFamily:"'DM Sans',sans-serif", cursor:"pointer",
                borderColor: filtro === key ? "rgba(16,185,129,0.3)" : "#1C2631",
                background:  filtro === key ? "rgba(16,185,129,0.1)" : "transparent",
                color:       filtro === key ? "#10B981" : "#4B5563",
              }}
            >{label}</button>
          ))}
        </div>

        {/* Lista agrupada */}
        {Object.keys(byGroup).length === 0 ? (
          <div style={{ textAlign:"center", padding:"3rem", color:"#4B5563", fontSize:14 }}>Nenhuma vacina encontrada.</div>
        ) : (
          Object.entries(byGroup).map(([grupo, items]) => {
            const c = COLORS[grupo];
            return (
              <div key={grupo} style={{ marginBottom:"1.5rem" }}>
                <div style={{ fontSize:11, fontWeight:500, letterSpacing:"0.1em", textTransform:"uppercase", color:"#4B5563", marginBottom:10, display:"flex", alignItems:"center", gap:8 }}>
                  {c.emoji} {GROUP_LABELS[grupo]}
                  <div style={{ flex:1, height:1, background:"#1C2631" }} />
                </div>
                {items.map((item) => <VaccineCard key={item.id} item={item} />)}
              </div>
            );
          })
        )}

      </div>
    </main>
  );
}