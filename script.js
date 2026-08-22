// ---------------------------------------------------------------------------
// MAP CONFIG — fill this in to turn on the interactive multi-pin map.
// See README.md for step-by-step instructions on getting an API key and
// exact coordinates for each location. Until googleMapsApiKey is replaced,
// the page shows the fallback message + the three "Open in Maps" buttons,
// which work with no setup at all.
// ---------------------------------------------------------------------------
const CONFIG = {
  googleMapsApiKey: "AIzaSyDEwERTxDszpTE8_N3zvROR-CQQaBjGbaQ",


  center: { lat: 42.312074, lng: -71.137693 },
  zoom: 17,


  locations: [
    {
      id: "parking",
      label: "Parking Lot: 358 Goddard Ave",
      icon: "🚗",
      lat: 42.313218, // TODO
      lng: -71.138240, // TODO
      mapsLink: "https://maps.app.goo.gl/b5JTvHNhVi7S8mA49"
    },
    {
      id: "playground",
      label: "Playground",
      icon: "🛝",
      lat: 42.312357, // TODO
      lng: -71.138492, // TODO
      mapsLink: "https://maps.app.goo.gl/1Dag9SxWDHmSphoL7"
    },
    {
      id: "picnic",
      label: "Picnic Area",
      icon: "🧺",
      lat: 42.311566, // TODO
      lng: -71.137573, // TODO
      mapsLink: "https://maps.app.goo.gl/VAikyufZDiDzn8af7"
    }
  ]


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

// ---------------------------------------------------------------------------
// Photo modal — any link with data-modal-image opens its photo in a modal
// (mobile tap and desktop click both just fire a click event, so one
// handler covers both) instead of navigating away. If JS fails to load,
// the link's normal href still opens the photo directly, so it always works.
// ---------------------------------------------------------------------------
function setupPhotoModal() {
  const modal = document.getElementById("photo-modal");
  if (!modal) return;

  const img = document.getElementById("photo-modal-img");
  let lastTrigger = null;

  function openModal(trigger) {
    lastTrigger = trigger;
    img.src = trigger.dataset.modalImage;
    img.alt = trigger.dataset.modalAlt || "";
    modal.hidden = false;
    document.body.classList.add("modal-open");
    modal.querySelector(".photo-modal-close").focus();
  }

  function closeModal() {
    modal.hidden = true;
    img.src = "";
    document.body.classList.remove("modal-open");
    if (lastTrigger) lastTrigger.focus();
  }

  document.querySelectorAll("[data-modal-image]").forEach((trigger) => {
    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      openModal(trigger);
    });
  });

  modal.querySelectorAll("[data-modal-close]").forEach((el) => {
    el.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) closeModal();
  });
}

setupPhotoModal();
