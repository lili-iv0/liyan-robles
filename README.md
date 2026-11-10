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

### Project videos

Two ways to add a video to a project's gallery (they play inside the project popup):

1. **Upload a file** to `project-images/<project-id>/` in Supabase, for example `02-demo.mp4` or `.webm`. It sorts with the screenshots by file name. Keep it small (free Supabase allows 50 MB per file); an `.mp4` (H.264) works everywhere.
2. **Paste a link** in `src/data/projects.js`: set `video: 'https://youtu.be/...'` (YouTube or Vimeo, best for long videos) or a direct `.mp4` / `.webm` URL. It appears first in the gallery.

### Contact form pictures

The contact form is a Gmail-style compose window. Visitors can attach up to 3 pictures (5 MB each); they are uploaded to the `contact-uploads` bucket and the links are added to the message you receive. Run the last section of `supabase-setup.sql` once to create the bucket. Without Supabase the attach button is hidden and the form still works.

## Layout

All styles are in `src/styles/`. `responsive.css` is imported last in `main.jsx`, so it overrides the other files at tablet and phone sizes.
