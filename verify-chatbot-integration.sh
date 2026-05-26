#!/bin/bash
# Script de verificação da integração do chatbot

echo "🔍 Verificação da Integração do Chatbot Financeiro"
echo "=================================================="
echo ""

# 1. Verificar arquivos criados
echo "📁 Arquivos Criados:"
echo "---"
find d:/Ticomia/front-end-ticomia/src/components/chat -type f 2>/dev/null | wc -l
echo "   componentes em src/components/chat/"
test -f d:/Ticomia/front-end-ticomia/src/services/chatService.ts && echo "   ✅ chatService.ts"
test -f d:/Ticomia/front-end-ticomia/CHATBOT_INTEGRATION.md && echo "   ✅ CHATBOT_INTEGRATION.md"
test -f d:/Ticomia/front-end-ticomia/CHATBOT_QUICK_START.md && echo "   ✅ CHATBOT_QUICK_START.md"
test -f d:/Ticomia/front-end-ticomia/CHATBOT_SUMMARY.md && echo "   ✅ CHATBOT_SUMMARY.md"
echo ""

# 2. Verificar modificações
echo "📝 Modificações Realizadas:"
echo "---"
grep -q "ChatButton" d:/Ticomia/front-end-ticomia/src/components/Layout.jsx && echo "   ✅ Layout.jsx: ChatButton importado"
grep -q "VITE_CHAT_API_URL" d:/Ticomia/front-end-ticomia/.env.example && echo "   ✅ .env.example: CHAT_API_URL adicionado"
echo ""

# 3. Build verification
echo "🔨 Build Status:"
echo "---"
cd d:/Ticomia/front-end-ticomia
npm run build 2>&1 | grep -E "✓ built|error" | head -1
echo ""

# 4. Arquivo summary
echo "📊 Resumo de Arquivos:"
echo "---"
echo "Componentes:"
ls -lh d:/Ticomia/front-end-ticomia/src/components/chat/*.tsx 2>/dev/null | awk '{printf "   %s (%s)\n", $9, $5}'
echo ""
echo "Services:"
ls -lh d:/Ticomia/front-end-ticomia/src/services/chatService.ts 2>/dev/null | awk '{printf "   %s (%s)\n", $9, $5}'
echo ""
echo "Documentação:"
ls -lh d:/Ticomia/front-end-ticomia/CHATBOT*.md 2>/dev/null | awk '{printf "   %s (%s)\n", $9, $5}'
echo ""

echo "✅ Verificação concluída!"
