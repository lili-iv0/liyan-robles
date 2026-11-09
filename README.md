# Developer Portfolio

A responsive developer portfolio built with React, Vite, React Router and Supabase.
Pixel fonts and chunky pixel borders give it a retro look, with a dark theme by default and a light theme toggle.

## Run it

```bash
npm install
npm run dev      # development
npm run build    # production build in /dist
```

## Edit your content

- `src/data/profile.js`: name, title, bio, skills, timeline, links, contact form id
- `src/data/projects.js`: your projects (set `featured: true` to show one on the home page)
- `src/assets/`: local images (the card thumbnail and the About-page ID card)

## Supabase (optional)

Copy `.env` values `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. See `supabase-setup.sql`.

- Bucket `project-images/<project-id>/`: screenshots shown in the project gallery (name them `01-...`, `02-...` to set the order)
- Bucket `site-images/`: `about-hover.png`, the picture shown when the About ID card is flipped

Without Supabase the site falls back to the local images.

## Layout

All styles are in `src/styles/`. `responsive.css` is imported last in `main.jsx`, so it overrides the other files at tablet and phone sizes.
