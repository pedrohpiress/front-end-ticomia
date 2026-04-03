import { useContext, useEffect, useMemo, useState } from 'react';
import { CaixaLocalContext } from '../components/CaixaLocalContext';
import { contasService, fluxoCaixaService } from '../services/api';

const styles = {
  container: { padding: '0', backgroundColor: 'transparent' },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    gap: '12px',
    flexWrap: 'wrap',
  },
  title: { fontSize: '24px', fontWeight: 700, color: '#f4f6f8' },
  buttonGroup: { display: 'flex', gap: '12px' },
  section: {
    backgroundColor: '#1f2326',
    borderRadius: '16px',
    padding: '18px',
    boxShadow: '0 0 2px 0 rgba(99, 115, 129, 0.18), 0 12px 24px -4px rgba(99, 115, 129, 0.10)',
  },
  button: {
    backgroundColor: '#00a76f',
    color: '#f4f6f8',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  buttonSecondary: {
    backgroundColor: '#1877f2',
    color: '#f4f6f8',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  table: {
    width: '100%',
    backgroundColor: '#1f2326',
    borderRadius: '16px',
    boxShadow: '0 0 2px 0 rgba(99, 115, 129, 0.18), 0 12px 24px -4px rgba(99, 115, 129, 0.10)',
    overflow: 'hidden',
  },
  tableWrap: {
    overflowX: 'auto',
  },
  tableHeader: { backgroundColor: '#23272a' },
  th: {
    padding: '16px',
    textAlign: 'left',
    fontSize: '14px',
    fontWeight: 600,
    color: '#b0b8c1',
    borderBottom: '1px solid rgba(99, 115, 129, 0.18)',
  },
  td: {
    padding: '16px',
    fontSize: '14px',
    color: '#f4f6f8',
    borderBottom: '1px solid rgba(99, 115, 129, 0.08)',
  },
  filters: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '12px',
    marginBottom: '16px',
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    border: '1px solid rgba(99, 115, 129, 0.32)',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    backgroundColor: '#181a1b',
    color: '#f4f6f8',
  },
  select: {
    width: '100%',
    padding: '12px 14px',
    border: '1px solid rgba(99, 115, 129, 0.32)',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    backgroundColor: '#181a1b',
    color: '#f4f6f8',
  },
  saldoCard: {
    marginBottom: '14px',
    border: '1px solid rgba(99, 115, 129, 0.24)',
    borderRadius: '10px',
    padding: '14px',
    backgroundColor: '#181a1b',
  },
  saldoLabel: { color: '#b0b8c1', fontSize: '13px' },
  saldoValue: { color: '#7ad9b2', fontSize: '24px', fontWeight: 700 },
  badge: { padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 600 },
  badgeEntrada: { backgroundColor: 'rgba(0, 167, 111, 0.16)', color: '#00a76f' },
  badgeSaida: { backgroundColor: 'rgba(255, 86, 48, 0.16)', color: '#ff5630' },
  badgeTransferencia: { backgroundColor: 'rgba(24, 119, 242, 0.16)', color: '#1877f2' },
  badgePendente: { backgroundColor: 'rgba(255, 171, 0, 0.16)', color: '#ffab00' },
  badgeEfetivado: { backgroundColor: 'rgba(0, 167, 111, 0.16)', color: '#00a76f' },
  loading: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px', color: '#b0b8c1' },
  error: { backgroundColor: '#2d1a1a', color: '#ff6f6f', padding: '16px', borderRadius: '8px', marginBottom: '24px' },
  success: { backgroundColor: '#0f2f23', color: '#7ad9b2', padding: '16px', borderRadius: '8px', marginBottom: '24px' },
  emptyState: { textAlign: 'center', padding: '48px', color: '#b0b8c1' },
  valorEntrada: { color: '#00a76f', fontWeight: 600 },
  valorSaida: { color: '#ff5630', fontWeight: 600 },
  valorTransferencia: { color: '#4da3ff', fontWeight: 600 },
  actions: { display: 'flex', gap: '8px' },
  actionButton: {
    border: '1px solid rgba(99, 115, 129, 0.32)',
    borderRadius: '6px',
    padding: '6px 10px',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
    backgroundColor: '#23272a',
    color: '#f4f6f8',
  },
  actionEdit: { color: '#90caf9' },
  actionEfetivar: { color: '#7ad9b2' },
  actionDisabled: { opacity: 0.6, cursor: 'not-allowed' },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: { backgroundColor: '#23272a', borderRadius: '16px', padding: '24px', width: '100%', maxWidth: '560px' },
  modalTitle: { fontSize: '18px', fontWeight: 600, color: '#f4f6f8', marginBottom: '24px' },
  formGroup: { marginBottom: '16px' },
  label: { display: 'block', fontSize: '14px', fontWeight: 500, color: '#b0b8c1', marginBottom: '8px' },
  modalActions: { display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' },
  buttonCancel: {
    backgroundColor: '#23272a',
    color: '#b0b8c1',
    border: '1px solid rgba(99, 115, 129, 0.32)',
    borderRadius: '8px',
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
  },
};

const formatCurrency = (value) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value) || 0);

