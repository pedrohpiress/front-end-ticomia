import axios from 'axios';

// Configuracao base da API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// =====================
// DASHBOARD
// =====================
export const dashboardService = {
  // Dashboard completo com todos os KPIs
  getCompleto: (ano = new Date().getFullYear()) =>
    api.get('/dashboard/completo', { params: { ano } }),

  // KPIs do dashboard
  getKPIs: (ano = new Date().getFullYear()) =>
    api.get('/dashboard/kpis', { params: { ano } }),

  // Top 10 vendedores
  getTopVendedores: (ano = new Date().getFullYear()) =>
    api.get('/dashboard/top-vendedores', { params: { ano } }),
};

// =====================
// VENDEDORES
// =====================
export const vendedoresService = {
  getAll: () => api.get('/vendedores'),
  getById: (id) => api.get(`/vendedores/${id}`),
  create: (data) => api.post('/vendedores', data),
  update: (id, data) => api.put(`/vendedores/${id}`, data),
  delete: (id) => api.delete(`/vendedores/${id}`),
  getAtivos: () => api.get('/vendedores/ativos'),
  buscarPorNome: (nome) => api.get('/vendedores/buscar', { params: { nome } }),
  toggleAtivo: (id) => api.patch(`/vendedores/${id}/toggle-ativo`),
};

// =====================
// DESPESAS
// =====================
export const despesasService = {
  getAll: () => api.get('/despesas'),
  getById: (id) => api.get(`/despesas/${id}`),
  create: (data) => api.post('/despesas', data),
  getAbertas: () => api.get('/despesas/abertas'),
  getVencendoHoje: () => api.get('/despesas/vencendo-hoje'),
  pagar: (id, data) => api.post(`/despesas/${id}/pagar`, data),
};

// =====================
// RECEITAS
// =====================
export const receitasService = {
  getAll: () => api.get('/receitas'),
  getById: (id) => api.get(`/receitas/${id}`),
  create: (data) => api.post('/receitas', data),
  update: (id, data) => api.put(`/receitas/${id}`, data),
  delete: (id) => api.delete(`/receitas/${id}`),
  getPendentes: () => api.get('/receitas/pendentes'),
  getConsolidado: () => api.get('/receitas/consolidado'),
  getByTipo: (tipo) => api.get(`/receitas/tipo/${tipo}`),
  efetivar: (id) => api.patch(`/receitas/${id}/efetivar`),
};

// =====================
// SOCIOS
// =====================
export const sociosService = {
  getAll: () => api.get('/socios'),
  getById: (id) => api.get(`/socios/${id}`),
  create: (data) => api.post('/socios', data),
  update: (id, data) => api.put(`/socios/${id}`, data),
};

// =====================
// EVENTOS
// =====================
export const eventosService = {
  getAll: () => api.get('/evento'),
  getById: (id) => api.get(`/evento/${id}`),
  create: (data) => api.post('/evento', data),
  update: (id, data) => api.put(`/evento/${id}`, data),
  getAtivo: () => api.get('/evento/ativo'),
  getContagemRegressiva: () => api.get('/evento/contagem-regressiva'),
};

// =====================
// CONTAS BANCARIAS
// =====================
export const contasService = {
  getAll: () => api.get('/contas'),
  getById: (id) => api.get(`/contas/${id}`),
  create: (data) => api.post('/contas', data),
  getSaldo: (id) => api.get(`/contas/${id}/saldo`),
  transferir: (data) => api.post('/contas/transferir', data),
};

// =====================
// BANCOS
// =====================
export const bancosService = {
  getAll: () => api.get('/bancos'),
  getById: (id) => api.get(`/bancos/${id}`),
  create: (data) => api.post('/bancos', data),
  update: (id, data) => api.put(`/bancos/${id}`, data),
  delete: (id) => api.delete(`/bancos/${id}`),
};

// =====================
// FLUXO DE CAIXA
// =====================
export const fluxoCaixaService = {
  getAll: (pageable) => api.get('/fluxo-caixa', { params: pageable }),
  getById: (id) => api.get(`/fluxo-caixa/${id}`),
  registrarEntrada: (data) => api.post('/fluxo-caixa/entrada', data),
  registrarSaida: (data) => api.post('/fluxo-caixa/saida', data),
  getConsolidado: (inicio, fim) =>
    api.get('/fluxo-caixa/consolidado', { params: { inicio, fim } }),
  efetivar: (id) => api.patch(`/fluxo-caixa/${id}/efetivar`),
};

// =====================
// AGENDA DE PAGAMENTOS
// =====================
export const agendaService = {
  getAll: () => api.get('/agenda-pagamentos'),
  getById: (id) => api.get(`/agenda-pagamentos/${id}`),
  create: (data) => api.post('/agenda-pagamentos', data),
  getPendentes: () => api.get('/agenda-pagamentos/pendentes'),
  getVencendoHoje: () => api.get('/agenda-pagamentos/vencendo-hoje'),
  getVencendoAmanha: () => api.get('/agenda-pagamentos/vencendo-amanha'),
  getProximos7Dias: () => api.get('/agenda-pagamentos/proximos-7-dias'),
  getAtrasados: () => api.get('/agenda-pagamentos/atrasados'),
  getAlertas: () => api.get('/agenda-pagamentos/alertas'),
  marcarComoPago: (id, dataPagamento) =>
    api.patch(`/agenda-pagamentos/${id}/pagar`, null, { params: { dataPagamento } }),
  cancelar: (id) => api.delete(`/agenda-pagamentos/${id}`),
};

// =====================
// EQUIPAMENTOS
// =====================
export const equipamentosService = {
  getAll: () => api.get('/equipamentos'),
  getDisponiveis: () => api.get('/equipamentos/disponiveis'),
  getEmUso: () => api.get('/equipamentos/em-uso'),
  getByVendedor: (vendedorId) => api.get(`/equipamentos/vendedor/${vendedorId}`),
  getByPatrimonio: (patrimonio) => api.get(`/equipamentos/patrimonio/${patrimonio}`),
};

// =====================
// LOTES DE INGRESSO
// =====================
export const lotesService = {
  getAll: () => api.get('/lotes-ingresso'),
  getById: (id) => api.get(`/lotes-ingresso/${id}`),
  create: (data) => api.post('/lotes-ingresso', data),
  update: (id, data) => api.put(`/lotes-ingresso/${id}`, data),
  getAtivos: () => api.get('/lotes-ingresso/ativos'),
  getByEvento: (eventoId) => api.get(`/lotes-ingresso/evento/${eventoId}`),
  desativar: (id) => api.patch(`/lotes-ingresso/${id}/desativar`),
};

// =====================
// FECHAMENTO
// =====================
export const fechamentoService = {
  getAll: () => api.get('/fechamento'),
  getById: (id) => api.get(`/fechamento/${id}`),
  gerar: () => api.post('/fechamento/gerar'),
  fechar: (id) => api.patch(`/fechamento/${id}/fechar`),
};

// =====================
// RETIRADAS
// =====================
export const retiradasService = {
  getAll: () => api.get('/retiradas'),
  getById: (id) => api.get(`/retiradas/${id}`),
  create: (data) => api.post('/retiradas', data),
  getBySocio: (socioId) => api.get(`/retiradas/socio/${socioId}`),
};

export default api;
