# Ormer Events — Jersey corporate events brochure site

A static, dependency-free brochure website for a corporate events business in Jersey, Channel Islands.

## Contents

| Page | Purpose |
| --- | --- |
| `index.html` | Home — positioning, the three building blocks, process, event formats and budget bands, testimonials |
| `venues.html` | **10 venues** with capacities, specs and a working capacity/type filter |
| `entertainment.html` | **5 entertainment programmes** plus a combined-programme option and the weather-contingency section |
| `food-and-drink.html` | **5 food & drink concepts** plus day catering, a catering timeline and an FAQ |
| `contact.html` | Enquiry form with client-side validation, direct contact details, next-steps timeline |

Assets: `assets/css/styles.css`, `assets/js/main.js`. No build step, no frameworks, no external images — artwork is CSS gradients, so it works offline.

## The ten venues

1. The Royal Yacht, St Helier — 300, waterfront hotel
2. Radisson Blu Waterfront Hotel, St Helier — 500, largest ballroom
3. L'Horizon Beach Hotel & Spa, St Brelade — 200, beachfront
4. Grand Jersey Hotel & Spa, St Helier — 150, boutique five-star
5. Jersey Opera House, St Helier — 600 theatre-style
6. Mont Orgueil Castle, Gorey — 120 reception, 13th-century fortress
7. Elizabeth Castle, St Aubin's Bay — 250, tidal island
8. Jersey War Tunnels, St Lawrence — 150, underground
9. Royal Jersey Showground, Trinity — 1,000, blank canvas
10. Samarès Manor, St Clement — 180, manor and gardens

## The five entertainment options

1. Live music, scaled to the room
2. Coastal adventure team-building (RIBs, sailing, coasteering, kayaking)
3. The Island Challenge — GPS treasure hunt across the parishes
4. Awards night production
5. Casino & cabaret evening

## The five food & drink options

1. The Island Banquet — seated three or four courses
2. Shellfish Market — manned live stations
3. Street-Food Festival — island food trucks
4. Canapés & Island Cocktails — Jersey gin and apple brandy
5. Beach Barbecue & Oyster Bar — sunset on the sand

## Run it locally

```bash
cd jersey-corporate-events
python3 -m http.server 8080
# then open http://localhost:8080
```

## Deploy

Any static host — Netlify, Cloudflare Pages, GitHub Pages, S3. Drop the folder in; there is nothing to compile.

## Before it goes live

- **Branding** — "Ormer Events" is a placeholder (an ormer is the Jersey abalone). Replace the name, the `OE` monogram in `.brand__mark`, and the palette variables at the top of `styles.css`.
- **Photography** — swap each `.card__media` / `.feature__media` gradient block for a real image. The classes `.m1`–`.m10` are the only colour hooks, so this is a contained change.
- **Venue facts** — venue names are real Jersey locations, but capacities, inclusions and all prices are indicative placeholders. Confirm with each venue before publishing, and get permission before using their names commercially.
- **Form handler** — `assets/js/main.js` validates and then shows a confirmation; it does not send. Point the form at Formspree, Netlify Forms, or your own endpoint.
- **Legal** — add privacy policy, cookie notice and company registration details in the footer.
- **SEO** — add a favicon, an OG share image, `sitemap.xml` and `robots.txt`, and set canonical URLs.

## Accessibility notes

Skip-free single-column mobile layout, keyboard-operable nav with Escape to close, `aria-current` on the active page, `aria-pressed` on filters, `aria-invalid` plus live error text on the form, visible focus rings, and `prefers-reduced-motion` support that disables reveal animation.
