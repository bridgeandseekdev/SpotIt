// convert-svg.js
import { promisify } from 'util';
import {
  readdir as _readdir,
  readFile as _readFile,
  writeFile as _writeFile,
  existsSync,
  mkdirSync,
} from 'fs';
import { join, basename } from 'path';
import { transform } from '@svgr/core';
const readdir = promisify(_readdir);
const readFile = promisify(_readFile);
const writeFile = promisify(_writeFile);

// SVGR configuration
const svgrConfig = {
  plugins: ['@svgr/plugin-jsx'],
  icon: true,
  typescript: false,
  prettier: true,
  dimensions: true,
  replaceAttrValues: {
    '#000': 'currentColor',
  },
  template: ({ componentName, jsx }, { tpl }) => {
    return tpl`
const ${componentName} = (props) => ${jsx};

export default ${componentName};
`;
  },
};

async function convertSvgToReact() {
  try {
    // Read all files from the classic directory
    const files = await readdir('./classic');

    // Filter only SVG files
    const svgFiles = files.filter((file) => file.endsWith('.svg'));

    for (const file of svgFiles) {
      // Read SVG content
      const svgContent = await readFile(join('./classic', file), 'utf8');

      // Generate component name from filename
      const baseName = basename(file, '.svg');
      const componentName =
        baseName
          .split('_')
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))[1] +
        'Icon';

      // Transform SVG to React component
      const jsxCode = await transform(svgContent, svgrConfig, {
        componentName,
      });

      // Create output directory if it doesn't exist
      const outputDir = './components';
      if (!existsSync(outputDir)) {
        mkdirSync(outputDir);
      }

      // Write the React component file
      const outputPath = join(outputDir, `${componentName}.jsx`);
      await writeFile(outputPath, jsxCode);

      console.log(`Converted ${file} -> ${componentName}.jsx`);
    }

    console.log('All SVG files have been converted successfully!');
  } catch (error) {
    console.error('Error converting SVG files:', error);
  }
}

convertSvgToReact();
