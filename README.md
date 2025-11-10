# Next.js Blog for GitHub Pages

This is a Next.js static site generator (SSG) blog, migrated from Gatsby, configured for deployment to GitHub Pages.

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

2. Set the base path for GitHub Pages (if deploying to a project site):
```bash
# For project site (username.github.io/repo-name)
export NEXT_PUBLIC_BASE_PATH="/repo-name"

# For user/organization site (username.github.io)
# Leave NEXT_PUBLIC_BASE_PATH empty or unset
```

## Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Build

Build the static site:
```bash
npm run build
```

This will:
1. Generate the RSS feed
2. Build all static pages to the `out/` directory

## Deploy to GitHub Pages

Deploy the built site to GitHub Pages:
```bash
npm run deploy
```

This will:
1. Build the static site
2. Push the `out/` directory to the `gh-pages` branch

Make sure to:
1. Set up GitHub Pages in your repository settings to serve from the `gh-pages` branch
2. Configure the base path if deploying to a project site (not username.github.io)

## Configuration

### Base Path

For GitHub Pages project sites, set the `NEXT_PUBLIC_BASE_PATH` environment variable to your repository name:

```bash
export NEXT_PUBLIC_BASE_PATH="/your-repo-name"
```

Or create a `.env.local` file:
```
NEXT_PUBLIC_BASE_PATH=/your-repo-name
```

### Site Metadata

Edit `lib/generateRSS.js` and component files to update site metadata (title, author, description, etc.).

## Project Structure

```
gh-blog/
├── content/
│   └── blog/          # Blog post markdown files
├── components/        # React components
├── lib/              # Utility functions
│   ├── markdown.js   # Markdown processing
│   ├── getAllPosts.js
│   ├── generateRSS.js
│   └── typography.js
├── pages/            # Next.js pages
│   ├── blog/         # Blog listing and post pages
│   └── ...
├── public/           # Static assets
│   ├── assets/       # Images and other assets
│   └── ...
└── scripts/          # Build scripts
    └── generate-rss.js
```

## Notes

- All pages are statically generated at build time
- No server-side features are used
- Images are served from the `public/` directory
- RSS feed is generated as a static file during build
