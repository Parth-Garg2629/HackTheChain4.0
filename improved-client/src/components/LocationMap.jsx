import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icon broken by bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Custom cyan marker to match ReliefSync's cyberpunk theme
const cyberIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  className: "cyber-marker", // styled via CSS below
});

// Inner components
function RecenterOnPosition({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.setView(position, map.getZoom());
  }, [position, map]);
  return null;
}

function MapEvents({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

export default function LocationMap({ onPositionChange }) {
  const DEFAULT_CENTER = [25.1768, 75.8333]; // Kota, Rajasthan
  const [position, setPosition] = useState(DEFAULT_CENTER);
  const [error, setError] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [autoCenter, setAutoCenter] = useState(true);
  const [isManual, setIsManual] = useState(false);
  const watchIdRef = useRef(null);

  const GEO_OPTIONS = {
    enableHighAccuracy: true,
    timeout: 15000,
    maximumAge: 0,
  };

  const handleManualPos = (coords) => {
    stopTracking();
    setPosition(coords);
    setIsManual(true);
    onPositionChange?.({
      lat: coords[0],
      lng: coords[1],
      accuracy: 0, // Manual precision
      isManual: true
    });
  };

  const startTracking = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported.");
      return;
    }
    setIsTracking(true);
    setIsManual(false);
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const coords = [pos.coords.latitude, pos.coords.longitude];
        setPosition(coords);
        setError(null);
        onPositionChange?.({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          isManual: false
        });
      },
      (err) => {
        setError(`GPS Status: ${err.message}`);
        setIsTracking(false);
        // Fallback to Kota if GPS fails
        if (!position) setPosition(DEFAULT_CENTER);
      },
      GEO_OPTIONS
    );
  };

  const stopTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsTracking(false);
  };

  useEffect(() => {
    // Auto-attempt tracking on mount
    startTracking();
    return () => stopTracking();
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <style>{`
        .leaflet-tile { filter: invert(1) hue-rotate(180deg) brightness(0.8) contrast(1.1); }
        .cyber-marker { filter: hue-rotate(160deg) brightness(1.5) drop-shadow(0 0 5px #22d3ee); }
        .leaflet-control-zoom a { background: #0f172a !important; color: #22d3ee !important; border: 1px solid #22d3ee33 !important; }
      `}</style>

      <MapContainer
        center={position || DEFAULT_CENTER}
        zoom={14}
        style={{ width: "100%", height: "100%", background: "#060b13" }}
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        <MapEvents onMapClick={handleManualPos} />
        
        {position && (
          <>
            {autoCenter && <RecenterOnPosition position={position} />}
            <Marker position={position} icon={cyberIcon}>
              <Popup>
                <div style={{ background: "#0f172a", color: "#22d3ee", padding: "4px", borderRadius: "4px" }}>
                  <p style={{ margin: 0, fontWeight: "bold" }}>{isManual ? "TACTICAL MARKER" : "LIVE SIGNAL"}</p>
                  <code style={{ fontSize: "10px" }}>{position[0].toFixed(5)}, {position[1].toFixed(5)}</code>
                </div>
              </Popup>
            </Marker>
          </>
        )}
      </MapContainer>

      {/* HUD overlay */}
      <div style={{
        position: "absolute", bottom: 20, left: 20, zIndex: 1000,
        display: "flex", gap: 10, flexDirection: "column",
      }}>
        <div style={{ 
          background: "#0f172aee", padding: "10px", borderRadius: "4px", 
          borderLeft: `4px solid ${isTracking ? "#22d3ee" : isManual ? "#f59e0b" : "#64748b"}`,
          backdropFilter: "blur(4px)"
        }}>
          <p style={{ color: "#22d3ee", fontSize: "10px", fontWeight: "bold", margin: "0 0 5px 0", letterSpacing: "1px" }}>
            MISSION STATUS: {isTracking ? "UPLINK ACTIVE" : isManual ? "MANUAL OVERRIDE" : "OFFLINE"}
          </p>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={isTracking ? stopTracking : startTracking}
              style={{
                padding: "6px 12px", background: isTracking ? "#22d3ee22" : "#0f172a",
                border: "1px solid #22d3ee", color: "#22d3ee", fontFamily: "monospace", fontSize: "11px",
                cursor: "pointer", borderRadius: "2px"
              }}
            >
              {isTracking ? "DISCONNECT GPS" : "SYNC GPS SIGNAL"}
            </button>
            <button
              onClick={() => setAutoCenter(v => !v)}
              style={{
                padding: "6px 12px", background: "#0f172a",
                border: `1px solid ${autoCenter ? "#22d3ee" : "#334155"}`, 
                color: autoCenter ? "#22d3ee" : "#64748b",
                fontFamily: "monospace", fontSize: "11px", cursor: "pointer", borderRadius: "2px"
              }}
            >
              {autoCenter ? "LOCK VIEW" : "FREE LOOK"}
            </button>
          </div>
          {isManual && (
            <p style={{ color: "#f59e0b", fontSize: "9px", margin: "8px 0 0 0", fontFamily: "monospace" }}>
              ⚠️ MANUAL POSITIONING ENGAGED. TAP MAP TO MOVE.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
