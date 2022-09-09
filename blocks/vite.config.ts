import fs from 'fs';
import path from 'path';
import { defineConfig, PluginOption } from 'vite';
// import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import wpResolve from 'rollup-plugin-wp-resolve';
// import copy, { Target } from 'rollup-plugin-copy';

// import reactRefresh from '@vitejs/plugin-react-refresh';
// import reactSvgPlugin from 'vite-plugin-react-svg';

const extractDependencies = () => {
  const fileRegex = /\.(ts|tsx|js|jsx)$/;
  let deps: string[] = [];

  const option: PluginOption = {
    name: 'extract-dependencies',
    transform(code, id) {
      if (fileRegex.test(id)) {
        const contents = code;
        const dependencies = contents.match(/import.*from.*['|"](.*)['|"]/g);
        const sources = dependencies?.map((d) =>
          d.split('from')[1].replace(/['|"]/g, '').trim()
        );
        const wpSources = sources?.filter((s) => s.startsWith('@wordpress'));

        if (wpSources && wpSources.length > 0) {
          // write file to /dist folder
          const filePath = path.resolve(__dirname, id);
          const fileFolder = path.dirname(filePath);
          const fileDist = path.resolve(fileFolder, 'dist');

          if (!fs.existsSync(fileDist)) {
            fs.mkdirSync(fileDist);
          }

          const fileDepsPhpPath = path.resolve(fileDist, 'index.asset.php');

          if (!fs.existsSync(fileDepsPhpPath)) {
            fs.writeFileSync(fileDepsPhpPath, '<?php return [];');
          }

          const newDependencies = [...new Set([...deps, ...wpSources])];
          deps = newDependencies;

          const phpDependencies = newDependencies
            .map((d) => `'${d.replace('@wordpress/', 'wp-')}'`)
            .join(', ');

          const timestamp = Date.now();
          fs.writeFileSync(
            fileDepsPhpPath,
            `<?php return array('dependencies' => array(${phpDependencies}), 'version' => '${timestamp}');`,
            {
              encoding: 'utf8',
              flag: 'w',
            }
          );
        }
      }
    },
  };
  return option;
};

function getBlockFiles(root: string): Record<string, string> {
  const topLevelFolders = fs.readdirSync(path.resolve(root));
  const files: { [key: string]: string } = {};

  topLevelFolders.forEach((folder) => {
    const isFolder = fs.lstatSync(path.resolve(root, folder)).isDirectory();

    if (!isFolder) return;
    const blockJson = fs.existsSync(path.resolve(root, folder, 'block.json'));

    const indexOptions = ['index.tsx', 'index.ts', 'index.jsx', 'index.js'];
    const indexFile = indexOptions.find((option) =>
      fs.existsSync(path.resolve(root, folder, option))
    );

    if (isFolder && blockJson && indexFile) {
      const indexJs = path.resolve(root, folder, indexFile);
      files[folder] = indexJs;
    }
  });

  return files;
}

const blocks = getBlockFiles(__dirname);
const libName = process.env.LIB;

if (!libName) {
  throw new Error('LIB variable is not set');
}

const currentConfig = blocks[libName];

if (currentConfig === undefined) {
  throw new Error('LIB is not defined or is not valid');
}

export default defineConfig({
  // define: {
  //   global: 'window',
  // },
  // plugins: [
  //   laravel({
  //     input: ['src/js/blocks/blocks.js'],
  //     publicDirectory: 'dist',
  //   }),
  //   // reactSvgPlugin(),
  //   // reactRefresh(),
  // ],
  plugins: [
    extractDependencies(),
    react({
      jsxRuntime: 'classic',
      jsxImportSource: '@wordpress/element',
    }),
    wpResolve(),
    // copy({
    //   targets: getBlockAssetsCopyTargets(__dirname),
    // }),
  ],
  // esbuild: {
  //   loader: 'jsx',
  // },
  // optimizeDeps: {
  //   esbuildOptions: {
  //     loader: {
  //       '.js': 'jsx',
  //     },
  //   },
  // },
  build: {
    outDir: path.resolve(__dirname, libName, 'dist'),
    lib: {
      entry: blocks[libName],
      fileName: (format) => `index.js`,
      name: `beardbalm${libName}`,
      formats: ['iife'],
    },
    emptyOutDir: false,
  },
});
