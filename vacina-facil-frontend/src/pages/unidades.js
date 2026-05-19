import { useEffect, useState } from "react";
import { get } from "../services/api";
import Link from "next/link";
import dynamic from "next/dynamic";

const MapaLeaflet = dynamic(() => import("../components/MapaLeaflet"), { ssr: false });

const PROVINCIAS = [
    "Cabo Delgado", "Gaza", "Inhambane", "Manica",
    "Maputo", "Nampula", "Niassa", "Sofala", "Tete", "Zambézia"
];

export default function Unidades() {
    const [unidades, setUnidades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [provincia, setProvincia] = useState("");
    const [selecionada, setSelecionada] = useState(null);

    useEffect(() => {
        const url = provincia
            ? `/unidades-sanitarias?provincia=${encodeURIComponent(provincia)}`
            : "/unidades-sanitarias";
        setLoading(true);
        get(url)
            .then(setUnidades)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [provincia]);

    return (
        <>
            <style>{`
                .vf-us-card:hover { border-color: #2D3A47 !important; }
                .vf-us-card.sel  { border-color: #10B981 !important; background: rgba(16,185,129,0.04) !important; }
                .vf-back:hover   { color: #E5E7EB !important; }
                .vf-select:focus { border-color: #10B981 !important; }
            `}</style>

            <main style={{ minHeight:"100vh", background:"#060A0F", padding:"2rem 1rem", fontFamily:"'DM Sans',sans-serif", position:"relative" }}>
                <div style={{ position:"absolute", width:600, height:600, borderRadius:"50%", background:"radial-gradient(ellipse,rgba(16,185,129,0.05) 0%,transparent 70%)", top:-100, left:"50%", transform:"translateX(-50%)", pointerEvents:"none" }} />

                <div style={{ maxWidth:900, margin:"0 auto", position:"relative", zIndex:1 }}>

                    {/* Topbar */}
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"2rem" }}>
                        <Link href="/" className="vf-back" style={{ fontSize:13, color:"#4B5563", textDecoration:"none", display:"flex", alignItems:"center", gap:6, transition:"color .2s" }}>
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M10 2L4 7L10 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            Início
                        </Link>
                        <span style={{ fontSize:17, fontWeight:600, color:"#F0FDF4" }}>Vacina<span style={{ color:"#10B981" }}>Fácil</span></span>
                    </div>

                    {/* Header */}
                    <div style={{ marginBottom:"1.5rem" }}>
                        <h1 style={{ fontSize:22, fontWeight:600, color:"#F0FDF4", margin:"0 0 6px" }}>Unidades Sanitárias</h1>
                        <p style={{ fontSize:13, color:"#4B5563", margin:0 }}>Centros de saúde com serviço de vacinação em Moçambique</p>
                    </div>

                    {/* Filtro */}
                    <div style={{ marginBottom:"1.5rem" }}>
                        <label style={{ display:"block", fontSize:11, fontWeight:500, letterSpacing:"0.08em", textTransform:"uppercase", color:"#4B5563", marginBottom:6 }}>Filtrar por província</label>
                        <select
                            className="vf-select"
                            value={provincia}
                            onChange={(e) => { setProvincia(e.target.value); setSelecionada(null); }}
                            style={{ background:"#0D1117", border:"1px solid #1C2631", borderRadius:10, padding:"11px 14px", fontSize:14, color:"#E5E7EB", fontFamily:"'DM Sans',sans-serif", outline:"none", transition:"border-color .2s", width:"100%", maxWidth:300, appearance:"none" }}
                        >
                            <option value="">Todas as províncias</option>
                            {PROVINCIAS.map((p) => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>

                    {/* Layout: lista + mapa */}
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>

                        {/* Lista */}
                        <div style={{ maxHeight:520, overflowY:"auto", paddingRight:4 }}>
                            {loading ? (
                                <p style={{ color:"#4B5563", fontSize:14 }}>A carregar...</p>
                            ) : unidades.length === 0 ? (
                                <p style={{ color:"#4B5563", fontSize:14 }}>Nenhuma unidade encontrada.</p>
                            ) : (
                                unidades.map((u) => (
                                    <div
                                        key={u.id}
                                        onClick={() => setSelecionada(u)}
                                        className={`vf-us-card${selecionada?.id === u.id ? " sel" : ""}`}
                                        style={{ background:"#0D1117", border:"1px solid #1C2631", borderRadius:12, padding:"12px 14px", marginBottom:8, cursor:"pointer", transition:"all .15s" }}
                                    >
                                        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:8 }}>
                                            <div>
                                                <p style={{ fontSize:13, fontWeight:500, color:"#E5E7EB", margin:"0 0 4px" }}>{u.nome}</p>
                                                <p style={{ fontSize:11, color:"#4B5563", margin:"0 0 2px" }}>{u.distrito} · {u.provincia}</p>
                                                {u.endereco && <p style={{ fontSize:11, color:"#374151", margin:0 }}>{u.endereco}</p>}
                                            </div>
                                            <span style={{ fontSize:11, color:"#10B981", background:"rgba(16,185,129,0.1)", border:"1px solid rgba(16,185,129,0.2)", borderRadius:8, padding:"2px 8px", whiteSpace:"nowrap", flexShrink:0 }}>
                                                {u.horario}
                                            </span>
                                        </div>
                                        {u.telefone && (
                                            <p style={{ fontSize:11, color:"#4B5563", margin:"6px 0 0", display:"flex", alignItems:"center", gap:4 }}>
                                                📞 {u.telefone}
                                            </p>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Mapa */}
                        <div style={{ background:"#0D1117", border:"1px solid #1C2631", borderRadius:14, overflow:"hidden", height:520 }}>
                            <MapaLeaflet unidades={unidades} selecionada={selecionada} onSelect={setSelecionada} />
                        </div>

                    </div>
                </div>
            </main>
        </>
    );
}