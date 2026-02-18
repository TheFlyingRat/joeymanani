import { defineConfig } from 'astro/config';
import { rename, readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

/** Shorten Vite output filenames (client build only) */
function shortenFilenames() {
  return {
    name: 'shorten-filenames',
    config(config) {
      if (!config.build?.ssr) {
        return {
          build: {
            rollupOptions: {
              output: {
                entryFileNames: '_/[hash].js',
                chunkFileNames: '_/[hash].js',
                assetFileNames: '_/[hash][extname]',
              },
            },
          },
        };
      }
    },
  };
}

/** Rename assets from name.hash.ext to hash.ext after build */
function shortenAssetFilenames() {
  return {
    name: 'shorten-assets',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const distDir = fileURLToPath(dir);
        const assetsDir = join(distDir, '_');
        const files = await readdir(assetsDir);

        // Build rename map for all name.hash.ext files
        const renames = {};
        for (const file of files) {
          const match = file.match(/^.+\.([^.]+)(\.\w+)$/);
          if (match) {
            const newName = `${match[1]}${match[2]}`;
            if (newName !== file) {
              renames[file] = newName;
            }
          }
        }

        if (Object.keys(renames).length === 0) return;

        // Rename files on disk
        for (const [oldName, newName] of Object.entries(renames)) {
          await rename(join(assetsDir, oldName), join(assetsDir, newName));
        }

        // Patch references in all HTML, JS, and CSS output files
        const distFiles = (await readdir(distDir)).filter(f => /\.(html)$/.test(f));
        const assetOutputFiles = (await readdir(assetsDir)).filter(f => /\.(js|css)$/.test(f));
        const allFiles = [
          ...distFiles.map(f => join(distDir, f)),
          ...assetOutputFiles.map(f => join(assetsDir, f)),
        ];

        for (const filePath of allFiles) {
          let content = await readFile(filePath, 'utf-8');
          let modified = false;
          for (const [oldName, newName] of Object.entries(renames)) {
            if (content.includes(oldName)) {
              content = content.replaceAll(oldName, newName);
              modified = true;
            }
          }
          if (modified) {
            await writeFile(filePath, content);
          }
        }

        // Inject <link rel="modulepreload"> for transitive JS chunk deps
        const jsFiles = (await readdir(assetsDir)).filter(f => f.endsWith('.js'));
        const jsContents = {};
        for (const f of jsFiles) {
          jsContents[f] = await readFile(join(assetsDir, f), 'utf-8');
        }

        /** Recursively collect chunk imports from a JS file */
        function collectChunkDeps(filename, visited = new Set()) {
          if (visited.has(filename)) return;
          visited.add(filename);
          const src = jsContents[filename];
          if (!src) return;
          const importRe = /from\s*["']\.\/([^"']+)["']/g;
          let m;
          while ((m = importRe.exec(src)) !== null) {
            collectChunkDeps(m[1], visited);
          }
          return visited;
        }

        const htmlFiles = (await readdir(distDir)).filter(f => f.endsWith('.html'));
        for (const htmlFile of htmlFiles) {
          const htmlPath = join(distDir, htmlFile);
          let html = await readFile(htmlPath, 'utf-8');
          const scriptMatch = html.match(/<script\s+type="module"\s+src="\/_\/([^"]+)"/);
          if (!scriptMatch) continue;

          const entryFile = scriptMatch[1];
          const deps = collectChunkDeps(entryFile);
          if (!deps || deps.size <= 1) continue;

          // Build modulepreload tags for all deps except the entry itself
          const preloadTags = [...deps]
            .filter(f => f !== entryFile)
            .map(f => `<link rel="modulepreload" href="/_/${f}">`)
            .join('');

          if (preloadTags) {
            html = html.replace('</head>', preloadTags + '</head>');
            await writeFile(htmlPath, html);
          }
        }
      },
    },
  };
}

export default defineConfig({
  output: 'static',
  build: {
    format: 'file',
    assets: '_',
  },
  integrations: [shortenAssetFilenames()],
  vite: {
    build: { assetsInlineLimit: 0 },
    plugins: [shortenFilenames()],
  },
});
