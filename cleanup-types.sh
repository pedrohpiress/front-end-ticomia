#!/bin/bash

# Script para remover todas as anotações TypeScript de arquivos .js e .jsx

echo "Iniciando limpeza de anotações TypeScript..."

# Função para limpar um arquivo
cleanup_file() {
  local FILE="$1"
  
  # Remover linhas com "import type"
  sed -i '/^[[:space:]]*import[[:space:]]*type[[:space:]]*{/d' "$FILE"
  sed -i '/^[[:space:]]*import[[:space:]]*type[[:space:]]*.*from/d' "$FILE"
  
  # Remover "export type" e "export interface"
  sed -i '/^[[:space:]]*export[[:space:]]*type[[:space:]]/d' "$FILE"
  sed -i '/^[[:space:]]*export[[:space:]]*interface[[:space:]]/d' "$FILE"
  
  # Remover linhas que são apenas "type X = {" ou "interface X {"
  sed -i '/^[[:space:]]*type[[:space:]]*[A-Za-z]*[[:space:]]*=[[:space:]]*{/d' "$FILE"
  sed -i '/^[[:space:]]*interface[[:space:]]*[A-Za-z]*[[:space:]]*{/d' "$FILE"
  
  # Remover chaves de fechamento que eram para tipos
  sed -i '/^[[:space:]]*};[[:space:]]*$/d' "$FILE"
  
  # Remover ": Type" de declarações
  sed -i 's/: [A-Za-z<>|& ]*//g' "$FILE"
  
  # Remover "as Type" casts
  sed -i 's/ as [A-Za-z<>| ]*//g' "$FILE"
  
  # Remover "<Type>" generics em funções
  sed -i 's/<[A-Za-z<>, ]*>//g' "$FILE"
}

# Processar todos os .jsx files
for file in $(find src -name "*.jsx"); do
  echo "Limpando: $file"
  cleanup_file "$file"
done

# Processar todos os .js files
for file in $(find src -name "*.js"); do
  echo "Limpando: $file"
  cleanup_file "$file"
done

echo "Limpeza concluída!"
