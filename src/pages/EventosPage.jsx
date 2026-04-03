import { useState, useEffect } from 'react';
import { eventosService } from '../services/api';

const styles = {
  container: { padding: '0' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  title: { fontSize: '24px', fontWeight: 700, color: '#ffffff' },
  button: { backgroundColor: '#00a76f', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' },
  table: { width: '100%', backgroundColor: 'rgb(35, 39, 42)', borderRadius: '16px', boxShadow: '0 0 2px 0 rgba(145, 158, 171, 0.2), 0 12px 24px -4px rgba(145, 158, 171, 0.12)', overflow: 'hidden' },
  tableHeader: { backgroundColor: 'rgb(35, 39, 42)' },
  th: { padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: 600, color: '#637381', borderBottom: '1px solid rgba(145, 158, 171, 0.2)' },
  td: { padding: '16px', fontSize: '14px', color: '#fefeff', borderBottom: '1px solid rgba(145, 158, 171, 0.08)' },
  badge: { padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 600 },
  badgeActive: { backgroundColor: 'rgba(0, 167, 111, 0.16)', color: '#00a76f' },
  badgeInactive: { backgroundColor: 'rgba(255, 86, 48, 0.16)', color: '#ff5630' },
  loading: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px', color: '#637381' },
  error: { backgroundColor: '#fff5f5', color: '#b71c1c', padding: '16px', borderRadius: '8px', marginBottom: '24px' },
  emptyState: { textAlign: 'center', padding: '48px', color: '#637381' },
  success: { backgroundColor: '#0f2f23', color: '#2fd18b', padding: '16px', borderRadius: '8px', marginBottom: '24px' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { backgroundColor: '#ffffff', borderRadius: '16px', padding: '24px', width: '100%', maxWidth: '500px' },
  modalTitle: { fontSize: '18px', fontWeight: 600, color: '#212b36', marginBottom: '24px' },
  formGroup: { marginBottom: '16px' },
  label: { display: 'block', fontSize: '14px', fontWeight: 500, color: '#637381', marginBottom: '8px' },
  input: { width: '100%', padding: '12px 14px', border: '1px solid rgba(145, 158, 171, 0.32)', borderRadius: '8px', fontSize: '14px', outline: 'none' },
  modalActions: { display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' },
  buttonCancel: { backgroundColor: '#ffffff', color: '#637381', border: '1px solid rgba(145, 158, 171, 0.32)', borderRadius: '8px', padding: '10px 20px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' },
  actions: { display: 'flex', gap: '8px' },
  actionButton: { border: '1px solid rgba(145, 158, 171, 0.32)', borderRadius: '6px', padding: '6px 10px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', backgroundColor: '#ffffff', color: '#212b36' },
  actionEdit: { color: '#1877F2' },
  actionDisabled: { opacity: 0.6, cursor: 'not-allowed' },
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('pt-BR');
};

export default function EventosPage() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ nome: '', descricao: '', dataEvento: '', local: '' });

  useEffect(() => { fetchEventos(); }, []);

  const fetchEventos = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      const response = await eventosService.getAll();
      setEventos(response.data);
    } catch (err) {
      setError('Erro ao carregar eventos.');
      setEventos([
        { id: 1, nome: 'Festival de Verao 2025', descricao: 'Grande festival de musica', dataEvento: '2025-06-15', horaInicio: '18:00', local: 'Arena Central', ativo: true, diasRestantes: 81 },
        { id: 2, nome: 'Show de Inverno', descricao: 'Show especial de inverno', dataEvento: '2025-07-20', horaInicio: '20:00', local: 'Teatro Municipal', ativo: true, diasRestantes: 116 },
        { id: 3, nome: 'Evento Corporativo', descricao: 'Confraternizacao empresarial', dataEvento: '2025-08-10', horaInicio: '19:00', local: 'Hotel Grand', ativo: false, diasRestantes: 137 },
      ]);
    } finally { setLoading(false); }
  };

  const resetForm = () => {
    setFormData({ nome: '', descricao: '', dataEvento: '', local: '' });
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
      const response = await eventosService.getById(id);
      const data = response.data || {};
      setFormData({
        nome: data.nome || '',
        descricao: data.descricao || '',
        dataEvento: data.dataEvento || '',
        local: data.local || '',
      });
    } catch (err) {
      console.error('Erro ao carregar evento:', err);
      setError('Erro ao carregar evento para edicao.');
      setModalOpen(false);
    } finally {
      setModalLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setError(null);
      if (editingId) {
        await eventosService.update(editingId, formData);
        setSuccess('Evento atualizado com sucesso.');
      } else {
        await eventosService.create(formData);
        setSuccess('Evento criado com sucesso.');
      }
      setModalOpen(false);
      setEditingId(null);
      resetForm();
      fetchEventos();
    } catch (err) {
      console.error('Erro ao salvar evento:', err);
      setError('Erro ao salvar evento.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div style={styles.loading}>Carregando eventos...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Eventos</h1>
        <button style={styles.button} onClick={openCreateModal}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" /></svg>
          Novo Evento
        </button>
      </div>
      {success && <div style={styles.success}>{success}</div>}
      {error && <div style={styles.error}>{error}</div>}
      <table style={styles.table}>
        <thead style={styles.tableHeader}>
          <tr>
            <th style={styles.th}>Nome</th>
            <th style={styles.th}>Descricao</th>
            <th style={styles.th}>Data</th>
            <th style={styles.th}>Hora</th>
            <th style={styles.th}>Local</th>
            <th style={styles.th}>Dias Restantes</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Acoes</th>
          </tr>
        </thead>
        <tbody>
          {eventos.length === 0 ? (
            <tr><td colSpan="8" style={styles.emptyState}>Nenhum evento cadastrado.</td></tr>
          ) : (
            eventos.map((evento) => (
              <tr key={evento.id}>
                <td style={styles.td}>{evento.nome}</td>
                <td style={styles.td}>{evento.descricao || '-'}</td>
                <td style={styles.td}>{formatDate(evento.dataEvento)}</td>
                <td style={styles.td}>{evento.horaInicio || '-'}</td>
                <td style={styles.td}>{evento.local || '-'}</td>
                <td style={styles.td}>{evento.diasRestantes} dias</td>
                <td style={styles.td}>
                  <span style={{ ...styles.badge, ...(evento.ativo ? styles.badgeActive : styles.badgeInactive) }}>
                    {evento.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td style={styles.td}>
                  <div style={styles.actions}>
                    <button
                      type="button"
                      style={{
                        ...styles.actionButton,
                        ...styles.actionEdit,
                        ...(isSubmitting ? styles.actionDisabled : null),
                      }}
                      onClick={() => openEditModal(evento.id)}
                      disabled={isSubmitting}
                    >
                      Editar
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
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>{editingId ? 'Editar Evento' : 'Novo Evento'}</h2>
            {modalLoading ? (
              <div style={styles.loading}>Carregando...</div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Nome *</label>
                  <input style={styles.input} type="text" value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} required />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Descricao</label>
                  <input style={styles.input} type="text" value={formData.descricao} onChange={(e) => setFormData({ ...formData, descricao: e.target.value })} />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Data do Evento *</label>
                  <input style={styles.input} type="date" value={formData.dataEvento} onChange={(e) => setFormData({ ...formData, dataEvento: e.target.value })} required />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Local</label>
                  <input style={styles.input} type="text" value={formData.local} onChange={(e) => setFormData({ ...formData, local: e.target.value })} />
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
