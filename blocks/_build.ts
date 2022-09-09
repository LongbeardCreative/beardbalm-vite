import { build, PluginOption } from 'vite';
import path from 'path';
import fs from 'fs';
import react from '@vitejs/plugin-react';
import wpResolve from 'rollup-plugin-wp-resolve';

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
    const indexOptions = ['index.tsx', 'index.ts', 'index.jsx', 'index.js'];
    const indexFile = indexOptions.find((option) =>
      fs.existsSync(path.resolve(root, folder, option))
    );

    if (isFolder && indexFile) {
      const indexJs = path.resolve(root, folder, indexFile);
      files[folder] = indexJs;
    }
  });

  return files;
}

const blocks = getBlockFiles(__dirname);

Object.keys(blocks).forEach(async (folder) => {
  await build({
    configFile: false,
    plugins: [
      extractDependencies(),
      react({
        jsxRuntime: 'classic',
        jsxImportSource: '@wordpress/element',
      }),
      wpResolve(),
    ],
    build: {
      outDir: path.resolve(__dirname, folder, 'dist'),
      lib: {
        entry: blocks[folder],
        fileName: (format) => `index.js`,
        name: `beardbalm${folder}`,
        formats: ['iife'],
      },
      emptyOutDir: false,
    },
  });
});
