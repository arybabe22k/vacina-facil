import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// fix ícone padrão do Leaflet no Next.js
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const iconVerde = new L.Icon({
    iconUrl:       "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
    shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize:      [25, 41],
    iconAnchor:    [12, 41],
    popupAnchor:   [1, -34],
});

const iconSelecionado = new L.Icon({
    iconUrl:       "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-gold.png",
    shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize:      [25, 41],
    iconAnchor:    [12, 41],
    popupAnchor:   [1, -34],
});

function CentrarMapa({ selecionada }) {
    const map = useMap();
    useEffect(() => {
        if (selecionada?.latitude && selecionada?.longitude) {
            map.flyTo([selecionada.latitude, selecionada.longitude], 14, { duration: 1 });
        }
    }, [selecionada, map]);
    return null;
}

export default function MapaLeaflet({ unidades, selecionada, onSelect }) {
    const comCoords = unidades.filter((u) => u.latitude && u.longitude);

    return (
        <MapContainer
            center={[-18.0, 35.0]}
            zoom={5}
            style={{ height:"100%", width:"100%", background:"#060A0F" }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap'
            />
            <CentrarMapa selecionada={selecionada} />
            {comCoords.map((u) => (
                <Marker
                    key={u.id}
                    position={[u.latitude, u.longitude]}
                    icon={selecionada?.id === u.id ? iconSelecionado : iconVerde}
                    eventHandlers={{ click: () => onSelect(u) }}
                >
                    <Popup>
                        <strong>{u.nome}</strong><br />
                        {u.distrito} · {u.provincia}<br />
                        {u.horario}<br />
                        {u.telefone && <>📞 {u.telefone}</>}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}