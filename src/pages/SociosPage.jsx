import { useContext, useEffect, useMemo, useState } from 'react';
import { CaixaLocalContext } from '../components/CaixaLocalContext';
import { sociosService } from '../services/api';

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
  badgeActive: { backgroundColor: 'rgba(0, 167, 111, 0.16)', color: '#00a76f' },
  badgeInactive: { backgroundColor: 'rgba(255, 86, 48, 0.16)', color: '#ff5630' },
  loading: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px', color: '#637381' },
  error: { backgroundColor: '#fff5f5', color: '#b71c1c', padding: '16px', borderRadius: '8px', marginBottom: '24px' },
  success: { backgroundColor: '#0f2f23', color: '#2fd18b', padding: '16px', borderRadius: '8px', marginBottom: '24px' },
  emptyState: { textAlign: 'center', padding: '48px', color: '#637381' },
  actions: { display: 'flex', gap: '8px' },
  actionButton: { border: '1px solid rgba(145, 158, 171, 0.32)', borderRadius: '6px', padding: '6px 10px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', backgroundColor: '#ffffff', color: '#212b36' },
  actionEdit: { color: '#1877f2' },
  actionDisabled: { opacity: 0.6, cursor: 'not-allowed' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { backgroundColor: '#ffffff', borderRadius: '16px', padding: '24px', width: '100%', maxWidth: '500px' },
  modalTitle: { fontSize: '18px', fontWeight: 600, color: '#212b36', marginBottom: '24px' },
  formGroup: { marginBottom: '16px' },
  label: { display: 'block', fontSize: '14px', fontWeight: 500, color: '#637381', marginBottom: '8px' },
  input: { width: '100%', padding: '12px 14px', border: '1px solid rgba(145, 158, 171, 0.32)', borderRadius: '8px', fontSize: '14px', outline: 'none' },
  modalActions: { display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' },
  buttonCancel: { backgroundColor: '#ffffff', color: '#637381', border: '1px solid rgba(145, 158, 171, 0.32)', borderRadius: '8px', padding: '10px 20px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' },
};

const formatCurrency = (value) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value) || 0);

export default function SociosPage() {
  const { saldoLocal } = useContext(CaixaLocalContext);
  const [socios, setSocios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ nome: '', cpf: '', telefone: '', email: '', percentualParticipacao: '' });

  useEffect(() => {
    fetchSocios();
  }, []);

  const fetchSocios = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await sociosService.getAll();
      setSocios(response.data || []);
    } catch (requestError) {
      console.error('Erro ao carregar socios:', requestError);
      setError('Erro ao carregar socios.');
    } finally {
      setLoading(false);
    }
  };

  const sociosComResumo = useMemo(() => {
    return socios.map((socio) => {
      const percentual = Number(socio.percentualParticipacao || 0);
      const direitoTotal = (saldoLocal * percentual) / 100;
      const recebido = Number(socio.totalRetiradas || 0);
      const faltaReceber = Math.max(direitoTotal - recebido, 0);
      return {
        ...socio,
        direitoTotal,
        recebido,
        faltaReceber,
      };
    });
  }, [socios, saldoLocal]);

  const resetForm = () => {
    setFormData({ nome: '', cpf: '', telefone: '', email: '', percentualParticipacao: '' });
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
      const response = await sociosService.getById(id);
      const data = response.data || {};
      setFormData({
        nome: data.nome || '',
        cpf: data.cpf || '',
        telefone: data.telefone || '',
        email: data.email || '',
        percentualParticipacao:
          data.percentualParticipacao !== undefined && data.percentualParticipacao !== null
            ? String(data.percentualParticipacao)
            : '',
      });
    } catch (requestError) {
      console.error('Erro ao carregar socio:', requestError);
      setError('Erro ao carregar socio para edicao.');
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
      const payload = { ...formData, percentualParticipacao: Number(formData.percentualParticipacao) };

      if (editingId) {
        await sociosService.update(editingId, payload);
        setSuccess('Socio atualizado com sucesso.');
      } else {
        await sociosService.create(payload);
        setSuccess('Socio criado com sucesso.');
      }

      setModalOpen(false);
      setEditingId(null);
      resetForm();
      await fetchSocios();
    } catch (requestError) {
      console.error('Erro ao salvar socio:', requestError);
      setError('Erro ao salvar socio.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div style={styles.loading}>Carregando socios...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Socios</h1>
        <button style={styles.button} onClick={openCreateModal}>Novo Socio</button>
      </div>

      {success && <div style={styles.success}>{success}</div>}
      {error && <div style={styles.error}>{error}</div>}

      <table style={styles.table}>
        <thead style={styles.tableHeader}>
          <tr>
            <th style={styles.th}>Nome</th>
            <th style={styles.th}>Participacao</th>
            <th style={styles.th}>Recebido</th>
            <th style={styles.th}>Falta Receber</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Acoes</th>
          </tr>
        </thead>
        <tbody>
          {sociosComResumo.length === 0 ? (
            <tr>
              <td colSpan="6" style={styles.emptyState}>Nenhum socio cadastrado.</td>
            </tr>
          ) : (
            sociosComResumo.map((socio) => (
              <tr key={socio.id}>
                <td style={styles.td}>{socio.nome}</td>
                <td style={styles.td}>{Number(socio.percentualParticipacao || 0)}%</td>
                <td style={styles.td}>{formatCurrency(socio.recebido)}</td>
                <td style={styles.td}>{formatCurrency(socio.faltaReceber)}</td>
                <td style={styles.td}>
                  <span style={{ ...styles.badge, ...(socio.ativo ? styles.badgeActive : styles.badgeInactive) }}>
                    {socio.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td style={styles.td}>
                  <div style={styles.actions}>
                    <button
                      type="button"
                      style={{ ...styles.actionButton, ...styles.actionEdit, ...(isSubmitting ? styles.actionDisabled : null) }}
                      onClick={() => openEditModal(socio.id)}
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
          <div style={styles.modal} onClick={(event) => event.stopPropagation()}>
            <h2 style={styles.modalTitle}>{editingId ? 'Editar Socio' : 'Novo Socio'}</h2>
            {modalLoading ? (
              <div style={styles.loading}>Carregando...</div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Nome *</label>
                  <input style={styles.input} type="text" value={formData.nome} onChange={(event) => setFormData({ ...formData, nome: event.target.value })} required />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>CPF</label>
                  <input style={styles.input} type="text" value={formData.cpf} onChange={(event) => setFormData({ ...formData, cpf: event.target.value })} />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Telefone</label>
                  <input style={styles.input} type="text" value={formData.telefone} onChange={(event) => setFormData({ ...formData, telefone: event.target.value })} />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Email</label>
                  <input style={styles.input} type="email" value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>% Participacao</label>
                  <input style={styles.input} type="number" step="0.01" max="100" value={formData.percentualParticipacao} onChange={(event) => setFormData({ ...formData, percentualParticipacao: event.target.value })} />
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
