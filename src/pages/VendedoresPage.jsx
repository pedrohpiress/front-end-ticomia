import { useEffect, useMemo, useState } from 'react';
import { tiposVendedorService, vendedoresService } from '../services/api';

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
  badgeActive: { backgroundColor: 'rgba(0, 167, 111, 0.16)', color: '#00a76f' },
  badgeInactive: { backgroundColor: 'rgba(255, 86, 48, 0.16)', color: '#ff5630' },
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
  actionDelete: { color: '#ff6f6f' },
  actionToggle: { color: '#7ad9b2' },
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
    maxHeight: '90vh',
    overflow: 'auto',
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
  checkboxRow: { display: 'flex', alignItems: 'center', gap: '8px' },
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

export default function VendedoresPage() {
  const [vendedores, setVendedores] = useState([]);
  const [tiposVendedor, setTiposVendedor] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);
  const [formData, setFormData] = useState({
    numero: '',
    nome: '',
    cidadeId: '',
    whatsapp: '',
    tipoVendedorId: 1,
    ativo: true,
    observacoes: '',
  });

  const tiposMap = useMemo(() => {
    const map = {};
    tiposVendedor.forEach((tipo) => {
      map[tipo.id] = tipo.nome;
    });
    return map;
  }, [tiposVendedor]);

  useEffect(() => {
    loadPageData();
  }, []);

  const loadPageData = async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([fetchVendedores(), fetchTipos()]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTipos = async () => {
    const response = await tiposVendedorService.getAll();
    setTiposVendedor(response.data || []);
  };

  const fetchVendedores = async () => {
    const response = await vendedoresService.getAll();
    setVendedores(response.data || []);
  };

  const resetForm = () => {
    setFormData({
      numero: '',
      nome: '',
      cidadeId: '',
      whatsapp: '',
      tipoVendedorId: 1,
      ativo: true,
      observacoes: '',
    });
  };

  const getTipoNome = (vendedor) => {
    if (vendedor.tipoVendedor && typeof vendedor.tipoVendedor === 'string') {
      return vendedor.tipoVendedor;
    }
    return tiposMap[vendedor.tipoVendedorId] || '-';
  };

  const buildPayload = () => ({
    numero: formData.numero ? Number(formData.numero) : undefined,
    nome: formData.nome,
    cidadeId: formData.cidadeId ? Number(formData.cidadeId) : undefined,
    tipoVendedorId: Number(formData.tipoVendedorId),
    whatsapp: formData.whatsapp || undefined,
    ativo: Boolean(formData.ativo),
    observacoes: formData.observacoes || undefined,
  });

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
      const response = await vendedoresService.getById(id);
      const data = response.data || {};
      setFormData({
        numero: data.numero ?? '',
        nome: data.nome || '',
        cidadeId: data.cidadeId ?? '',
        whatsapp: data.whatsapp || '',
        tipoVendedorId: data.tipoVendedorId || 1,
        ativo: data.ativo !== false,
        observacoes: data.observacoes || '',
      });
    } catch (requestError) {
      console.error('Erro ao carregar vendedor:', requestError);
      setError('Erro ao carregar vendedor para edicao.');
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
      const payload = buildPayload();

      if (editingId) {
        await vendedoresService.update(editingId, payload);
        setSuccess('Vendedor atualizado com sucesso.');
      } else {
        await vendedoresService.create(payload);
        setSuccess('Vendedor criado com sucesso.');
      }

      setModalOpen(false);
      setEditingId(null);
      resetForm();
      await fetchVendedores();
    } catch (requestError) {
      console.error('Erro ao salvar vendedor:', requestError);
      setError('Erro ao salvar vendedor. Verifique os dados e tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Confirma a exclusao deste vendedor?')) return;
    try {
      setDeletingId(id);
      setError(null);
      await vendedoresService.delete(id);
      setVendedores((current) => current.filter((item) => item.id !== id));
      setSuccess('Vendedor excluido com sucesso.');
    } catch (requestError) {
      console.error('Erro ao excluir vendedor:', requestError);
      setError('Erro ao excluir vendedor.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleAtivo = async (id) => {
    try {
      setTogglingId(id);
      setError(null);
      await vendedoresService.toggleAtivo(id);
      await fetchVendedores();
      setSuccess('Status do vendedor atualizado com sucesso.');
    } catch (requestError) {
      console.error('Erro ao alterar status do vendedor:', requestError);
      setError('Erro ao alterar status do vendedor.');
    } finally {
      setTogglingId(null);
    }
  };

  if (loading) return <div style={styles.loading}>Carregando vendedores...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Vendedores</h1>
        <button style={styles.button} onClick={openCreateModal}>Novo Vendedor</button>
      </div>

      {success && <div style={styles.success}>{success}</div>}
      {error && <div style={styles.error}>{error}</div>}

      <table style={styles.table}>
        <thead style={styles.tableHeader}>
          <tr>
            <th style={styles.th}>#</th>
            <th style={styles.th}>Nome</th>
            <th style={styles.th}>Cidade</th>
            <th style={styles.th}>Tipo</th>
            <th style={styles.th}>WhatsApp</th>
            <th style={styles.th}>Faturamento</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Acoes</th>
          </tr>
        </thead>
        <tbody>
          {vendedores.length === 0 ? (
            <tr>
              <td colSpan="8" style={styles.emptyState}>Nenhum vendedor cadastrado.</td>
            </tr>
          ) : (
            vendedores.map((vendedor) => (
              <tr key={vendedor.id}>
                <td style={styles.td}>{vendedor.numero || vendedor.id}</td>
                <td style={styles.td}>{vendedor.nome}</td>
                <td style={styles.td}>{vendedor.cidade || '-'}</td>
                <td style={styles.td}>{getTipoNome(vendedor)}</td>
                <td style={styles.td}>{vendedor.whatsapp || '-'}</td>
                <td style={styles.td}>{formatCurrency(vendedor.totalFaturamento)}</td>
                <td style={styles.td}>
                  <span style={{ ...styles.badge, ...(vendedor.ativo ? styles.badgeActive : styles.badgeInactive) }}>
                    {vendedor.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td style={styles.td}>
                  <div style={styles.actions}>
                    <button
                      type="button"
                      style={{ ...styles.actionButton, ...styles.actionEdit, ...(isSubmitting ? styles.actionDisabled : null) }}
                      onClick={() => openEditModal(vendedor.id)}
                      disabled={isSubmitting}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      style={{ ...styles.actionButton, ...styles.actionToggle, ...(togglingId === vendedor.id ? styles.actionDisabled : null) }}
                      onClick={() => handleToggleAtivo(vendedor.id)}
                      disabled={togglingId === vendedor.id}
                    >
                      {togglingId === vendedor.id ? 'Atualizando...' : vendedor.ativo ? 'Desativar' : 'Ativar'}
                    </button>
                    <button
                      type="button"
                      style={{ ...styles.actionButton, ...styles.actionDelete, ...(deletingId === vendedor.id ? styles.actionDisabled : null) }}
                      onClick={() => handleDelete(vendedor.id)}
                      disabled={deletingId === vendedor.id}
                    >
                      {deletingId === vendedor.id ? 'Excluindo...' : 'Excluir'}
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
            <h2 style={styles.modalTitle}>{editingId ? 'Editar Vendedor' : 'Novo Vendedor'}</h2>
            {modalLoading ? (
              <div style={styles.loading}>Carregando...</div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Nome *</label>
                  <input style={styles.input} type="text" value={formData.nome} onChange={(event) => setFormData({ ...formData, nome: event.target.value })} required />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Tipo de Vendedor *</label>
                  <select
                    style={styles.select}
                    value={formData.tipoVendedorId}
                    onChange={(event) => setFormData({ ...formData, tipoVendedorId: Number(event.target.value) })}
                    required
                  >
                    {tiposVendedor.map((tipo) => (
                      <option key={tipo.id} value={tipo.id}>
                        {tipo.nome}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Numero</label>
                  <input style={styles.input} type="number" value={formData.numero} onChange={(event) => setFormData({ ...formData, numero: event.target.value })} />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Cidade ID</label>
                  <input style={styles.input} type="number" value={formData.cidadeId} onChange={(event) => setFormData({ ...formData, cidadeId: event.target.value })} />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>WhatsApp</label>
                  <input style={styles.input} type="text" value={formData.whatsapp} onChange={(event) => setFormData({ ...formData, whatsapp: event.target.value })} />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Observacoes</label>
                  <input style={styles.input} type="text" value={formData.observacoes} onChange={(event) => setFormData({ ...formData, observacoes: event.target.value })} />
                </div>
                <div style={styles.formGroup}>
                  <div style={styles.checkboxRow}>
                    <input
                      id="vendedor-ativo"
                      type="checkbox"
                      checked={formData.ativo}
                      onChange={(event) => setFormData({ ...formData, ativo: event.target.checked })}
                    />
                    <label htmlFor="vendedor-ativo" style={styles.label}>Ativo</label>
                  </div>
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
