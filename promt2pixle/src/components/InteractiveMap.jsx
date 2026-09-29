import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Crosshair, 
  MapPin, 
  Navigation, 
  Radio, 
  Filter, 
  Layers, 
  Info, 
  CheckCircle2, 
  Clock, 
  ThumbsUp, 
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { DEPARTMENTS } from '../data/mockData';
import { sounds } from '../utils/audio';

// Custom Marker Generator with SVG icons and color badges
const createCustomMarkerIcon = (departmentId, status, isSelected = false) => {
  const dept = DEPARTMENTS[departmentId] || DEPARTMENTS.ROAD;
  const isResolved = status?.toLowerCase().includes('resolved') || status?.toLowerCase().includes('closed');
  
  const markerHtml = `
    <div class="relative flex items-center justify-center cursor-pointer group" style="width: 38px; height: 38px;">
      ${isSelected ? '<span class="absolute w-12 h-12 rounded-full bg-cyan-400/30 animate-ping"></span>' : ''}
      <span class="absolute w-8 h-8 rounded-full ${isResolved ? 'bg-emerald-500/20' : 'bg-cyan-500/20'} animate-pulse"></span>
      <div class="relative z-10 w-9 h-9 rounded-full border-2 ${
        isSelected ? 'border-white scale-110 shadow-lg shadow-cyan-400/50' : 'border-slate-900 shadow-md'
      } flex items-center justify-center text-white" style="background-color: ${dept.color};">
        <span class="text-xs font-bold font-mono">${dept.id.slice(0, 2)}</span>
      </div>
      <div class="absolute -bottom-1 w-2.5 h-2.5 rounded-full ${
        isResolved ? 'bg-emerald-400' : 'bg-amber-400'
      } border border-slate-950"></div>
    </div>
  `;

  return L.divIcon({
    className: 'cityfix-custom-pin',
    html: markerHtml,
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -38]
  });
};

