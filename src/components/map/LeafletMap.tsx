"use client";

import "leaflet/dist/leaflet.css";

import L from "leaflet";
import { useEffect, useMemo } from "react";
import { MapContainer, Marker, TileLayer, useMap, ZoomControl } from "react-leaflet";

export type Pin = { id: number; lat: number; lng: number; label: string; top?: boolean };

/** G‘allaorol markazi */
export const CENTER: [number, number] = [40.0255, 67.5925];

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

function pinIcon(label: string, active: boolean, top: boolean) {
  const cls = active ? "bg-brand text-white after:border-t-brand" : top ? "bg-accent text-amber-950 after:border-t-accent" : "bg-white text-slate-900 after:border-t-white";
  return L.divIcon({
    className: "",
    iconSize: [0, 0],
    html: `<span class="price-pin ${cls}">${esc(label)}</span>`,
  });
}

const dotIcon = L.divIcon({ className: "", iconSize: [0, 0], html: '<span class="me-dot"></span>' });

function Fly({ to, zoom }: { to: [number, number] | null; zoom?: number }) {
  const map = useMap();
  useEffect(() => {
    if (to) map.flyTo(to, zoom ?? Math.max(map.getZoom(), 15), { duration: 0.6 });
  }, [to, zoom, map]);
  return null;
}

function FitPins({ pins, enabled }: { pins: Pin[]; enabled: boolean }) {
  const map = useMap();
  useEffect(() => {
    if (!enabled || pins.length < 2) return;
    map.fitBounds(L.latLngBounds(pins.map((p) => [p.lat, p.lng])), { padding: [60, 60], maxZoom: 15 });
  }, [pins, enabled, map]);
  return null;
}

export default function LeafletMap({
  pins,
  activeId = null,
  onSelect,
  me = null,
  flyTo = null,
  zoom = 13,
  interactive = true,
  fit = false,
}: {
  pins: Pin[];
  activeId?: number | null;
  onSelect?: (id: number) => void;
  me?: [number, number] | null;
  flyTo?: [number, number] | null;
  zoom?: number;
  interactive?: boolean;
  fit?: boolean;
}) {
  const center = useMemo<[number, number]>(() => (pins.length === 1 ? [pins[0].lat, pins[0].lng] : CENTER), [pins]);
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={interactive}
      dragging={interactive}
      zoomControl={false}
      attributionControl
      className="size-full"
    >
      <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" maxZoom={19} />
      {pins.map((p) => (
        <Marker
          key={p.id}
          position={[p.lat, p.lng]}
          icon={pinIcon(p.label, p.id === activeId, !!p.top)}
          zIndexOffset={p.id === activeId ? 1000 : p.top ? 500 : 0}
          eventHandlers={onSelect ? { click: () => onSelect(p.id) } : undefined}
          keyboard={!!onSelect}
          title={p.label}
        />
      ))}
      {interactive && <ZoomControl position="topright" />}
      {me && <Marker position={me} icon={dotIcon} interactive={false} />}
      <Fly to={flyTo} />
      <FitPins pins={pins} enabled={fit} />
    </MapContainer>
  );
}
