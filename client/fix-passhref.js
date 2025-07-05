const fs = require('fs');
const path = require('path');

// Función para procesar un archivo
function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Buscar y reemplazar passHref por legacyBehavior
    const passHrefRegex = /passHref/g;
    const matches = content.match(passHrefRegex);

    if (matches) {
      content = content.replace(passHrefRegex, 'legacyBehavior');
      modified = true;
    }

    // Si se modificó el archivo, escribirlo
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Corregido: ${filePath}`);
      return true;
    }
  } catch (error) {
    console.error(`❌ Error procesando ${filePath}:`, error.message);
  }
  return false;
}

// Función para buscar archivos recursivamente
function findFiles(dir, extension = '.js') {
  const files = [];
  
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        traverse(fullPath);
      } else if (stat.isFile() && item.endsWith(extension)) {
        files.push(fullPath);
      }
    }
  }
  
  traverse(dir);
  return files;
}

// Procesar todos los archivos
const pagesDir = path.join(__dirname, 'pages');
const componentsDir = path.join(__dirname, 'components');
const utilsDir = path.join(__dirname, 'utils');

let totalFiles = 0;
let modifiedFiles = 0;

// Procesar archivos en pages/
if (fs.existsSync(pagesDir)) {
  const pageFiles = findFiles(pagesDir);
  console.log(`\n📁 Procesando ${pageFiles.length} archivos en pages/`);
  
  for (const file of pageFiles) {
    totalFiles++;
    if (processFile(file)) {
      modifiedFiles++;
    }
  }
}

// Procesar archivos en components/
if (fs.existsSync(componentsDir)) {
  const componentFiles = findFiles(componentsDir);
  console.log(`\n📁 Procesando ${componentFiles.length} archivos en components/`);
  
  for (const file of componentFiles) {
    totalFiles++;
    if (processFile(file)) {
      modifiedFiles++;
    }
  }
}

// Procesar archivos en utils/
if (fs.existsSync(utilsDir)) {
  const utilFiles = findFiles(utilsDir);
  console.log(`\n📁 Procesando ${utilFiles.length} archivos en utils/`);
  
  for (const file of utilFiles) {
    totalFiles++;
    if (processFile(file)) {
      modifiedFiles++;
    }
  }
}

console.log(`\n🎉 Proceso completado!`);
console.log(`📊 Total de archivos procesados: ${totalFiles}`);
console.log(`✅ Archivos modificados: ${modifiedFiles}`); 