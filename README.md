# Next.js Blog (Cloudflare Pages)

This is a Next.js static site generator (SSG) blog, migrated from Gatsby, deployed to Cloudflare Pages (Workers) using Wrangler.

## Features

- Static site generation (all pages generated at build time)
- Markdown blog posts with syntax highlighting
- RSS feed generation
- Typography system
- All content statically generated - no server required

## Setup

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Creating Blog Posts

1. **Create a new post:**
   ```bash
   npm run create-post
   ```
   This will prompt you for the post title (first line), spoiler (second line), and content (remaining lines). It creates a new directory in `content/blog/` with the post structure.

2. **Add images (optional):**
   Place any images for your post in the `images/` subdirectory that was created in your post directory (e.g., `content/blog/your-post-slug/images/`). Reference images in your markdown using relative paths like `./images/your-image.jpg` or `images/your-image.jpg`.

3. **Process images:**
   ```bash
   npm run process-images
   ```
   This script will:
   - Upload all local images referenced in your post to Cloudflare R2
   - Replace local image references with remote URLs
   - Generate image metadata (dimensions, etc.) for proper display

## Build

Build the static site:

```bash
npm run build
```

This will:

1. Generate the RSS feed
2. Export all static pages to the `out/` directory

## Deploy to Cloudflare Pages (Workers) with Wrangler

1. Install Wrangler (if you don't have it):
   ```bash
   npm install -g wrangler
   ```
2. Authenticate once:
   ```bash
   wrangler login
   ```
3. Build and deploy:

   ```bash
   npm run build
   npx wrangler pages deploy ./out --project-name jon-portella-blog --branch main
   ```

   - Uses `wrangler.jsonc` to serve `./out` as static assets via Cloudflare Pages (Workers).
   - For a preview deployment, set `--branch` to the target branch name (e.g. `feature/my-change`).

## Configuration

### Base Path

The site is served from the root domain, so `BASE_PATH` is empty. If you need to serve from a subpath, update `lib/constants.ts` and `next.config.ts` accordingly.

### Site Metadata

Edit `lib/generateRSS.ts` and component files to update site metadata (title, author, description, etc.).

## Project Structure

```
jon-portella-blog/
├── components/          # React components
├── content/
│   └── blog/            # Markdown posts and images
├── lib/                 # Utilities (markdown, RSS, metadata, timeline)
│   ├── generateRSS.ts
│   ├── timelineData.json
│   └── ...
├── pages/               # Next.js pages (SSG, output: export)
├── public/              # Static assets and generated rss.xml
├── scripts/             # Helpers (generate-rss.ts, fixes, etc.)
├── styles/              # Global and feature styles
├── next.config.ts       # Next.js config (static export)
├── wrangler.jsonc       # Cloudflare Pages (Workers) config
└── package.json
```

## Notes

- All pages are statically generated at build time
- No server-side features are used
- Images are served from the `public/` directory
- RSS feed is generated as a static file during build
