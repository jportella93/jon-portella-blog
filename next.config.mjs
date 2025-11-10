import fs from 'fs';
import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || '',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  webpack: (config, { isServer }) => {
    // Watch markdown files in the content directory
    // This ensures changes to .md files trigger a dev server restart
    if (isServer) {
      // For server-side, we need to track these files as dependencies
      const contentDir = path.join(process.cwd(), 'content');
      
      // Add a plugin to track markdown files as dependencies
      config.plugins = config.plugins || [];
      config.plugins.push({
        apply: (compiler) => {
          compiler.hooks.afterCompile.tap('WatchMarkdownFiles', (compilation) => {
            // Add all markdown files in content directory as dependencies
            const addMarkdownFiles = (dir) => {
              try {
                const entries = fs.readdirSync(dir, { withFileTypes: true });
                for (const entry of entries) {
                  const fullPath = path.join(dir, entry.name);
                  if (entry.isDirectory()) {
                    addMarkdownFiles(fullPath);
                  } else if (entry.isFile() && entry.name.endsWith('.md')) {
                    // Add file as a dependency so webpack watches it
                    if (compilation.fileDependencies) {
                      compilation.fileDependencies.add(fullPath);
                    }
                    if (compilation.contextDependencies) {
                      compilation.contextDependencies.add(path.dirname(fullPath));
                    }
                  }
                }
              } catch (err) {
                // Ignore errors
              }
            };
            addMarkdownFiles(contentDir);
          });
        },
      });
    }
    
    config.watchOptions = {
      ...config.watchOptions,
      ignored: [
        '**/node_modules/**',
        '**/.git/**',
        '**/.next/**',
        '**/out/**',
      ],
    };
    return config;
  },
};

export default nextConfig;
