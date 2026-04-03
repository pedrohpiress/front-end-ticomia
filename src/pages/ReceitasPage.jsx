import { useContext, useEffect, useState } from 'react';
import { CaixaLocalContext } from '../components/CaixaLocalContext';
import { contasService, receitasService } from '../services/api';

const styles = {
  container: { padding: '0' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  title: { fontSize: '24px', fontWeight: 700, color: '#ffffff' },
  button: { backgroundColor: '#00a76f', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' },
  table: { width: '100%', backgroundColor: 'rgb(35, 39, 42)', borderRadius: '16px', boxShadow: '0 0 2px 0 rgba(145, 158, 171, 0.2), 0 12px 24px -4px rgba(145, 158, 171, 0.12)', overflow: 'hidden' },
  tableHeader: { backgroundColor: 'rgb(35, 39, 42)' },
  th: { padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: 600, color: '#637381', borderBottom: '1px solid rgba(145, 158, 171, 0.2)' },
  td: { padding: '16px', fontSize: '14px', color: '#fefeff', borderBottom: '1px solid rgba(145, 158, 171, 0.08)' },
  badge: { padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 600 },
  badgeEfetivada: { backgroundColor: 'rgba(0, 167, 111, 0.16)', color: '#00a76f' },
  badgePendente: { backgroundColor: 'rgba(255, 171, 0, 0.16)', color: '#B76E00' },
  loading: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px', color: '#637381' },
  error: { backgroundColor: '#fff5f5', color: '#b71c1c', padding: '16px', borderRadius: '8px', marginBottom: '24px' },
  emptyState: { textAlign: 'center', padding: '48px', color: '#637381' },
  success: { backgroundColor: '#0f2f23', color: '#2fd18b', padding: '16px', borderRadius: '8px', marginBottom: '24px' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { backgroundColor: '#ffffff', borderRadius: '16px', padding: '24px', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflow: 'auto' },
  modalTitle: { fontSize: '18px', fontWeight: 600, color: '#212b36', marginBottom: '24px' },
  formGroup: { marginBottom: '16px' },
  label: { display: 'block', fontSize: '14px', fontWeight: 500, color: '#637381', marginBottom: '8px' },
  input: { width: '100%', padding: '12px 14px', border: '1px solid rgba(145, 158, 171, 0.32)', borderRadius: '8px', fontSize: '14px', outline: 'none' },
  select: { width: '100%', padding: '12px 14px', border: '1px solid rgba(145, 158, 171, 0.32)', borderRadius: '8px', fontSize: '14px', outline: 'none', backgroundColor: '#fff' },
  modalActions: { display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' },
  buttonCancel: { backgroundColor: '#ffffff', color: '#637381', border: '1px solid rgba(145, 158, 171, 0.32)', borderRadius: '8px', padding: '10px 20px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' },
  actions: { display: 'flex', gap: '8px' },
  actionButton: { border: '1px solid rgba(145, 158, 171, 0.32)', borderRadius: '6px', padding: '6px 10px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', backgroundColor: '#ffffff', color: '#212b36' },
  actionEdit: { color: '#1877F2' },
  actionDelete: { color: '#b71c1c' },
  actionPrimary: { color: '#00a76f' },
  actionDisabled: { opacity: 0.6, cursor: 'not-allowed' },
};

const tiposReceita = [
  { value: 'BILHETERIA', label: 'Bilheteria' },
  { value: 'PATROCINIO', label: 'Patrocinio' },
  { value: 'BAR', label: 'Bar' },
  { value: 'ESTACIONAMENTO', label: 'Estacionamento' },
  { value: 'MERCHANDISING', label: 'Merchandising' },
  { value: 'RENDIMENTO', label: 'Rendimento' },
  { value: 'OUTRAS', label: 'Outras' },
];

const formatCurrency = (value) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value) || 0);

const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('pt-BR');
};

export default function ReceitasPage() {
  const { registrarEntrada } = useContext(CaixaLocalContext);
  const [receitas, setReceitas] = useState([]);
  const [contas, setContas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [efetivandoId, setEfetivandoId] = useState(null);
  const [formData, setFormData] = useState({ descricao: '', tipo: 'BILHETERIA', valor: '', dataReceita: '', contaId: '', observacoes: '' });

  useEffect(() => {
    loadPageData();
  }, []);

  const loadPageData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [receitasResponse, contasResponse] = await Promise.all([receitasService.getAll(), contasService.getAll()]);
      setReceitas(receitasResponse.data || []);
      setContas(contasResponse.data || []);
    } catch (requestError) {
      console.error('Erro ao carregar receitas:', requestError);
      setError('Erro ao carregar receitas. Verifique se o backend esta rodando.');
    } finally {
      setLoading(false);
    }
  };

  const fetchReceitas = async () => {
    const response = await receitasService.getAll();
    setReceitas(response.data || []);
  };

  const resetForm = () => {
    setFormData({ descricao: '', tipo: 'BILHETERIA', valor: '', dataReceita: '', contaId: contas[0]?.id || '', observacoes: '' });
  };

  const openCreateModal = () => {
    setEditingId(null);
    resetForm();
    setModalOpen(true);
  };

  const openEditModal = async (id) => {
    try {
      setModalLoading(true);
      setEditingId(id);
      setModalOpen(true);
      const response = await receitasService.getById(id);
      const data = response.data || {};
      setFormData({
        descricao: data.descricao || '',
        tipo: data.tipo || 'BILHETERIA',
        valor: data.valor !== undefined && data.valor !== null ? String(data.valor) : '',
        dataReceita: data.dataReceita || '',
        contaId: data.contaId || '',
        observacoes: data.observacoes || '',
      });
    } catch (requestError) {
      console.error('Erro ao carregar receita:', requestError);
      setError('Erro ao carregar receita para edicao.');
      setModalOpen(false);
    } finally {
      setModalLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setIsSubmitting(true);
      setError(null);
      const payload = { ...formData, valor: Number(formData.valor), contaId: formData.contaId ? Number(formData.contaId) : undefined };

      if (editingId) {
        await receitasService.update(editingId, payload);
        setSuccess('Receita atualizada com sucesso.');
      } else {
        await receitasService.create(payload);
        setSuccess('Receita criada com sucesso.');
      }

      setModalOpen(false);
      setEditingId(null);
      resetForm();
      await fetchReceitas();
    } catch (requestError) {
      console.error('Erro ao salvar receita:', requestError);
      setError('Erro ao salvar receita. Verifique os dados e tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Confirma a exclusao desta receita?')) return;
    try {
      setDeletingId(id);
      setError(null);
      await receitasService.delete(id);
      setReceitas((current) => current.filter((item) => item.id !== id));
      setSuccess('Receita excluida com sucesso.');
    } catch (requestError) {
      console.error('Erro ao excluir receita:', requestError);
      setError('Erro ao excluir receita.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleEfetivar = async (receita) => {
    try {
      setEfetivandoId(receita.id);
      await receitasService.efetivar(receita.id);
      registrarEntrada({
        valor: receita.valor,
        contaId: receita.contaId,
        key: `receita-efetivar-${receita.id}`,
      });
      await fetchReceitas();
      setSuccess('Receita efetivada com sucesso.');
    } catch (requestError) {
      console.error('Erro ao efetivar receita:', requestError);
      setError('Erro ao efetivar receita.');
    } finally {
      setEfetivandoId(null);
    }
  };

  if (loading) return <div style={styles.loading}>Carregando receitas...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Receitas</h1>
        <button style={styles.button} onClick={openCreateModal}>Nova Receita</button>
      </div>

      {success && <div style={styles.success}>{success}</div>}
      {error && <div style={styles.error}>{error}</div>}

      <table style={styles.table}>
        <thead style={styles.tableHeader}>
          <tr>
            <th style={styles.th}>Descricao</th>
            <th style={styles.th}>Tipo</th>
            <th style={styles.th}>Valor</th>
            <th style={styles.th}>Data</th>
            <th style={styles.th}>Conta</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Acoes</th>
          </tr>
        </thead>
        <tbody>
          {receitas.length === 0 ? (
            <tr>
              <td colSpan="7" style={styles.emptyState}>Nenhuma receita cadastrada.</td>
            </tr>
          ) : (
            receitas.map((receita) => (
              <tr key={receita.id}>
                <td style={styles.td}>{receita.descricao}</td>
                <td style={styles.td}>{receita.tipoDescricao || receita.tipo}</td>
                <td style={styles.td}>{formatCurrency(receita.valor)}</td>
                <td style={styles.td}>{formatDate(receita.dataReceita)}</td>
                <td style={styles.td}>{receita.contaNome || '-'}</td>
                <td style={styles.td}>
                  <span style={{ ...styles.badge, ...(receita.efetivada ? styles.badgeEfetivada : styles.badgePendente) }}>
                    {receita.efetivada ? 'Efetivada' : 'Pendente'}
                  </span>
                </td>
                <td style={styles.td}>
                  <div style={styles.actions}>
                    <button style={{ ...styles.actionButton, ...styles.actionEdit }} onClick={() => openEditModal(receita.id)}>
                      Editar
                    </button>
                    <button
                      style={{ ...styles.actionButton, ...styles.actionPrimary, ...(efetivandoId === receita.id ? styles.actionDisabled : null) }}
                      onClick={() => handleEfetivar(receita)}
                      disabled={receita.efetivada || efetivandoId === receita.id}
                    >
                      {efetivandoId === receita.id ? 'Efetivando...' : 'Efetivar'}
                    </button>
                    <button
                      style={{ ...styles.actionButton, ...styles.actionDelete, ...(deletingId === receita.id ? styles.actionDisabled : null) }}
                      onClick={() => handleDelete(receita.id)}
                      disabled={deletingId === receita.id}
                    >
                      {deletingId === receita.id ? 'Excluindo...' : 'Excluir'}
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
            <h2 style={styles.modalTitle}>{editingId ? 'Editar Receita' : 'Nova Receita'}</h2>
            {modalLoading ? (
              <div style={styles.loading}>Carregando...</div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Descricao *</label>
                  <input style={styles.input} type="text" value={formData.descricao} onChange={(event) => setFormData({ ...formData, descricao: event.target.value })} required />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Tipo *</label>
                  <select style={styles.select} value={formData.tipo} onChange={(event) => setFormData({ ...formData, tipo: event.target.value })} required>
                    {tiposReceita.map((tipo) => (
                      <option key={tipo.value} value={tipo.value}>
                        {tipo.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Conta</label>
                  <select style={styles.select} value={formData.contaId} onChange={(event) => setFormData({ ...formData, contaId: event.target.value })}>
                    <option value="">Selecione</option>
                    {contas.map((conta) => (
                      <option key={conta.id} value={conta.id}>
                        {conta.nome}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Valor *</label>
                  <input style={styles.input} type="number" step="0.01" value={formData.valor} onChange={(event) => setFormData({ ...formData, valor: event.target.value })} required />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Data da Receita *</label>
                  <input style={styles.input} type="date" value={formData.dataReceita} onChange={(event) => setFormData({ ...formData, dataReceita: event.target.value })} required />
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
            )}
          </div>
        </div>
      )}
    </div>
  );
}
