import { useEffect, useMemo, useState } from 'react';
import { equipamentosService } from '../services/api';

const styles = {
  container: { padding: '0' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  title: { fontSize: '24px', fontWeight: 700, color: '#ffffff' },
  button: {
    backgroundColor: '#00a76f',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  table: {
    width: '100%',
    backgroundColor: 'rgb(35, 39, 42)',
    borderRadius: '16px',
    boxShadow: '0 0 2px 0 rgba(145, 158, 171, 0.2), 0 12px 24px -4px rgba(145, 158, 171, 0.12)',
    overflow: 'hidden',
  },
  tableHeader: { backgroundColor: 'rgb(35, 39, 42)' },
  th: { padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: 600, color: '#637381', borderBottom: '1px solid rgba(145, 158, 171, 0.2)' },
  td: { padding: '16px', fontSize: '14px', color: '#fefeff', borderBottom: '1px solid rgba(145, 158, 171, 0.08)' },
  badge: { padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 600 },
  badgeDisponivel: { backgroundColor: 'rgba(0, 167, 111, 0.16)', color: '#00a76f' },
  badgeEmUso: { backgroundColor: 'rgba(24, 119, 242, 0.16)', color: '#1877f2' },
  badgeManutencao: { backgroundColor: 'rgba(255, 171, 0, 0.16)', color: '#ffab00' },
  loading: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px', color: '#637381' },
  error: { backgroundColor: '#fff5f5', color: '#b71c1c', padding: '16px', borderRadius: '8px', marginBottom: '24px' },
  success: { backgroundColor: '#0f2f23', color: '#2fd18b', padding: '16px', borderRadius: '8px', marginBottom: '24px' },
  emptyState: { textAlign: 'center', padding: '48px', color: '#637381' },
  stats: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' },
  statCard: { backgroundColor: '#23272a', borderRadius: '12px', padding: '20px', boxShadow: '0 0 2px 0 rgba(255, 255, 255, 0.2), 0 12px 24px -4px rgba(20, 20, 20, 0.12)' },
  statValue: { fontSize: '24px', fontWeight: 700, color: '#f4f6f8' },
  statLabel: { fontSize: '14px', color: '#b0b3b8', marginTop: '4px' },
  actions: { display: 'flex', gap: '8px' },
  actionButton: { border: '1px solid rgba(145, 158, 171, 0.32)', borderRadius: '6px', padding: '6px 10px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', backgroundColor: '#ffffff', color: '#212b36' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { backgroundColor: '#ffffff', borderRadius: '16px', padding: '24px', width: '100%', maxWidth: '500px' },
  modalTitle: { fontSize: '18px', fontWeight: 600, color: '#212b36', marginBottom: '24px' },
  formGroup: { marginBottom: '16px' },
  label: { display: 'block', fontSize: '14px', fontWeight: 500, color: '#637381', marginBottom: '8px' },
  input: { width: '100%', padding: '12px 14px', border: '1px solid rgba(145, 158, 171, 0.32)', borderRadius: '8px', fontSize: '14px', outline: 'none' },
  select: { width: '100%', padding: '12px 14px', border: '1px solid rgba(145, 158, 171, 0.32)', borderRadius: '8px', fontSize: '14px', outline: 'none' },
  modalActions: { display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' },
  buttonCancel: { backgroundColor: '#ffffff', color: '#637381', border: '1px solid rgba(145, 158, 171, 0.32)', borderRadius: '8px', padding: '10px 20px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' },
};

const statusOptions = [
  { value: 'DISPONIVEL', label: 'Disponivel' },
  { value: 'EM_USO', label: 'Em uso' },
  { value: 'MANUTENCAO', label: 'Manutencao' },
];

export default function EquipamentosPage() {
  const [equipamentos, setEquipamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ patrimonio: '', tipoEquipamento: '', serial: '', status: 'DISPONIVEL', observacoes: '' });

  useEffect(() => {
    fetchEquipamentos();
  }, []);

  const fetchEquipamentos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await equipamentosService.getAll();
      setEquipamentos(Array.isArray(response.data) ? response.data : []);
    } catch (requestError) {
      console.error('Erro ao carregar equipamentos:', requestError);
      setError('Erro ao carregar equipamentos.');
      setEquipamentos([]);
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => ({
    total: equipamentos.length,
    emUso: equipamentos.filter((item) => item.status === 'EM_USO').length,
    disponiveis: equipamentos.filter((item) => item.status === 'DISPONIVEL').length,
    manutencao: equipamentos.filter((item) => item.status === 'MANUTENCAO').length,
  }), [equipamentos]);

  const getStatusBadge = (status) => {
    if (status === 'EM_USO') return { style: styles.badgeEmUso, text: 'Em uso' };
    if (status === 'MANUTENCAO') return { style: styles.badgeManutencao, text: 'Manutencao' };
    return { style: styles.badgeDisponivel, text: 'Disponivel' };
  };

  const resetForm = () => {
    setFormData({ patrimonio: '', tipoEquipamento: '', serial: '', status: 'DISPONIVEL', observacoes: '' });
  };

  const openCreateModal = () => {
    setEditingId(null);
    resetForm();
    setModalOpen(true);
  };

  const openEditModal = async (equipamento) => {
    try {
      setEditingId(equipamento.id);
      setFormData({
        patrimonio: equipamento.patrimonio || '',
        tipoEquipamento: equipamento.tipoEquipamento || '',
        serial: equipamento.serial || '',
        status: equipamento.status || 'DISPONIVEL',
        observacoes: equipamento.observacoes || '',
      });
      setModalOpen(true);
    } catch (requestError) {
      console.error('Erro ao abrir edicao:', requestError);
      setError('Erro ao abrir edicao de equipamento.');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setIsSubmitting(true);
      setError(null);
      const payload = {
        patrimonio: formData.patrimonio,
        tipoEquipamento: formData.tipoEquipamento,
        serial: formData.serial || undefined,
        status: formData.status,
        observacoes: formData.observacoes || undefined,
      };

      if (editingId) {
        await equipamentosService.update(editingId, payload);
        setSuccess('Equipamento atualizado com sucesso.');
      } else {
        await equipamentosService.create(payload);
        setSuccess('Equipamento criado com sucesso.');
      }

      setModalOpen(false);
      setEditingId(null);
      resetForm();
      await fetchEquipamentos();
    } catch (requestError) {
      console.error('Erro ao salvar equipamento:', requestError);
      setError('Erro ao salvar equipamento.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div style={styles.loading}>Carregando equipamentos...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Equipamentos</h1>
        <button style={styles.button} onClick={openCreateModal}>Novo Equipamento</button>
      </div>

      {success && <div style={styles.success}>{success}</div>}
      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.stats}>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{stats.total}</div>
          <div style={styles.statLabel}>Total de Equipamentos</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statValue, color: '#1877f2' }}>{stats.emUso}</div>
          <div style={styles.statLabel}>Em Uso</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statValue, color: '#00a76f' }}>{stats.disponiveis}</div>
          <div style={styles.statLabel}>Disponiveis</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statValue, color: '#B76E00' }}>{stats.manutencao}</div>
          <div style={styles.statLabel}>Manutencao</div>
        </div>
      </div>

      <table style={styles.table}>
        <thead style={styles.tableHeader}>
          <tr>
            <th style={styles.th}>Patrimonio</th>
            <th style={styles.th}>Tipo</th>
            <th style={styles.th}>Serial</th>
            <th style={styles.th}>Vendedor</th>
            <th style={styles.th}>Cidade</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Acoes</th>
          </tr>
        </thead>
        <tbody>
          {equipamentos.length === 0 ? (
            <tr>
              <td colSpan="7" style={styles.emptyState}>Nenhum equipamento cadastrado.</td>
            </tr>
          ) : (
            equipamentos.map((equipamento) => {
              const status = getStatusBadge(equipamento.status);
              return (
                <tr key={equipamento.id}>
                  <td style={styles.td}>{equipamento.patrimonio}</td>
                  <td style={styles.td}>{equipamento.tipoEquipamento}</td>
                  <td style={styles.td}>{equipamento.serial || '-'}</td>
                  <td style={styles.td}>{equipamento.vendedor || '-'}</td>
                  <td style={styles.td}>{equipamento.cidade || '-'}</td>
                  <td style={styles.td}>
                    <span style={{ ...styles.badge, ...status.style }}>{status.text}</span>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.actions}>
                      <button style={styles.actionButton} onClick={() => openEditModal(equipamento)}>
                        Editar
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {modalOpen && (
        <div style={styles.modalOverlay} onClick={() => setModalOpen(false)}>
          <div style={styles.modal} onClick={(event) => event.stopPropagation()}>
            <h2 style={styles.modalTitle}>{editingId ? 'Editar Equipamento' : 'Novo Equipamento'}</h2>
            <form onSubmit={handleSubmit}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Patrimonio *</label>
                <input style={styles.input} type="text" value={formData.patrimonio} onChange={(event) => setFormData({ ...formData, patrimonio: event.target.value })} required />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Tipo *</label>
                <input style={styles.input} type="text" value={formData.tipoEquipamento} onChange={(event) => setFormData({ ...formData, tipoEquipamento: event.target.value })} required />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Serial</label>
                <input style={styles.input} type="text" value={formData.serial} onChange={(event) => setFormData({ ...formData, serial: event.target.value })} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Status</label>
                <select style={styles.select} value={formData.status} onChange={(event) => setFormData({ ...formData, status: event.target.value })}>
                  {statusOptions.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Observacao</label>
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
