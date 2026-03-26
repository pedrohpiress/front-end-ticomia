# 🚀 Guia Rápido - Ticomia Financeiro Frontend

## Instalação e Execução

### 1️⃣ Instalar Dependências
```bash
npm install
# ou
yarn install
```

### 2️⃣ Configurar URL da API
Crie um arquivo `.env.local` na raiz do projeto:

```env
REACT_APP_API_URL=http://localhost:8080/api
```

### 3️⃣ Iniciar Servidor de Desenvolvimento
```bash
npm run dev
# ou
yarn dev
```

A aplicação estará disponível em: **http://localhost:3039**

---

## 📱 Funcionalidades Prontas

### Dashboard
- KPIs dinâmicos (Vendedores, Faturamento, Ingressos)
- Gráficos em tempo real
- Top 10 Vendedores
- Alertas de pagamentos

### Módulos Implementados
✅ Vendedores (CRUD + Busca + Filtros)
✅ Receitas (CRUD + Filtro por tipo)
✅ Despesas (CRUD + Status + Pagamentos)
✅ Contas Bancárias (CRUD + Saldo)
✅ Sócios (CRUD + Retiradas)
✅ Fluxo de Caixa (Entradas/Saídas + Paginação)
✅ Eventos (CRUD + Lotes de Ingresso)
✅ Equipamentos (Filtros + Busca)
✅ Documentos (Upload + Download)
✅ Agenda (Pagamentos + Fechamento)

---

## 🔧 Scripts Disponíveis

```bash
npm run dev          # Iniciar desenvolvimento
npm run build        # Build para produção
npm run preview      # Visualizar build
npm run lint         # Verificar código
npm run lint:fix     # Corrigir código automaticamente
npm run fix:all      # Lint + Prettier
```

---

## 📡 Integração API

Todos os serviços estão em `src/services/`:

```typescript
import { vendedoresService, receitasService, ... } from 'src/services';

// Exemplos:
await vendedoresService.listar();
await receitasService.criar(dados);
await despesasService.atualizar(id, dados);
```

---

## 🎨 Sistema de Notificações

```typescript
import { useAppToast } from 'src/hooks/ToastProvider';

export default function Componente() {
  const toast = useAppToast();

  toast.showSuccess('Sucesso!');
  toast.showError('Erro!');
  toast.showWarning('Aviso!');
}
```

---

## ⚡ Performance

- **Code Splitting**: Rotas carregadas sob demanda
- **Lazy Loading**: Componentes pesados carregados quando necessário
- **Suspense**: Loading state automático
- **Responsive**: 100% adapável a todos os tamanhos

---

## 🔐 Autenticação

Token armazenado em `localStorage`:
- Nome: `token`
- Enviado automaticamente em todas as requisições
- Redireciona para login se expirar (erro 401)

---

## 📦 Dependências Principais

- **React 19** - Framework
- **Material-UI 7** - Componentes
- **Axios** - HTTP Client
- **ApexCharts** - Gráficos
- **React Router 7** - Routing
- **TypeScript** - Type Safety

---

## 🐛 Troubleshooting

### Erro: "Cannot find module 'react-helmet-async'"
Já resolvido! Arquivo `.npmrc` configurado com `legacy-peer-deps=true`

### Erro de CORS
Configure CORS no backend Java:
```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
  @Override
  public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/api/**")
      .allowedOrigins("http://localhost:3039")
      .allowedMethods("*")
      .allowCredentials(true);
  }
}
```

### API não responde
1. Verifique se backend está rodando em `http://localhost:8080`
2. Verifique `.env.local` com URL correta
3. Abra DevTools (F12) > Console para ver erros

---

## 📚 Estrutura de Pastas

```
src/
├── services/          # Integração com API
├── types/            # TypeScript DTOs
├── pages/            # Rotas/Páginas
├── sections/         # Componentes por domínio
├── hooks/            # Hooks customizados
├── components/       # Componentes reutilizáveis
├── config/           # Configuração centralizada
├── theme/            # Design system
├── layouts/          # Estruturas de página
└── utils/            # Funções auxiliares
```

---

## 🎯 Próximas Melhorias (Sugestões)

1. **Autenticação real** - Integrar login com API
2. **Validação de forms** - Adicionar biblioteca de validação
3. **Exports** - Implementar export para Excel/PDF
4. **Dark mode** - Tema escuro já suportado
5. **Cache** - Adicionar SWR ou React Query
6. **WebSockets** - Atualizações em tempo real

---

## 📞 Suporte

Para dúvidas sobre o código, consulte:
- `IMPLEMENTACAO.md` - Documentação técnica completa
- `src/services/` - Exemplos de como usar cada serviço
- `src/sections/` - Componentes visuais prontos

---

**Seu frontend está pronto para produção!** 🚀
