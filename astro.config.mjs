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
              },
            },
          },
        };
      }
    },
  };
}

/** Rename CSS assets from name.hash.css to hash.css after build */
function shortenCssFilenames() {
  return {
    name: 'shorten-css',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const distDir = fileURLToPath(dir);
        const assetsDir = join(distDir, '_');
        const files = await readdir(assetsDir);

        // Find CSS files with name prefix (e.g. about.D_9HASpK.css)
        for (const file of files) {
          const match = file.match(/^.+\.([^.]+)\.css$/);
          if (match) {
            const newName = `${match[1]}.css`;
            await rename(join(assetsDir, file), join(assetsDir, newName));

            // Patch all HTML files to reference the new name
            const htmlFiles = (await readdir(distDir)).filter(f => f.endsWith('.html'));
            for (const html of htmlFiles) {
              const path = join(distDir, html);
              const content = await readFile(path, 'utf-8');
              if (content.includes(file)) {
                await writeFile(path, content.replaceAll(file, newName));
              }
            }
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
  integrations: [shortenCssFilenames()],
  vite: {
    plugins: [shortenFilenames()],
  },
});
