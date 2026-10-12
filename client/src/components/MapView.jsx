import React, { useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents
} from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';

// Create custom status-colored SVG icons for Leaflet
const createPinIcon = (status = 'pending') => {
  const colors = {
    pending: '#d97706', // amber
    verified: '#2563eb', // blue
    assigned: '#9333ea', // purple
    in_progress: '#4f46e5', // indigo
    resolved: '#16a34a', // green
    closed: '#64748b', // slate
    rejected: '#e11d48', // rose
    reopened: '#ea580c' // orange
  };

  const color = colors[status] || '#0284c7';

  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
      <path fill="${color}" stroke="#ffffff" stroke-width="2" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
      <circle cx="12" cy="9" r="3" fill="#ffffff"/>
    </svg>
  `;

  return L.divIcon({
    html: svgString,
    className: 'custom-leaflet-pin',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

// Selection pin icon (bright red)
const pickerIcon = L.divIcon({
  html: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36">
      <path fill="#ef4444" stroke="#ffffff" stroke-width="2" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
      <circle cx="12" cy="9" r="3.5" fill="#ffffff"/>
    </svg>
  `,
  className: 'picker-pin',
  iconSize: [36, 36],
  iconAnchor: [18, 36]
});

// Component to handle map clicks for reporting
function LocationPickerHandler({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      if (onLocationSelect) {
        onLocationSelect([e.latlng.lng, e.latlng.lat]);
      }
    }
  });
  return null;
}

// Center updater
function RecenterMap({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom || map.getZoom());
    }
  }, [center, zoom, map]);
  return null;
}

export default function MapView({
  issues = [],
  selectedPoint = null,
  onLocationSelect = null,
  center = [18.6298, 73.7997], // PCMC center
  zoom = 12,
  interactive = true,
  height = '420px'
}) {
  return (
    <div style={{ height }} className="relative w-full rounded-xl overflow-hidden shadow-inner border border-slate-200">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={interactive}
        dragging={interactive}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Picker handler */}
        {onLocationSelect && (
          <LocationPickerHandler onLocationSelect={onLocationSelect} />
        )}

        {/* Selected Picker Point Marker */}
        {selectedPoint && (
          <Marker
            position={[selectedPoint[1], selectedPoint[0]]}
            icon={pickerIcon}
          >
            <Popup>
              <div className="text-xs font-semibold text-slate-800">
                Selected Report Location
              </div>
            </Popup>
          </Marker>
        )}

        {/* Render Issue Markers */}
        {issues.map((issue) => {
          if (!issue.location || !issue.location.coordinates) return null;
          const [lng, lat] = issue.location.coordinates;
          const icon = createPinIcon(issue.status);

          return (
            <Marker key={issue._id} position={[lat, lng]} icon={icon}>
              <Popup>
                <div className="w-52 p-1 text-xs">
                  <div className="font-semibold text-slate-900 line-clamp-1 mb-1">
                    {issue.title}
                  </div>
                  <div className="text-slate-500 mb-2">
                    {issue.category?.name || 'Issue'} • {issue.ward?.name || 'PCMC'}
                  </div>
                  <div className="text-slate-600 line-clamp-2 mb-2">
                    {issue.description}
                  </div>
                  <Link
                    to={`/issues/${issue._id}`}
                    className="block text-center bg-pcmc-600 text-white font-medium py-1 px-2 rounded hover:bg-pcmc-700"
                  >
                    View Details
                  </Link>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {center && <RecenterMap center={center} zoom={zoom} />}
      </MapContainer>
    </div>
  );
}
