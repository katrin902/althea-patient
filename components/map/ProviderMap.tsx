'use dom';
import { useEffect, useRef } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────
export interface ProviderPin {
  id: string;
  name: string;
  type: string;
  distance: string;
  waitingTime: string;
  rating: number;
  acceptingPatients: boolean;
  lat: number;
  lng: number;
  isYours: boolean;      // accepted provider
  isPending: boolean;    // request sent, awaiting response
  isRecommended: boolean;
  rank?: number;
}

interface Props {
  providers: ProviderPin[];
  userLat?: number;
  userLng?: number;
  onViewProfile: (id: string) => void;
  dom?: any; // Expo DOM component prop
}

// Declare Leaflet global (loaded from CDN)
declare const L: any;

// ── Component ─────────────────────────────────────────────────────────────
export default function ProviderMap({
  providers,
  userLat = 52.366,
  userLng = 4.885,
  onViewProfile,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);

  // Inject custom popup styles once
  useEffect(() => {
    if (document.getElementById('althea-map-css')) return;
    const style = document.createElement('style');
    style.id = 'althea-map-css';
    style.textContent = `
      html, body { margin: 0; padding: 0; height: 100%; overflow: hidden; }
      #root, #__next { height: 100%; }

      /* Leaflet popup tweaks */
      .althea-popup .leaflet-popup-content-wrapper {
        border-radius: 16px !important;
        box-shadow: 0 8px 32px rgba(0,0,0,0.18) !important;
        padding: 0 !important;
        overflow: hidden;
        border: 1px solid rgba(0,0,0,0.06);
      }
      .althea-popup .leaflet-popup-content {
        margin: 0 !important;
        padding: 0 !important;
        line-height: 1 !important;
      }
      .althea-popup .leaflet-popup-tip-container { display: none !important; }
      .althea-popup .leaflet-popup-close-button {
        top: 8px !important;
        right: 8px !important;
        font-size: 18px !important;
        color: #9CA3AF !important;
        z-index: 1;
      }

      /* You-are-here pulse */
      @keyframes you-pulse {
        0%, 100% { transform: scale(1); opacity: 0.35; }
        50%       { transform: scale(2.2); opacity: 0; }
      }
      .you-pulse { animation: you-pulse 2.2s ease-out infinite; }

      /* Provider pin hover */
      .provider-pin { transition: transform 0.12s; }
      .provider-pin:hover { transform: scale(1.15); }

      /* Popup button */
      .view-btn {
        display: block;
        width: 100%;
        padding: 9px 0;
        margin-top: 8px;
        background: #3AABF0;
        color: white;
        border: none;
        border-radius: 9px;
        font-size: 13px;
        font-weight: 700;
        cursor: pointer;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        letter-spacing: 0.01em;
        transition: background 0.12s;
      }
      .view-btn:hover { background: #1A8ED4; }
    `;
    document.head.appendChild(style);
  }, []);

  useEffect(() => {
    function initMap() {
      if (!containerRef.current || mapRef.current) return;

      const map = L.map(containerRef.current, {
        center: [52.372, 4.895],
        zoom: 13,
        zoomControl: true,
        attributionControl: true,
      });

      // OpenStreetMap tiles (free, no API key)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // ── "You are here" marker ──────────────────────────────────────────
      const youIcon = L.divIcon({
        html: `
          <div style="position:relative;width:20px;height:20px;display:flex;align-items:center;justify-content:center;">
            <div class="you-pulse" style="position:absolute;width:20px;height:20px;border-radius:50%;background:rgba(58,171,240,0.45);"></div>
            <div style="width:12px;height:12px;border-radius:50%;background:#3AABF0;border:2.5px solid white;box-shadow:0 1px 6px rgba(58,171,240,0.55);position:relative;z-index:1;"></div>
          </div>`,
        className: '',
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });

      L.marker([userLat, userLng], { icon: youIcon, zIndexOffset: 1000 })
        .addTo(map)
        .bindTooltip(
          '<span style="font-family:-apple-system,sans-serif;font-size:12px;font-weight:600;color:#1A1A2E">📍 You are here</span>',
          { permanent: false, direction: 'top', offset: [0, -12] }
        );

      // ── Provider markers ────────────────────────────────────────────────
      providers.forEach((p) => {
        const accentColor = p.isYours
          ? '#22C55E'
          : p.isPending
          ? '#F59E0B'
          : p.acceptingPatients
          ? p.isRecommended
            ? '#3AABF0'
            : '#6366F1'
          : '#9CA3AF';

        const label = p.isYours
          ? '★'
          : p.isPending
          ? '?'
          : p.rank != null
          ? String(p.rank)
          : '·';

        const pinHtml = `
          <div class="provider-pin" style="
            width:36px; height:36px; border-radius:50%;
            background:${accentColor};
            border: 3px solid white;
            display:flex; align-items:center; justify-content:center;
            font-size:13px; font-weight:800; color:white;
            box-shadow: 0 3px 12px rgba(0,0,0,0.28);
            cursor:pointer;
            ${!p.acceptingPatients ? 'opacity:0.55;' : ''}
          ">${label}</div>`;

        const icon = L.divIcon({
          html: pinHtml,
          className: '',
          iconSize: [36, 36],
          iconAnchor: [18, 18],
          popupAnchor: [0, -22],
        });

        // Popup card HTML
        const yoursBadge = p.isYours
          ? `<span style="display:inline-block;margin-left:6px;background:#DCFCE7;color:#15803D;font-size:10px;font-weight:700;padding:2px 7px;border-radius:99px;">✓ Your provider</span>`
          : '';

        const pendingBadge = p.isPending
          ? `<span style="display:inline-block;margin-left:6px;background:#FEF3C7;color:#92400E;font-size:10px;font-weight:700;padding:2px 7px;border-radius:99px;">⏳ Request sent</span>`
          : '';

        const notAccepting = !p.acceptingPatients
          ? `<div style="font-size:11px;color:#DC2626;background:#FEF2F2;padding:3px 8px;border-radius:6px;margin-bottom:6px;display:inline-block;">Not accepting patients</div>`
          : '';

        const popupHtml = `
          <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;padding:14px 16px;width:220px;">
            <div style="font-size:14px;font-weight:700;color:#1A1A2E;line-height:1.35;margin-bottom:4px;">
              ${p.name}${yoursBadge}${pendingBadge}
            </div>
            <div style="font-size:12px;color:#6E6E82;margin-bottom:2px;">${p.type}</div>
            <div style="font-size:12px;color:#6E6E82;margin-bottom:8px;">
              ${p.distance} &nbsp;·&nbsp; ${p.waitingTime} wait &nbsp;·&nbsp; ⭐ ${p.rating}
            </div>
            ${notAccepting}
            <button
              class="view-btn"
              data-pid="${p.id}"
            >View profile &nbsp;→</button>
          </div>`;

        L.marker([p.lat, p.lng], { icon })
          .addTo(map)
          .bindPopup(popupHtml, {
            maxWidth: 260,
            minWidth: 220,
            closeButton: true,
            className: 'althea-popup',
          });
      });

      // ── Event delegation for popup "View profile" buttons ───────────────
      // Use capturing on the map container so we catch clicks inside popup DOM
      document.addEventListener(
        'click',
        (e) => {
          const target = (e.target as HTMLElement).closest('[data-pid]');
          if (!target) return;
          const pid = (target as HTMLElement).dataset.pid;
          if (pid) {
            map.closePopup();
            // Bridge call back to React Native
            onViewProfile(pid);
          }
        },
        true
      );

      mapRef.current = map;

      // Ensure the map calculates its size correctly after mount
      requestAnimationFrame(() => {
        if (mapRef.current) mapRef.current.invalidateSize();
      });
    }

    // Load Leaflet from CDN then init
    function loadLeaflet() {
      if (typeof L !== 'undefined') {
        initMap();
        return;
      }

      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        link.crossOrigin = '';
        document.head.prepend(link);
      }

      if (!document.getElementById('leaflet-js')) {
        const script = document.createElement('script');
        script.id = 'leaflet-js';
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.crossOrigin = '';
        script.onload = initMap;
        document.head.appendChild(script);
      } else {
        // Script tag exists but L not yet defined — wait
        const poll = setInterval(() => {
          if (typeof L !== 'undefined') {
            clearInterval(poll);
            initMap();
          }
        }, 50);
      }
    }

    loadLeaflet();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '100%' }}
    />
  );
}