export const InteractiveMap = ({
  issues = [],
  selectedIssue = null,
  onSelectIssue,
  onOpenReportModalWithLocation,
  onUpvoteIssue
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const radiusCircleRef = useRef(null);
  const dropPinMarkerRef = useRef(null);

  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [pinDropMode, setPinDropMode] = useState(false);
  const [droppedPin, setDroppedPin] = useState(null);
  const [radarActive, setRadarActive] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [locating, setLocating] = useState(false);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Default center: Ward 12 Metro Central
      const initialCenter = [28.6289, 77.2065];
      const map = L.map(mapContainerRef.current, {
        center: initialCenter,
        zoom: 13,
        zoomControl: false,
        attributionControl: false
      });

      // Sleek Dark Matter Smart City Raster Tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd'
      }).addTo(map);

      // Add Custom Zoom Control to Bottom Right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;
      mapInstanceRef.current = map;

      // Click event for dropping pins
      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        sounds.click();
        setDroppedPin({ lat, lng });
      });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Dropped Pin marker and 50m detection radius circle
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear previous drop pin
    if (dropPinMarkerRef.current) {
      map.removeLayer(dropPinMarkerRef.current);
      dropPinMarkerRef.current = null;
    }
    if (radiusCircleRef.current) {
      map.removeLayer(radiusCircleRef.current);
      radiusCircleRef.current = null;
    }

    if (droppedPin) {
      // 50m Radius circle (USP 1 visual indicator)
      if (radarActive) {
        const circle = L.circle([droppedPin.lat, droppedPin.lng], {
          radius: 50, // 50 meters duplicate threshold!
          color: '#06b6d4',
          fillColor: '#06b6d4',
          fillOpacity: 0.15,
          weight: 2,
          dashArray: '4, 4'
        }).addTo(map);
        radiusCircleRef.current = circle;
      }

      // Dropped Marker
      const dropIcon = L.divIcon({
        className: 'cityfix-droppin',
        html: `
          <div class="relative flex items-center justify-center">
            <span class="absolute w-12 h-12 rounded-full bg-cyan-400/40 animate-ping"></span>
            <div class="w-10 h-10 rounded-full bg-slate-950 border-2 border-cyan-400 shadow-xl flex items-center justify-center text-cyan-400">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 40]
      });

      const marker = L.marker([droppedPin.lat, droppedPin.lng], {
        icon: dropIcon,
        draggable: true
      }).addTo(map);

      marker.on('dragend', (e) => {
        const newPos = e.target.getLatLng();
        setDroppedPin({ lat: newPos.lat, lng: newPos.lng });
      });

      dropPinMarkerRef.current = marker;
      map.panTo([droppedPin.lat, droppedPin.lng], { animate: true, duration: 0.6 });
    }
  }, [droppedPin, radarActive]);

  // Sync Issues to Markers Layer
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    const filtered = issues.filter((issue) => {
      if (categoryFilter === 'ALL') return true;
      return issue.departmentId === categoryFilter;
    });

    filtered.forEach((issue) => {
      if (!issue.location?.lat || !issue.location?.lng) return;

      const isSelected = selectedIssue && selectedIssue.id === issue.id;
      const marker = L.marker([issue.location.lat, issue.location.lng], {
        icon: createCustomMarkerIcon(issue.departmentId, issue.status, isSelected)
      });

      // Bind Rich Tooltip / Popup
      const dept = DEPARTMENTS[issue.departmentId] || DEPARTMENTS.ROAD;
      const isResolved = issue.status?.toLowerCase().includes('resolved') || issue.status?.toLowerCase().includes('closed');

      const popupContent = document.createElement('div');
      popupContent.className = 'w-64 text-slate-100 p-1';
      popupContent.innerHTML = `
        <div class="flex items-center justify-between pb-2 border-b border-slate-700/60 mb-2">
          <span class="text-[10px] font-mono px-2 py-0.5 rounded ${dept.bgClass} font-semibold">
            ${dept.shortName}
          </span>
          <span class="text-[10px] font-mono font-medium ${isResolved ? 'text-emerald-400' : 'text-amber-400'}">
            ${issue.status}
          </span>
        </div>
        ${issue.beforeImage ? `
          <div class="h-28 w-full rounded-lg overflow-hidden mb-2 bg-slate-900 border border-slate-800">
            <img src="${issue.beforeImage}" alt="Report photo" class="w-full h-full object-cover" />
          </div>
        ` : ''}
        <h4 class="font-bold text-xs text-white line-clamp-2 mb-1">${issue.title}</h4>
        <p class="text-[11px] text-slate-400 line-clamp-2 mb-2">${issue.description}</p>
        <div class="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px]">
          <span class="text-slate-400 flex items-center gap-1">
            📍 <span class="truncate max-w-[120px]">${issue.location.address?.split(',')[0] || 'Ward Location'}</span>
          </span>
          <span class="text-cyan-400 font-mono font-bold">👍 ${issue.upvotes || 0}</span>
        </div>
        <div class="mt-2.5 flex items-center gap-1.5">
          <button id="inspect-btn-${issue.id}" class="w-full py-1.5 px-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded transition-colors text-center shadow">
            Inspect Issue
          </button>
        </div>
      `;

      // Event listener for button click inside popup
      popupContent.querySelector(`#inspect-btn-${issue.id}`)?.addEventListener('click', (e) => {
        e.stopPropagation();
        sounds.click();
        onSelectIssue(issue);
        map.closePopup();
      });

      marker.bindPopup(popupContent, { maxWidth: 280 });
      marker.on('click', () => {
        sounds.click();
        onSelectIssue(issue);
      });

      markersGroup.addLayer(marker);
    });
  }, [issues, categoryFilter, selectedIssue]);

  // Center on Selected Issue if updated from outside
  useEffect(() => {
    if (selectedIssue && mapInstanceRef.current && selectedIssue.location?.lat) {
      mapInstanceRef.current.setView([selectedIssue.location.lat, selectedIssue.location.lng], 15, {
        animate: true,
        duration: 0.8
      });
    }
  }, [selectedIssue]);

  // Handle GPS Auto-Detect ("Locate Me")
  const handleLocateMe = () => {
    sounds.click();
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        const { latitude, longitude } = pos.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setDroppedPin({ lat: latitude, lng: longitude });
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([latitude, longitude], 15, { animate: true });
        }
        sounds.success();
      },
      (err) => {
        setLocating(false);
        // Fallback to Ward 12 center with simulated friendly toast
        const fallback = { lat: 28.6289, lng: 77.2065 };
        setDroppedPin(fallback);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([fallback.lat, fallback.lng], 15, { animate: true });
        }
        alert("GPS permission denied or unavailable. Centered to Ward 12 Civic Hub for demonstration.");
      },
      { timeout: 7000 }
    );
  };

  return (
    <div className="relative w-full h-[calc(100vh-7.5rem)] min-h-[500px] rounded-2xl overflow-hidden border border-cyan-500/20 shadow-2xl bg-slate-950 flex flex-col">
      {/* Top Floating Map Controls Toolbar */}
      <div className="absolute top-4 left-4 right-4 z-[500] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        
        {/* Category Filter Pills */}
        <div className="flex items-center space-x-1.5 p-1 rounded-xl bg-slate-950/85 backdrop-blur-md border border-cyan-500/20 shadow-lg pointer-events-auto overflow-x-auto max-w-full">
          <button
            onClick={() => { sounds.click(); setCategoryFilter('ALL'); }}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              categoryFilter === 'ALL'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            All Issues ({issues.length})
          </button>

          {Object.values(DEPARTMENTS).map((dept) => {
            const count = issues.filter((i) => i.departmentId === dept.id).length;
            const isAct = categoryFilter === dept.id;
            return (
              <button
                key={dept.id}
                onClick={() => { sounds.click(); setCategoryFilter(dept.id); }}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  isAct
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: dept.color }}></span>
                <span>{dept.shortName}</span>
                <span className="text-[10px] opacity-75">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Action Controls: Radar & GPS */}
        <div className="flex items-center space-x-2 pointer-events-auto">
          {/* Radar 50m Toggle */}
          <button
            onClick={() => {
              sounds.click();
              setRadarActive(!radarActive);
            }}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium backdrop-blur-md border shadow-lg transition-all ${
              radarActive
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40 shadow-cyan-500/20'
                : 'bg-slate-950/80 text-slate-400 border-slate-700 hover:text-white'
            }`}
            title="Toggle 50m AI Duplicate Detection Radar Ring"
          >
            <Radio size={14} className={radarActive ? "animate-spin" : ""} />
            <span>50m Radar {radarActive ? 'ON' : 'OFF'}</span>
          </button>

          {/* GPS Auto-Detect */}
          <button
            onClick={handleLocateMe}
            disabled={locating}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-950/85 backdrop-blur-md text-xs font-medium text-slate-300 hover:text-cyan-400 border border-slate-700/80 hover:border-cyan-400/50 shadow-lg transition-all"
            title="Auto-detect exact GPS location"
          >
            <Navigation size={14} className={locating ? 'animate-pulse text-cyan-400' : ''} />
            <span>{locating ? 'Locating...' : 'Locate Me'}</span>
          </button>
        </div>
      </div>

      {/* Actual Map Container */}
      <div ref={mapContainerRef} className="w-full flex-1 z-0 relative" />

      {/* Floating Bottom Action Banner when Pin is Dropped */}
      {droppedPin && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[500] w-[92%] max-w-md bg-slate-950/95 backdrop-blur-xl border border-cyan-400/40 rounded-2xl p-4 shadow-2xl shadow-cyan-500/30 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shrink-0">
                <MapPin size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  Target Pin Dropped
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300">
                    50m Zone Active
                  </span>
                </h4>
                <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                  Lat: {droppedPin.lat.toFixed(5)}, Lng: {droppedPin.lng.toFixed(5)}
                </p>
                <p className="text-[10px] text-slate-500 mt-1">
                  Drag the pin anywhere or click "Report at Pin" to test auto-routing & duplicate detection.
                </p>
              </div>
            </div>
            <button
              onClick={() => setDroppedPin(null)}
              className="text-slate-500 hover:text-slate-300 text-sm font-bold p-1"
            >
              ✕
            </button>
          </div>

          <div className="mt-3 flex items-center space-x-2">
            <button
              onClick={() => {
                sounds.click();
                onOpenReportModalWithLocation(droppedPin);
              }}
              className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/30 flex items-center justify-center space-x-1.5 transition-all"
            >
              <Crosshair size={14} />
              <span>Report Issue at this Pin</span>
            </button>
            <button
              onClick={() => setDroppedPin(null)}
              className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 text-xs font-medium border border-slate-800 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Map Legend Overlay in bottom left */}
      <div className="absolute bottom-4 left-4 z-[400] hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-800 text-[11px] text-slate-400">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-amber-400"></span> Active
        </span>
        <span className="text-slate-700">•</span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-cyan-400"></span> In Progress
        </span>
        <span className="text-slate-700">•</span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Resolved / Closed
        </span>
        <span className="text-slate-700">•</span>
        <span className="flex items-center gap-1 text-cyan-400 font-mono">
          Radar = 50m Detection Zone
        </span>
      </div>
    </div>
  );
};
