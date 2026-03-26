# GUIA DE MIGRAÇÃO: TypeScript → JavaScript
## Orientações Práticas para Migração Completa

---

## 📋 RESUMO DO QUE FOI CRIADO

Os seguintes arquivos foram criados como exemplo prático:

### 1. **Infraestrutura de API**
- `src/api/axiosInstance.js` - Configuração axios com interceptadores
- `src/api/validators.js` - Validadores reutilizáveis e schemas simples
- `src/api/clients/contas.client.js` - Cliente API para Contas (alinhado com Controller Java)

### 2. **Hooks Convertidos**
- `src/hooks/useToast.js` - Sistema de notificações (sem generics TypeScript)
- `src/hooks/useTable.js` - Gerenciamento de estado de tabelas (sem generics)

### 3. **Componente Exemplo**
- `src/sections/contas/view/contas-view.jsx` - Exemplo completo de CRUD com validação

---

## 🔄 COMO USAR ESSES PADRÕES

### Padrão 1: Criar novo API Client

Para cada Controller Java no backend, crie um arquivo `src/api/clients/[feature].client.js`:

```javascript
// src/api/clients/despesas.client.js
import axiosInstance from '../axiosInstance.js';
import { validateFormData, formatApiError } from '../validators.js';

export const despesasClient = {
  listar: async () => {
    try {
      const response = await axiosInstance.get('/despesas');
      return response.data;
    } catch (error) {
      throw {
        message: formatApiError(error, 'Erro ao carregar despesas'),
        status: error.response?.status,
      };
    }
  },

  criar: async (formData) => {
    validateFormData('Despesa', formData); // Validação antes de enviar
    try {
      const response = await axiosInstance.post('/despesas', formData);
      return response.data;
    } catch (error) {
      throw {
        message: formatApiError(error, 'Erro ao criar despesa'),
        status: error.response?.status,
      };
    }
  },

  // ... outros métodos (obter, atualizar, deletar)
};
```

### Padrão 2: Usar Toast em Componentes

```javascript
import { useAppToast } from 'src/hooks/useToast';

export default function MeuComponente() {
  const toast = useAppToast();

  const handleSave = async () => {
    try {
      await api.salvar(dados);
      toast.showSuccess('Salvo com sucesso!');
    } catch (error) {
      toast.showError(error.message);
    }
  };

  // ...
}
```

### Padrão 3: Usar Table Hook

```javascript
import { useTable } from 'src/hooks/useTable';

export default function TabelaView() {
  const table = useTable();
  // Acessar: table.page, table.order, table.orderBy, table.selected, etc.
  // Lógica: table.onSort(), table.onChangePage(), etc.
}
```

### Padrão 4: Estado de Formulário

```javascript
const [formData, setFormData] = useState({
  campo1: '',
  campo2: 0,
  campo3: 'VALOR',
});

// Atualizar campo (spread operator)
const handleChange = (field, value) => {
  setFormData(prev => ({
    ...prev,
    [field]: value,
  }));
};

// Validação antes de enviar
const handleSubmit = async () => {
  if (!formData.campo1.trim()) {
    toast.showWarning('Campo obrigatório');
    return;
  }
  try {
    await client.criar(formData);
    // Sucesso
  } catch (error) {
    toast.showError(error.message);
  }
};
```

---

## 📝 PRÓXIMOS PASSOS RECOMENDADOS

### Fase 1: Completar Infraestrutura
1. ✅ `axiosInstance.js` - FEITO
2. ✅ `validators.js` - FEITO (adicionar mais schemas conforme necessário)
3. ✅ `contas.client.js` - FEITO

**Próximos Clients a criar:**
- `despesas.client.js` - Mesmo padrão que contas
- `receitas.client.js` - Mesmo padrão
- `vendedores.client.js` - Mesmo padrão
- `socios.client.js`
- `documentos.client.js`
- `equipamentos.client.js`
- `eventos.client.js`
- `agendamento.client.js`
- `fluxoCaixa.client.js`
- Outros conforme necessário

**Comando sugerido para criar todos:**
```bash
# Copiar contas.client.js como template e adaptar endpoints
cp src/api/clients/contas.client.js src/api/clients/despesas.client.js
```

### Fase 2: Adicionar Schemas Faltantes

Em `src/api/validators.js`, adicionar schemas para cada entidade:
- ContaBancaria ✅
- Despesa ✅
- Receita ✅
- Vendedor ✅
- Socio ✅

Adicionar mais conforme necessário (Evento, Documento, etc).

### Fase 3: Converter Componentes

Ordem recomendada (simples → complexo):

**Tier 1 (Simples - Sem Estado):**
- `src/components/logo/logo.tsx` → `logo.jsx`
- `src/components/iconify/iconify.tsx` → `iconify.jsx`
- `src/components/label/label.tsx` → `label.jsx`
- `src/components/svg-color/svg-color.tsx` → `svg-color.jsx`

**Tier 2 (Médio - Props simples):**
- `src/components/chart/chart.tsx` → `chart.jsx`
- `src/components/scrollbar/scrollbar.tsx` → `scrollbar.jsx`
- Layout components

**Tier 3 (Complexo - Hooks e Estado):**
- ✅ `src/sections/contas/view/contas-view.tsx` → `contas-view.jsx` (FEITO)
- `src/sections/despesa/view/despesa-view.tsx` → `despesa-view.jsx`
- `src/sections/receita/view/receita-view.tsx` → `receita-view.jsx`
- `src/sections/user/view/user-view.tsx` → `user-view.jsx`
- Outros CRUD components

