# Saar Students Union — Website

Statische Website für saarstudentunion.de (Startseite).

## Struktur
- `index.html` — Hauptseite (dreisprachig: de/en/ar)
- `css/` — Styles
- `js/` — i18n, Team-/Feed-Rendering
- `data/` — team.json (Vorstand/Team-Daten), config.example.json (optionale Supabase-Anbindung)
- `images/` — Logo, Team-Fotos, App-Screenshots
- `robots.txt`, `sitemap.xml` — SEO

## Deployment
Live unter https://saarstudentunion.de/ — ausgeliefert über nginx aus
`/var/www/ssu-web/home/` mit Fallback auf das Flask-Backend für alle
nicht-statischen Routen (API, Messenger, Study Room, etc.).

## Offene Punkte
- Impressum & Datenschutz (§5 TMG) — fehlt noch: vollständige Anschrift
  und Vereinsregister-Nr. der Saar Students Union e.V.
- App-Download (/get/, /download/) ist aktuell absichtlich gesperrt,
  bis die App offiziell veröffentlicht wird.
