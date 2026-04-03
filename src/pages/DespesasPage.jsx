import { useContext, useEffect, useMemo, useState } from 'react';
import { CaixaLocalContext } from '../components/CaixaLocalContext';
import { contasService, despesasService } from '../services/api';

const styles = {
  container: { padding: '0', backgroundColor: '#23272a', minHeight: '100vh' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  title: { fontSize: '24px', fontWeight: 700, color: '#f4f6f8' },
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
  table: {
    width: '100%',
    backgroundColor: '#23272a',
    borderRadius: '16px',
    boxShadow: '0 0 2px 0 rgba(99, 115, 129, 0.18), 0 12px 24px -4px rgba(99, 115, 129, 0.10)',
    overflow: 'hidden',
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
  badge: { padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 600 },
  badgePendente: { backgroundColor: 'rgba(255, 171, 0, 0.16)', color: '#ffab00' },
  badgePago: { backgroundColor: 'rgba(0, 167, 111, 0.16)', color: '#00a76f' },
  loading: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px', color: '#b0b8c1' },
  error: { backgroundColor: '#2d1a1a', color: '#ff6f6f', padding: '16px', borderRadius: '8px', marginBottom: '24px' },
  success: { backgroundColor: '#0f2f23', color: '#7ad9b2', padding: '16px', borderRadius: '8px', marginBottom: '24px' },
  emptyState: { textAlign: 'center', padding: '48px', color: '#b0b8c1' },
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
  actionQuit: { color: '#7ad9b2' },
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
  modal: {
    backgroundColor: '#23272a',
    borderRadius: '16px',
    padding: '24px',
    width: '100%',
    maxWidth: '520px',
  },
  modalTitle: { fontSize: '18px', fontWeight: 600, color: '#f4f6f8', marginBottom: '24px' },
  formGroup: { marginBottom: '16px' },
  label: { display: 'block', fontSize: '14px', fontWeight: 500, color: '#b0b8c1', marginBottom: '8px' },
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

const statusToApi = {
  PENDENTE: 'ABERTA',
  PAGO: 'QUITADA',
};

const apiToStatus = {
  ABERTA: 'PENDENTE',
  PARCIAL: 'PENDENTE',
  QUITADA: 'PAGO',
};

export default function DespesasPage() {
  const { registrarSaida } = useContext(CaixaLocalContext);
  const [despesas, setDespesas] = useState([]);
  const [contas, setContas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [payingId, setPayingId] = useState(null);
  const [formData, setFormData] = useState({
    descricao: '',
    valorTotal: '',
    fornecedorId: '',
    status: 'PENDENTE',
    contaId: '',
    dataVencimento: '',
    observacoes: '',
  });

  const fornecedores = useMemo(() => {
    const map = new Map();
    despesas.forEach((despesa) => {
      if (!despesa.fornecedorNome) return;
      const key = despesa.fornecedorId || despesa.id;
      map.set(key, { id: key, nome: despesa.fornecedorNome });
    });
    return Array.from(map.values());
  }, [despesas]);

  useEffect(() => {
    loadPageData();
  }, []);

  const loadPageData = async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([fetchDespesas(), fetchContas()]);
    } catch (requestError) {
      console.error('Erro ao carregar dados de despesas:', requestError);
      setError('Erro ao carregar despesas. Verifique se o backend esta rodando.');
    } finally {
      setLoading(false);
    }
  };

  const fetchDespesas = async () => {
    const response = await despesasService.getAll();
    setDespesas(response.data || []);
  };

  const fetchContas = async () => {
    const response = await contasService.getAll();
    setContas(response.data || []);
  };

  const resetForm = () => {
    setFormData({
      descricao: '',
      valorTotal: '',
      fornecedorId: '',
      status: 'PENDENTE',
      contaId: contas[0]?.id || '',
      dataVencimento: '',
      observacoes: '',
    });
  };

  const openCreateModal = () => {
    setEditingId(null);
    resetForm();
    setModalOpen(true);
  };

  const openEditModal = async (id) => {
    try {
      setError(null);
      const response = await despesasService.getById(id);
      const data = response.data || {};
      setEditingId(id);
      setFormData({
        descricao: data.descricao || '',
        valorTotal: data.valorTotal ? String(data.valorTotal) : '',
        fornecedorId: data.fornecedorId || '',
        status: apiToStatus[data.status] || 'PENDENTE',
        contaId: data.contaId || contas[0]?.id || '',
        dataVencimento: data.dataVencimento || '',
        observacoes: data.observacoes || '',
      });
      setModalOpen(true);
    } catch (requestError) {
      console.error('Erro ao carregar despesa para edicao:', requestError);
      setError('Erro ao carregar despesa para edicao.');
    }
  };

  const getStatusBadge = (status) => {
    const normalized = apiToStatus[status] || 'PENDENTE';
    return normalized === 'PAGO' ? styles.badgePago : styles.badgePendente;
  };

  const buildPayload = () => ({
    descricao: formData.descricao,
    valorTotal: Number(formData.valorTotal),
    fornecedorId: formData.fornecedorId ? Number(formData.fornecedorId) : undefined,
    dataVencimento: formData.dataVencimento || undefined,
    observacoes: formData.observacoes || undefined,
    status: statusToApi[formData.status],
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setIsSubmitting(true);
      setError(null);
      const payload = buildPayload();

      if (editingId) {
        await despesasService.update(editingId, payload);
        setSuccess('Despesa atualizada com sucesso.');
      } else {
        await despesasService.create(payload);
        setSuccess('Despesa criada com sucesso.');
      }

      setModalOpen(false);
      setEditingId(null);
      resetForm();
      await fetchDespesas();
    } catch (requestError) {
      console.error('Erro ao salvar despesa:', requestError);
      setError('Erro ao salvar despesa. Verifique os dados e tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuitar = async (despesa) => {
    const saldoRestante = Number(despesa.saldoRestante ?? Number(despesa.valorTotal) - Number(despesa.valorPago || 0));
    const valorPagamento = saldoRestante > 0 ? saldoRestante : Number(despesa.valorTotal || 0);

    if (valorPagamento <= 0) {
      setError('Nao foi possivel calcular o valor restante para quitar esta despesa.');
      return;
    }

    try {
      setPayingId(despesa.id);
      setError(null);
      const contaId = despesa.contaId || formData.contaId || contas[0]?.id;
      await despesasService.pagar(despesa.id, {
        valor: valorPagamento,
        dataPagamento: new Date().toISOString().slice(0, 10),
        contaId: contaId || undefined,
        observacoes: 'Pagamento total registrado pelo front-end',
      });

      registrarSaida({
        valor: valorPagamento,
        contaOrigemId: contaId,
        key: `despesa-pagar-${despesa.id}-${valorPagamento}`,
      });

      await fetchDespesas();
      setSuccess('Despesa quitada com sucesso.');
    } catch (requestError) {
      console.error('Erro ao quitar despesa:', requestError);
      setError('Erro ao quitar despesa.');
    } finally {
      setPayingId(null);
    }
  };

  if (loading) return <div style={styles.loading}>Carregando despesas...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Despesas</h1>
        <button style={styles.button} onClick={openCreateModal}>Nova Despesa</button>
      </div>

      {success && <div style={styles.success}>{success}</div>}
      {error && <div style={styles.error}>{error}</div>}

      <table style={styles.table}>
        <thead style={styles.tableHeader}>
          <tr>
            <th style={styles.th}>Descricao</th>
            <th style={styles.th}>Fornecedor</th>
            <th style={styles.th}>Valor Total</th>
            <th style={styles.th}>Valor Pago</th>
            <th style={styles.th}>Vencimento</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Acoes</th>
          </tr>
        </thead>
        <tbody>
          {despesas.length === 0 ? (
            <tr>
              <td colSpan="7" style={styles.emptyState}>Nenhuma despesa cadastrada.</td>
            </tr>
          ) : (
            despesas.map((despesa) => (
              <tr key={despesa.id}>
                <td style={styles.td}>{despesa.descricao}</td>
                <td style={styles.td}>{despesa.fornecedorNome || '-'}</td>
                <td style={styles.td}>{formatCurrency(despesa.valorTotal)}</td>
                <td style={styles.td}>{formatCurrency(despesa.valorPago)}</td>
                <td style={styles.td}>{formatDate(despesa.dataVencimento)}</td>
                <td style={styles.td}>
                  <span style={{ ...styles.badge, ...getStatusBadge(despesa.status) }}>
                    {apiToStatus[despesa.status] || 'PENDENTE'}
                  </span>
                </td>
                <td style={styles.td}>
                  <div style={styles.actions}>
                    <button
                      type="button"
                      style={{ ...styles.actionButton, ...styles.actionEdit }}
                      onClick={() => openEditModal(despesa.id)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      style={{ ...styles.actionButton, ...styles.actionQuit, ...(payingId === despesa.id ? styles.actionDisabled : null) }}
                      onClick={() => handleQuitar(despesa)}
                      disabled={payingId === despesa.id || despesa.status === 'QUITADA'}
                    >
                      {payingId === despesa.id ? 'Quitando...' : 'Quitar'}
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {modalOpen && (
        <div style={styles.modalOverlay} onClick={() => setModalOpen(false)}>
          <div style={styles.modal} onClick={(event) => event.stopPropagation()}>
            <h2 style={styles.modalTitle}>{editingId ? 'Editar Despesa' : 'Nova Despesa'}</h2>
            <form onSubmit={handleSubmit}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Descricao *</label>
                <input style={styles.input} type="text" value={formData.descricao} onChange={(event) => setFormData({ ...formData, descricao: event.target.value })} required />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Valor Total *</label>
                <input style={styles.input} type="number" step="0.01" value={formData.valorTotal} onChange={(event) => setFormData({ ...formData, valorTotal: event.target.value })} required />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Fornecedor</label>
                <select
                  style={styles.select}
                  value={formData.fornecedorId}
                  onChange={(event) => setFormData({ ...formData, fornecedorId: event.target.value })}
                >
                  <option value="">Selecione</option>
                  {fornecedores.map((fornecedor) => (
                    <option key={fornecedor.id} value={fornecedor.id}>
                      {fornecedor.nome}
                    </option>
                  ))}
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Status</label>
                <select style={styles.select} value={formData.status} onChange={(event) => setFormData({ ...formData, status: event.target.value })}>
                  <option value="PENDENTE">PENDENTE</option>
                  <option value="PAGO">PAGO</option>
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Conta</label>
                <select style={styles.select} value={formData.contaId} onChange={(event) => setFormData({ ...formData, contaId: Number(event.target.value) })}>
                  <option value="">Selecione</option>
                  {contas.map((conta) => (
                    <option key={conta.id} value={conta.id}>
                      {conta.nome}
                    </option>
                  ))}
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Data de Vencimento</label>
                <input style={styles.input} type="date" value={formData.dataVencimento} onChange={(event) => setFormData({ ...formData, dataVencimento: event.target.value })} />
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