### Fase 4: Atualizar Config e Main

Alterar em `main.jsx` ou `app.jsx`:
```javascript
import { ToastProvider } from 'src/hooks/useToast';

ReactDOM.createRoot(document.getElementById('root')).render(
  <ToastProvider>
    <App />
  </ToastProvider>
);
```

### Fase 5: Limpeza

- Remover `src/types/index.ts`
- Remover `src/services/` (foi migrado para `src/api/clients/`)
- Atualizar imports em todo o projeto
- Remover `tsconfig.json`

---

## ⚠️ ARMADILHAS COMUNS E COMO EVITAR

### 1. **Não Remover Types Imediatamente**
❌ Ruim: Remover `src/types/index.ts` antes de converter todos os componentes
✅ Bom: Manter types até que todos os componentes estejam migrados

### 2. **Confundir Service vs Client**
❌ Ruim: Deixar `src/services/` junto com `src/api/clients/`
✅ Bom: Usar apenas `src/api/clients/` (seguindo padrão Java Controllers)

### 3. **Validação no Componente vs Client**
❌ Ruim: Toda validação no componente
✅ Bom: Validação de negócio no client, validação de UI no componente

### 4. **Esquecer ToastProvider**
❌ Ruim: Usar `useAppToast()` sem envolver app com `<ToastProvider>`
✅ Bom: Sempre envolver app root com provider

### 5. **Tipagem Oculta**
❌ Ruim: Manter tipos TypeScript em comentários
✅ Bom: Confiar no backend tipado Java, validation simples em JS

---

## 🧪 TESTAR MIGRAÇÃO

Para cada componente migrado, testar:

```javascript
// ✅ API calls funcionam
- GET /listar
- POST /criar (com validação)
- PUT /atualizar (com validação)
- DELETE /deletar

// ✅ UI funciona
- Dialog abre/fecha corretamente
- Formulário prealimentado (edit mode)
- Campos controlados (onChange funciona)

// ✅ Toasts funcionam
- Success ao salvar
- Error ao falhar
- Warning em validação

// ✅ State funciona
- Loading indicator aparece/desaparece
- Dados carregam corretamente
- Computations (totais, somas) calculam certo
- Confirmação delete funciona
```

---

## 📚 REFERÊNCIA RÁPIDA

### Imports Novos (em componentes)
```javascript
import { useAppToast } from 'src/hooks/useToast';
import { useTable } from 'src/hooks/useTable';
import { contasClient } from 'src/api/clients/contas.client';
import { validateFormData } from 'src/api/validators';
```

### Padrões Comuns

**Carregamento:**
```javascript
const [loading, setLoading] = useState(true);
useEffect(() => {
  fetchData();
}, []);
const fetchData = async () => {
  try {
    setLoading(true);
    const data = await client.listar();
    setData(data);
  } catch (error) {
    toast.showError(error.message);
  } finally {
    setLoading(false);
  }
};
```

**Validação:**
```javascript
if (!formData.campo) {
  toast.showWarning('Campo obrigatório');
  return;
}
try {
  validateFormData('SchemaName', formData);
} catch (error) {
  toast.showError(error.message);
}
```

**CRUD:**
```javascript
// Criar
await client.criar(formData);

// Atualizar
await client.atualizar(id, formData);

// Deletar
if (window.confirm('Confirmar?')) {
  await client.deletar(id);
}
```

---

## 📞 DÚVIDAS FREQUENTES

**P: Preciso manter TypeScript?**
R: Não, está sendo migrado 100% para JavaScript. O backend Java mantém a tipagem robusta.

**P: E se eu precisar de tipos mais específicos?**
R: Use validadores em `src/api/validators.js` que agem como "runtime types".

**P: Como com gerencio estado global agora?**
R: Continue usando Context API (hooks) ou adicione Redux se necessário. Para dados de API, mantenha em componente ou use Context.

**P: E o package.json?**
R: Manter como está, apenas não há mais `typescript` como devDependency obrigatória.

**P: Como tenho certeza que a API está correta sem tipos?**
R: O backend Java és tipado. Use `validateFormData()` antes de enviar. Testes de integração verificam contratos.

---

## 🎯 CHECKLIST FINAL

Antes de considerar migração completa:

- [ ] Todos os `clients/*.js` criados
- [ ] Todos os validators schemas definidos
- [ ] Todas as views convertidas para `.jsx`
- [ ] Toast funciona em pelo menos 2 componentes
- [ ] Table hook testado
- [ ] API calls funcionam (GET, POST, PUT, DELETE)
- [ ] Sem erros TypeScript no console
- [ ] `src/types/index.ts` pode ser removido
- [ ] `src/services/` pode ser removido
- [ ] Aplicação compila e funciona localmente
- [ ] Testado em navegador (CRUD básico)

---

## 📖 DOCUMENTAÇÃO EXTERNAL

Referência dos padrões usados:

- **React Hooks:** https://react.dev/reference/react
- **Material-UI:** https://mui.com/
- **Axios:** https://axios-http.com/
- **JavaScript Validation:** Padrão imperativo (sem bibliotecas externas)

---

## ✨ RESUMO FINAL

Você agora tem:

1. ✅ Sistema de validação simples em JS
2. ✅ API clients sem tipos TypeScript
3. ✅ Hooks sem generics TypeScript
4. ✅ Um exemplo completo (ContasView) que podem copiar
5. ✅ Um plano de migração progressivo

**Próximo passo:** Iniciar Fase 1 da migração criando os clients restantes usando o `contas.client.js` como template.

