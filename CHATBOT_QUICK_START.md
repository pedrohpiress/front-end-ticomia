# 🚀 Quick Start - Chatbot Integration

## Setup Rápido (2 minutos)

### 1️⃣ Verificar Environment
```bash
# Criar .env se não existir
cd d:\Ticomia\front-end-ticomia
cp .env.example .env
```

**Conteúdo do .env:**
```
VITE_API_URL=http://localhost:8080/api
VITE_CHAT_API_URL=http://localhost:8000
```

### 2️⃣ Instalar Dependencies (já feito)
```bash
npm install
```

### 3️⃣ Iniciar Frontend
```bash
npm run dev
# Acesso: http://localhost:5173
```

### 4️⃣ Iniciar Chatbot Backend
```bash
cd d:\Ticomia\chatbot-ticomia
python -m venv venv  # Se não existir
source venv/Scripts/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn app.main:main --reload --port 8000
```

### 5️⃣ Testar
- Acesse http://localhost:5173
- Clique no botão 💬 no canto inferior direito
- Digite uma pergunta
- Pressione Enter ou clique no botão enviar
- ✅ Pronto!

---

## 📁 Arquivos Criados

```
src/
├── services/
│   └── chatService.ts                 ← HTTP client
├── components/
│   └── chat/
│       ├── ChatButton.tsx            ← Botão flutuante
│       ├── ChatModal.tsx             ← Modal principal
│       ├── ChatMessage.tsx           ← Renderização mensagem
│       ├── ChatInput.tsx             ← Input + envio
│       ├── TypingIndicator.tsx       ← Animação digitação
│       └── index.ts                  ← Exports
└── components/
    └── Layout.jsx                    ← (modificado: +ChatButton)

CHATBOT_INTEGRATION.md                ← Documentação completa
.env.example                          ← (modificado: +CHAT_URL)
```

---

## 🔍 Verificação

### Build OK? ✓
```bash
npm run build
# Output: ✓ built in X.XXs
```

### Sem erros TypeScript? ✓
```bash
npm run type-check  # Se existir
# ou verificar import errors
```

### Dev server OK? ✓
```bash
npm run dev
# Abre http://localhost:5173 automaticamente
```

---

## 💡 Como Usar

### Opção 1: Automático (já integrado)
Botão aparece automaticamente em todas páginas via `Layout.jsx`

### Opção 2: Manual (se precisar em outro lugar)
```typescript
import { ChatButton } from '@/components/chat';

export function MyComponent() {
  return <ChatButton />;
}
```

### Opção 3: Usar serviço direto
```typescript
import chatService from '@/services/chatService';

const response = await chatService.sendMessage('qual saldo?');
console.log(response);
```

---

## ⚙️ Configuração Avançada

### Mudar URL do Chatbot Backend
```env
# .env
VITE_CHAT_API_URL=http://192.168.1.100:8000
# ou em produção
VITE_CHAT_API_URL=https://chatbot.seu-dominio.com
```

### Aumentar Timeout
```typescript
// src/services/chatService.ts
const TIMEOUT_MS = 60000; // 60 segundos
```

### Aumentar Tentativas
```typescript
// src/services/chatService.ts
const MAX_RETRIES = 3; // 3 tentativas
```

---

## 🎯 Casos de Uso

### ✅ Pergunta simples
"Qual é o saldo total de todas as contas?"

**Resposta esperada:**
```
A conta Banco Inter possui R$ 5.430,00
A conta Bradesco possui R$ 3.210,50
Total: R$ 8.640,50
```

### ✅ Pergunta com contexto
"Qual despesa foi maior no mês passado?"

**Resposta esperada:**
```
A despesa maior no mês passado foi [Nome] no valor de R$ XXXX,XX
```

### ✅ Múltiplas perguntas
O chat mantém histórico, IA pode usar contexto anterior

---

## 🐛 Debugging

### Chat não conecta?
```bash
# 1. Verificar se backend está rodando
curl http://localhost:8000/docs

# 2. Verificar logs do backend
# Procure por erros na janela do uvicorn

# 3. Verificar console do navegador
# F12 → Console → veja erros
```

### Mensagens não salvam?
```javascript
// No console do navegador
localStorage.clear()
// Recarregue e teste novamente
```

### Modal não aparece?
```css
/* Verificar z-index conflict */
/* F12 → Elements → Inspecionar .overlay */
```

---

## 📊 Arquitetura

```
User Interface (React)
        ↓
ChatButton (UI)
        ↓
ChatModal (State Management)
        ↓
chatService (HTTP Client)
        ↓
Backend API (FastAPI)
        ↓
Chatbot Logic (LLM)
```

---

## ✅ Checklist Pré-Deploy

- [ ] `.env` configurado com URLs corretas
- [ ] Backend rodando e acessível
- [ ] `npm run build` sem erros
- [ ] Testar em navegador (Desktop + Mobile)
- [ ] Testar entrada/saída de dados
- [ ] Testar error scenarios (desligar backend, etc)
- [ ] Verificar localStorage funcionando
- [ ] Verificar responsividade mobile

---

## 🆘 Suporte

Problemas comuns:

| Problema | Solução |
|----------|---------|
| CORS error | Verificar backend CORS config |
| Connection refused | Backend não está rodando |
| Timeout | Aumentar `TIMEOUT_MS` |
| Histórico perdido | `localStorage` desabilitado |
| UI quebrada | Limpar cache (Ctrl+Shift+R) |

---

## 📝 Notas

- ✅ Zero breaking changes
- ✅ Segue padrão existente 100%
- ✅ Type-safe com TypeScript
- ✅ Sem dependências extras
- ✅ Pronto para produção

**Qualquer dúvida, refer-se a `CHATBOT_INTEGRATION.md`**
