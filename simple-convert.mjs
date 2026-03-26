#!/usr/bin/env node

/**
 * Script CONSERVADOR para converter TypeScript para JavaScript
 * Remove apenas:
 * - import type statements
 * - export type statements
 * - Generic type parameters em funções
 * Mantém tudo que é lógica
 */

import fs from 'fs';
import path from 'path';

function removeTypeThingsOnly(content) {
  // Remover APENAS: import type { X } from 'y'
  content = content.replace(/import\s+type\s+\{[^}]*\}\s+from\s+['"][^'"]*['"]\s*;?\n?/g, '');

  // Remover APENAS: import type X from 'y'
  content = content.replace(/import\s+type\s+\w+\s+from\s+['"][^'"]*['"]\s*;?\n?/g, '');

  // Remover APENAS: export type X = ...
  content = content.replace(/export\s+type\s+\w+\s*=[^;]*;?\n?/gm, '');

  // Remover APENAS: export interface X { ... }
  // Mas ser cuidado para não remover o corpo se estiver tudo na mesma linha
  content = content.replace(/export\s+interface\s+[\w<>,\s]+\{[^}]*\}\n?/gm, '');

  // Remover apenas genéricos em tipo de função: <T> mas não em JSX <>
  // Remover <T, U, V> em: const foo = <T>(x: T) =>
  content = content.replace(/(<[A-Za-z<>|&,\s]*>)\s*\(/g, '(');

  // Limpar múltiplas linhas em branco
  content = content.replace(/\n\n\n+/g, '\n\n');

  return content.trim();
}

function convertFile(tsPath, jsPath) {
  try {
    let content = fs.readFileSync(tsPath, 'utf-8');
    content = removeTypeThingsOnly(content);

    const dir = path.dirname(jsPath);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(jsPath, content, 'utf-8');

    return true;
  } catch (error) {
    console.error(`Erro: ${tsPath}: ${error.message}`);
    return false;
  }
}

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

  let converted = 0;
  let failed = 0;

  walkDir(srcDir, (filePath) => {
    if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
      const jsPath = filePath.endsWith('.tsx')
        ? filePath.replace(/\.tsx$/, '.jsx')
        : filePath.replace(/\.ts$/, '.js');

      const relPath = path.relative(projectRoot, filePath).replace(/\\/g, '/');
      process.stdout.write(`${relPath} ... `);

      if (convertFile(filePath, jsPath)) {
        try {
          fs.unlinkSync(filePath);
          console.log('✅');
          converted++;
        } catch (e) {
          console.log('⚠️');
        }
      } else {
        console.log('❌');
        failed++;
      }
    }
  });

  console.log(`\n✅ Convertidos: ${converted}`);
  console.log(`❌ Falhados: ${failed}`);
}

main().catch(console.error);