const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('pt-BR');
};

export default function FluxoCaixaPage() {
  const { registrarEntrada, registrarSaida, registrarTransferencia } = useContext(CaixaLocalContext);
  const [lancamentos, setLancamentos] = useState([]);
  const [contas, setContas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEfetivandoId, setIsEfetivandoId] = useState(null);
  const [filters, setFilters] = useState({ contaId: '', tipo: '', dataInicio: '', dataFim: '' });
  const [formData, setFormData] = useState({
    tipo: 'ENTRADA',
    descricao: '',
    valor: '',
    dataLancamento: '',
    contaOrigemId: '',
    contaDestinoId: '',
    categoriaId: '',
    observacoes: '',
  });

  useEffect(() => {
    loadPageData();
  }, []);

  const loadPageData = async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([fetchLancamentos(), fetchContas()]);
    } catch (requestError) {
      console.error('Erro ao carregar fluxo de caixa:', requestError);
      setError('Erro ao carregar fluxo de caixa.');
    } finally {
      setLoading(false);
    }
  };

  const fetchLancamentos = async () => {
    const response = await fluxoCaixaService.getAll({ page: 0, size: 100, sort: 'dataLancamento,desc' });
    const data = response.data?.content || response.data || [];
    setLancamentos(data);

    data.forEach((item) => {
      if (item.status !== 'EFETIVADO') return;
      if (item.tipo === 'ENTRADA') {
        registrarEntrada({ valor: item.valor, contaId: item.contaId, key: `fluxo-init-${item.id}` });
      }
      if (item.tipo === 'SAIDA') {
        registrarSaida({ valor: item.valor, contaId: item.contaId, key: `fluxo-init-${item.id}` });
      }
    });
  };

  const fetchContas = async () => {
    const response = await contasService.getAll();
    setContas(response.data || []);
  };

  const filteredLancamentos = useMemo(() => {
    return [...lancamentos]
      .filter((item) => {
        if (filters.contaId && String(item.contaId) !== String(filters.contaId)) return false;
        if (filters.tipo && item.tipo !== filters.tipo) return false;
        if (filters.dataInicio && item.dataLancamento < filters.dataInicio) return false;
        if (filters.dataFim && item.dataLancamento > filters.dataFim) return false;
        return true;
      })
      .sort((a, b) => new Date(a.dataLancamento) - new Date(b.dataLancamento));
  }, [lancamentos, filters]);

  const saldoAcumulado = useMemo(() => {
    return filteredLancamentos.reduce((acc, item) => {
      if (item.tipo === 'ENTRADA') return acc + Number(item.valor || 0);
      if (item.tipo === 'SAIDA') return acc - Number(item.valor || 0);
      return acc;
    }, 0);
  }, [filteredLancamentos]);

  const resetForm = () => {
    const defaultConta = contas[0]?.id || '';
    setFormData({
      tipo: 'ENTRADA',
      descricao: '',
      valor: '',
      dataLancamento: '',
      contaOrigemId: defaultConta,
      contaDestinoId: defaultConta,
      categoriaId: '',
      observacoes: '',
    });
  };

  const openCreateModal = (tipo) => {
    setEditingId(null);
    resetForm();
    setFormData((current) => ({ ...current, tipo }));
    setModalOpen(true);
  };

  const openEditModal = async (id) => {
    try {
      setError(null);
      const response = await fluxoCaixaService.getById(id);
      const data = response.data || {};
      setEditingId(id);
      setFormData({
        tipo: data.tipo || 'ENTRADA',
        descricao: data.descricao || '',
        valor: data.valor ? String(data.valor) : '',
        dataLancamento: data.dataLancamento || '',
        contaOrigemId: data.contaId || contas[0]?.id || '',
        contaDestinoId: data.contaId || contas[0]?.id || '',
        categoriaId: data.categoriaId || '',
        observacoes: data.observacoes || '',
      });
      setModalOpen(true);
    } catch (requestError) {
      console.error('Erro ao carregar lancamento para edicao:', requestError);
      setError('Erro ao carregar lancamento para edicao.');
    }
  };

  const submitEntradaOuSaida = async () => {
    const payload = {
      contaId: Number(formData.contaOrigemId),
      valor: Number(formData.valor),
      dataLancamento: formData.dataLancamento,
      descricao: formData.descricao,
      categoriaId: formData.categoriaId ? Number(formData.categoriaId) : undefined,
      observacoes: formData.observacoes || undefined,
    };

    if (editingId) {
      await fluxoCaixaService.update(editingId, payload);
      return;
    }

    if (formData.tipo === 'ENTRADA') {
      await fluxoCaixaService.registrarEntrada(payload);
      registrarEntrada({
        valor: payload.valor,
        contaId: payload.contaId,
        key: `fluxo-create-entrada-${Date.now()}`,
      });
      return;
    }

    await fluxoCaixaService.registrarSaida(payload);
    registrarSaida({
      valor: payload.valor,
      contaId: payload.contaId,
      key: `fluxo-create-saida-${Date.now()}`,
    });
  };

  const submitTransferencia = async () => {
    const payload = {
      contaOrigemId: Number(formData.contaOrigemId),
      contaDestinoId: Number(formData.contaDestinoId),
      valor: Number(formData.valor),
      descricao: formData.descricao || undefined,
    };
    await contasService.transferir(payload);
    registrarTransferencia({
      valor: payload.valor,
      contaOrigemId: payload.contaOrigemId,
      contaDestinoId: payload.contaDestinoId,
      key: `fluxo-transfer-${Date.now()}`,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setIsSubmitting(true);
      setError(null);

      if (formData.tipo === 'TRANSFERENCIA') {
        await submitTransferencia();
        setSuccess('Transferencia registrada com sucesso.');
      } else {
        await submitEntradaOuSaida();
        setSuccess(editingId ? 'Lancamento atualizado com sucesso.' : 'Lancamento registrado com sucesso.');
      }

      setModalOpen(false);
      setEditingId(null);
      resetForm();
      await loadPageData();
    } catch (requestError) {
      console.error('Erro ao salvar lancamento:', requestError);
      setError('Erro ao salvar lancamento. Verifique os dados e tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEfetivar = async (lancamento) => {
    try {
      setIsEfetivandoId(lancamento.id);
      await fluxoCaixaService.efetivar(lancamento.id);

      if (lancamento.tipo === 'ENTRADA') {
        registrarEntrada({
          valor: lancamento.valor,
          contaId: lancamento.contaId,
          key: `fluxo-efetivar-${lancamento.id}`,
        });
      }
      if (lancamento.tipo === 'SAIDA') {
        registrarSaida({
          valor: lancamento.valor,
          contaId: lancamento.contaId,
          key: `fluxo-efetivar-${lancamento.id}`,
        });
      }

      await fetchLancamentos();
      setSuccess('Lancamento efetivado com sucesso.');
    } catch (requestError) {
      console.error('Erro ao efetivar lancamento:', requestError);
      setError('Erro ao efetivar lancamento.');
    } finally {
      setIsEfetivandoId(null);
    }
  };

  const getTipoBadge = (tipo) => {
    if (tipo === 'ENTRADA') return styles.badgeEntrada;
    if (tipo === 'SAIDA') return styles.badgeSaida;
    return styles.badgeTransferencia;
  };

  const getValorStyle = (tipo) => {
    if (tipo === 'ENTRADA') return styles.valorEntrada;
    if (tipo === 'SAIDA') return styles.valorSaida;
    return styles.valorTransferencia;
  };

  if (loading) return <div style={styles.loading}>Carregando fluxo de caixa...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Fluxo de Caixa</h1>
        <div style={styles.buttonGroup}>
          <button style={styles.button} onClick={() => openCreateModal('ENTRADA')}>Nova Entrada</button>
          <button style={styles.buttonSecondary} onClick={() => openCreateModal('SAIDA')}>Nova Saida</button>
          <button style={styles.buttonSecondary} onClick={() => openCreateModal('TRANSFERENCIA')}>Transferencia</button>
        </div>
      </div>

      {success && <div style={styles.success}>{success}</div>}
      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.section}>
        <div style={styles.filters}>
          <select
            style={styles.select}
            value={filters.contaId}
            onChange={(event) => setFilters({ ...filters, contaId: event.target.value })}
          >
            <option value="">Todas as contas</option>
            {contas.map((conta) => (
              <option key={conta.id} value={conta.id}>
                {conta.nome}
              </option>
            ))}
          </select>
          <select style={styles.select} value={filters.tipo} onChange={(event) => setFilters({ ...filters, tipo: event.target.value })}>
            <option value="">Todos os tipos</option>
            <option value="ENTRADA">Entrada</option>
            <option value="SAIDA">Saida</option>
            <option value="TRANSFERENCIA">Transferencia</option>
          </select>
          <input style={styles.input} type="date" value={filters.dataInicio} onChange={(event) => setFilters({ ...filters, dataInicio: event.target.value })} />
          <input style={styles.input} type="date" value={filters.dataFim} onChange={(event) => setFilters({ ...filters, dataFim: event.target.value })} />
        </div>

        <div style={styles.saldoCard}>
          <div style={styles.saldoLabel}>Saldo acumulado no periodo filtrado</div>
          <div style={styles.saldoValue}>{formatCurrency(saldoAcumulado)}</div>
        </div>

        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead style={styles.tableHeader}>
              <tr>
                <th style={styles.th}>Data</th>
                <th style={styles.th}>Tipo</th>
                <th style={styles.th}>Descricao</th>
                <th style={styles.th}>Conta</th>
                <th style={styles.th}>Valor</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Acoes</th>
              </tr>
            </thead>
            <tbody>
              {filteredLancamentos.length === 0 ? (
                <tr>
                  <td colSpan="7" style={styles.emptyState}>Nenhum lancamento encontrado.</td>
                </tr>
              ) : (
                filteredLancamentos.map((lancamento) => (
                  <tr key={lancamento.id}>
                    <td style={styles.td}>{formatDate(lancamento.dataLancamento)}</td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, ...getTipoBadge(lancamento.tipo) }}>{lancamento.tipo}</span>
                    </td>
                    <td style={styles.td}>{lancamento.descricao}</td>
                    <td style={styles.td}>{lancamento.contaNome || '-'}</td>
                    <td style={{ ...styles.td, ...getValorStyle(lancamento.tipo) }}>
                      {lancamento.tipo === 'SAIDA' ? '-' : '+'} {formatCurrency(lancamento.valor)}
                    </td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, ...(lancamento.status === 'EFETIVADO' ? styles.badgeEfetivado : styles.badgePendente) }}>
                        {lancamento.status}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.actions}>
                        <button style={{ ...styles.actionButton, ...styles.actionEdit }} onClick={() => openEditModal(lancamento.id)}>
                          Editar
                        </button>
                        <button
                          style={{ ...styles.actionButton, ...styles.actionEfetivar, ...(isEfetivandoId === lancamento.id ? styles.actionDisabled : null) }}
                          onClick={() => handleEfetivar(lancamento)}
                          disabled={lancamento.status === 'EFETIVADO' || isEfetivandoId === lancamento.id}
                        >
                          {isEfetivandoId === lancamento.id ? 'Efetivando...' : 'Efetivar'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div style={styles.modalOverlay} onClick={() => setModalOpen(false)}>
          <div style={styles.modal} onClick={(event) => event.stopPropagation()}>
            <h2 style={styles.modalTitle}>{editingId ? 'Editar Lancamento' : 'Novo Lancamento'}</h2>
            <form onSubmit={handleSubmit}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Tipo *</label>
                <select style={styles.select} value={formData.tipo} onChange={(event) => setFormData({ ...formData, tipo: event.target.value })} required>
                  <option value="ENTRADA">ENTRADA</option>
                  <option value="SAIDA">SAIDA</option>
                  <option value="TRANSFERENCIA">TRANSFERENCIA</option>
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Descricao *</label>
                <input style={styles.input} type="text" value={formData.descricao} onChange={(event) => setFormData({ ...formData, descricao: event.target.value })} required />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Valor *</label>
                <input style={styles.input} type="number" step="0.01" value={formData.valor} onChange={(event) => setFormData({ ...formData, valor: event.target.value })} required />
              </div>
              {formData.tipo === 'TRANSFERENCIA' ? (
                <>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Conta Origem *</label>
                    <select style={styles.select} value={formData.contaOrigemId} onChange={(event) => setFormData({ ...formData, contaOrigemId: event.target.value })} required>
                      <option value="">Selecione</option>
                      {contas.map((conta) => (
                        <option key={conta.id} value={conta.id}>
                          {conta.nome}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Conta Destino *</label>
                    <select style={styles.select} value={formData.contaDestinoId} onChange={(event) => setFormData({ ...formData, contaDestinoId: event.target.value })} required>
                      <option value="">Selecione</option>
                      {contas.map((conta) => (
                        <option key={conta.id} value={conta.id}>
                          {conta.nome}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              ) : (
                <div style={styles.formGroup}>
                  <label style={styles.label}>Conta *</label>
                  <select style={styles.select} value={formData.contaOrigemId} onChange={(event) => setFormData({ ...formData, contaOrigemId: event.target.value })} required>
                    <option value="">Selecione</option>
                    {contas.map((conta) => (
                      <option key={conta.id} value={conta.id}>
                        {conta.nome}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div style={styles.formGroup}>
                <label style={styles.label}>Data *</label>
                <input style={styles.input} type="date" value={formData.dataLancamento} onChange={(event) => setFormData({ ...formData, dataLancamento: event.target.value })} required />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Observacoes</label>
                <input style={styles.input} type="text" value={formData.observacoes} onChange={(event) => setFormData({ ...formData, observacoes: event.target.value })} />
              </div>
              <div style={styles.modalActions}>
                <button type="button" style={styles.buttonCancel} onClick={() => setModalOpen(false)} disabled={isSubmitting}>Cancelar</button>
                <button type="submit" style={styles.button} disabled={isSubmitting}>
                  {isSubmitting ? 'Salvando...' : editingId ? 'Atualizar' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
