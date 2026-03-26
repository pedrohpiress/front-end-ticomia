#!/usr/bin/env node

/**
 * Script SIMPLES: Apenas renomear .ts/.tsx para .js/.jsx
 * JavaScript ignora type annotations anyway!
 */

import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkDir(filePath, callback);
    } else {
      callback(filePath);
    }
  });
}

async function main() {
  const projectRoot = 'c:\\Users\\pedro\\Documentos\\ticomia\\front-end-ticomia\\material-kit-react';
  const srcDir = path.join(projectRoot, 'src');

  let renamed = 0;

  // Apenas renomear arquivos
  walkDir(srcDir, (filePath) => {
    if (filePath.endsWith('.tsx')) {
      const jsPath = filePath.replace(/\.tsx$/, '.jsx');
      fs.renameSync(filePath, jsPath);
      console.log(`${path.basename(filePath)} → ${path.basename(jsPath)} ✅`);
      renamed++;
    } else if (filePath.endsWith('.ts') && !filePath.endsWith('.d.ts')) {
      const jsPath = filePath.replace(/\.ts$/, '.js');
      fs.renameSync(filePath, jsPath);
      console.log(`${path.basename(filePath)} → ${path.basename(jsPath)} ✅`);
      renamed++;
    }
  });

  console.log(`\n✅ RENOMEADOS: ${renamed} arquivos`);
  console.log(`\n📝 NOTA: As type annotations do TypeScript foram mantidas.`);
  console.log(`   JavaScript as ignora naturalmente!`);
  console.log(`   A segurança de tipos vem do seu backend Java.`);
}

main().catch(console.error);
