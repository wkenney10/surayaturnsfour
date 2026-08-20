# Suraya's 4th Birthday Party 🎂

A simple, mobile-friendly one-page site for guests. No build step — it's
plain HTML/CSS/JS, so it can be opened directly or hosted anywhere static
(GitHub Pages, Netlify, etc.).

## What's here

- `index.html` — page content and structure
- `styles.css` — all styling (mobile-first, works fine unstyled-JS too)
- `script.js` — powers the interactive map (optional, see below)
- `images/` — drop the header photo here as `suraya.jpg`

## 1. Add the header photo

Save the photo as `images/suraya.jpg`. That's it — the header picks it up
automatically. If the file is missing, a 🎠 placeholder shows instead of a
broken image, so the site is safe to publish either way.

## 2. Turn on the interactive multi-pin map (optional)

The page works today with zero setup: the Location section shows three big
"Open in Maps" buttons (Parking / Playground / Picnic) that link straight to
the Google Maps links you already have, plus a smaller "backup parking"
link. That's genuinely enough for guests to navigate — the map below is a
nice-to-have on top of it, not a requirement.

If you'd like the actual embedded map with all three pins visible at once,
two things are needed in `script.js`:

**a. A Google Maps JavaScript API key**

1. Go to [console.cloud.google.com](https://console.cloud.google.com/) and
   create a project (or use an existing one).
2. Enable the **Maps JavaScript API** (APIs & Services → Library).
3. Create an API key (APIs & Services → Credentials → Create Credentials →
   API key).
4. **Restrict the key** (Credentials → click the key → "Application
   restrictions" → HTTP referrers) to the domain you'll host this site on,
   e.g. `yourusername.github.io/*`. This is important — an unrestricted key
   in a public repo can be used by anyone.
5. A billing account is required to enable the API, but Google's free
   monthly credit comfortably covers a small page like this.
6. Paste the key into `script.js`, replacing `"YOUR_GOOGLE_MAPS_API_KEY"`.

**b. Exact coordinates for each pin**

I wasn't able to resolve your `maps.app.goo.gl` links to get precise
coordinates automatically. To fill them in:

1. Open each link (on phone or desktop).
2. Look at the address bar (or tap Share → Copy Link on the expanded
   Google Maps page) for something like `@42.32010,-71.13295,17z` — the two
   numbers after the `@` are latitude and longitude.
3. In `script.js`, replace the placeholder `lat`/`lng` for `parking`,
   `playground`, and `picnic` with those numbers. Also update `center` to
   roughly the middle of all three.

Once both are in place, reload the page — the fallback message is replaced
automatically by the live map with three custom pins, and the buttons stay
as-is underneath it.

The backup parking link is deliberately **not** added to `script.js`'s pin
list — it only appears as the small text link under the Parking button, per
the original request to keep it available without cluttering the map.

## Hosting it

Easiest option is GitHub Pages: Settings → Pages → Deploy from branch →
pick this branch and `/ (root)`. No build step needed.
