"use client";

import "leaflet/dist/leaflet.css";

import L from "leaflet";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";

import { CENTER } from "./LeafletMap";

const pin = L.divIcon({ className: "", iconSize: [0, 0], html: '<span class="price-pin bg-brand text-white after:border-t-brand">📍</span>' });

function Clicks({ onPick }: { onPick: (p: [number, number]) => void }) {
  useMapEvents({ click: (e) => onPick([+e.latlng.lat.toFixed(6), +e.latlng.lng.toFixed(6)]) });
  return null;
}

/** Xaritani bosib joyni belgilash */
export default function PickMap({ value, onChange }: { value: [number, number] | null; onChange: (p: [number, number]) => void }) {
  return (
    <MapContainer center={value ?? CENTER} zoom={value ? 16 : 13} className="size-full" scrollWheelZoom={false}>
      <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" maxZoom={19} />
      <Clicks onPick={onChange} />
      {value && <Marker position={value} icon={pin} draggable eventHandlers={{ dragend: (e) => {
        const p = (e.target as L.Marker).getLatLng();
        onChange([+p.lat.toFixed(6), +p.lng.toFixed(6)]);
      } }} />}
    </MapContainer>
  );
}
