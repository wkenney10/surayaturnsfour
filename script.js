// ---------------------------------------------------------------------------
// MAP CONFIG — fill this in to turn on the interactive multi-pin map.
// See README.md for step-by-step instructions on getting an API key and
// exact coordinates for each location. Until googleMapsApiKey is replaced,
// the page shows the fallback message + the three "Open in Maps" buttons,
// which work with no setup at all.
// ---------------------------------------------------------------------------
const CONFIG = {
  // TODO: replace with a real Google Maps JavaScript API key (see README.md)
  googleMapsApiKey: "YOUR_GOOGLE_MAPS_API_KEY",

  // TODO: replace with the real center of the three locations below
  // (placeholder is the approximate center of Larz Anderson Park, Brookline MA)
  center: { lat: 42.3199, lng: -71.1329 },
  zoom: 17,

  // TODO: replace each lat/lng with the exact pin from its maps.app.goo.gl link.
  // Easiest way: open the link on your phone/desktop, tap "..." > Share or
  // look at the address bar for something like "@42.xxxxx,-71.xxxxx,17z" —
  // those two numbers are lat and lng.
  locations: [
    {
      id: "parking",
      label: "Parking Lot",
      icon: "🚗",
      lat: 42.3199, // TODO
      lng: -71.1329, // TODO
      mapsLink: "https://maps.app.goo.gl/b5JTvHNhVi7S8mA49"
    },
    {
      id: "playground",
      label: "Playground",
      icon: "🛝",
      lat: 42.3199, // TODO
      lng: -71.1329, // TODO
      mapsLink: "https://maps.app.goo.gl/1Dag9SxWDHmSphoL7"
    },
    {
      id: "picnic",
      label: "Picnic Area",
      icon: "🧺",
      lat: 42.3199, // TODO
      lng: -71.1329, // TODO
      mapsLink: "https://maps.app.goo.gl/VAikyufZDiDzn8af7"
    }
  ]

  // Note: backup parking is intentionally left out of this list — per the
  // request, it should be reachable as a link but not shown as a pin.
};

// Renders each marker with a colored circular badge instead of a stock pin,
// for a friendlier match to the birthday theme.
function markerGlyph(icon) {
  const el = document.createElement("div");
  el.style.cssText = [
    "background:#fff",
    "border:3px solid #ff6f91",
    "border-radius:50%",
    "width:36px",
    "height:36px",
    "display:flex",
    "align-items:center",
    "justify-content:center",
    "font-size:18px",
    "box-shadow:0 2px 6px rgba(0,0,0,0.25)"
  ].join(";");
  el.textContent = icon;
  return el;
}

async function initMap() {
  const mapEl = document.getElementById("map");
  const fallbackEl = document.getElementById("map-fallback");

  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

  const map = new Map(mapEl, {
    center: CONFIG.center,
    zoom: CONFIG.zoom,
    mapId: "SURAYA_BIRTHDAY_MAP",
    disableDefaultUI: false,
    zoomControl: true,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: false
  });

  const bounds = new google.maps.LatLngBounds();

  CONFIG.locations.forEach((loc) => {
    const position = { lat: loc.lat, lng: loc.lng };
    const marker = new AdvancedMarkerElement({
      map,
      position,
      title: loc.label,
      content: markerGlyph(loc.icon)
    });
    marker.addListener("click", () => window.open(loc.mapsLink, "_blank", "noopener"));
    bounds.extend(position);
  });

  map.fitBounds(bounds);

  mapEl.classList.add("is-ready");
  fallbackEl.classList.add("is-hidden");
}

function loadGoogleMaps() {
  const key = CONFIG.googleMapsApiKey;
  const isConfigured = key && key !== "YOUR_GOOGLE_MAPS_API_KEY";
  if (!isConfigured) {
    // Leave the fallback message + buttons visible; nothing else to do.
    return;
  }

  window.initMap = initMap;
  const script = document.createElement("script");
  script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&callback=initMap&v=weekly&libraries=marker`;
  script.async = true;
  script.onerror = () => {
    // Key present but request failed (bad key, restrictions, offline, etc.)
    // — fallback stays visible since map.is-ready never gets added.
    console.error("Google Maps failed to load. Check the API key and its restrictions.");
  };
  document.head.appendChild(script);
}

loadGoogleMaps();
