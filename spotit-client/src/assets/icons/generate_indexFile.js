import { readdirSync, writeFileSync } from 'fs';
import { basename, extname } from 'path';

// Directory containing your icons
const ICONS_DIR = './'; // Update this to your icons directory path if different

// Get all icon files
const iconFiles = readdirSync(ICONS_DIR).filter((file) => {
  // Adjust this filter based on your icon file extensions
  return file.match(/\.(svg|png|jpg|jpeg|jsx)$/i);
});

// Generate the import statements and object mapping
let importStatements = [];
let objectMappings = [];

iconFiles.forEach((file) => {
  // Remove file extension and create valid variable name
  const baseName = basename(file, extname(file));
  const variableName = baseName
    .replace(/[^\w]/g, '_') // Replace non-word chars with underscore
    .replace(/^(\d)/, '_$1'); // Prefix with underscore if starts with number

  importStatements.push(`import ${variableName} from './${file}';`);
  objectMappings.push(`  ${variableName}`);
});

// Create the output content
const outputContent = `${importStatements.join('\n')}

export const icon_map = {
${objectMappings.join(',\n')}
};
`;

// Write to index.js
writeFileSync('index.js', outputContent);

console.log('Successfully generated index.js with icon imports and exports!');
console.log(`Processed ${iconFiles.length} icons.`);
