import { useState, useEffect } from 'react';
import { sociosService } from '../services/api';

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
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { backgroundColor: '#ffffff', borderRadius: '16px', padding: '24px', width: '100%', maxWidth: '500px' },
  modalTitle: { fontSize: '18px', fontWeight: 600, color: '#212b36', marginBottom: '24px' },
  formGroup: { marginBottom: '16px' },
  label: { display: 'block', fontSize: '14px', fontWeight: 500, color: '#637381', marginBottom: '8px' },
  input: { width: '100%', padding: '12px 14px', border: '1px solid rgba(145, 158, 171, 0.32)', borderRadius: '8px', fontSize: '14px', outline: 'none' },
  modalActions: { display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' },
  buttonCancel: { backgroundColor: '#ffffff', color: '#637381', border: '1px solid rgba(145, 158, 171, 0.32)', borderRadius: '8px', padding: '10px 20px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' },
};

const formatCurrency = (value) => {
  if (!value) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

export default function SociosPage() {
  const [socios, setSocios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ nome: '', cpf: '', telefone: '', email: '', percentualParticipacao: '' });

  useEffect(() => { fetchSocios(); }, []);

  const fetchSocios = async () => {
    try {
      setLoading(true);
      const response = await sociosService.getAll();
      setSocios(response.data);
    } catch (err) {
      setError('Erro ao carregar socios.');
      setSocios([
        { id: 1, nome: 'Carlos Eduardo', cpf: '123.456.789-00', telefone: '11999999999', email: 'carlos@email.com', percentualParticipacao: 50, ativo: true, totalRetiradas: 25000 },
        { id: 2, nome: 'Maria Fernanda', cpf: '987.654.321-00', telefone: '11988888888', email: 'maria@email.com', percentualParticipacao: 30, ativo: true, totalRetiradas: 15000 },
        { id: 3, nome: 'Roberto Santos', cpf: '456.789.123-00', telefone: '11977777777', email: 'roberto@email.com', percentualParticipacao: 20, ativo: true, totalRetiradas: 10000 },
      ]);
    } finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sociosService.create({ ...formData, percentualParticipacao: parseFloat(formData.percentualParticipacao) });
      setModalOpen(false);
      setFormData({ nome: '', cpf: '', telefone: '', email: '', percentualParticipacao: '' });
      fetchSocios();
    } catch (err) { alert('Erro ao criar socio.'); }
  };

  if (loading) return <div style={styles.loading}>Carregando socios...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Socios</h1>
        <button style={styles.button} onClick={() => setModalOpen(true)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" /></svg>
          Novo Socio
        </button>
      </div>
      {error && <div style={styles.error}>{error}</div>}
      <table style={styles.table}>
        <thead style={styles.tableHeader}>
          <tr>
            <th style={styles.th}>Nome</th>
            <th style={styles.th}>CPF</th>
            <th style={styles.th}>Telefone</th>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>Participacao</th>
            <th style={styles.th}>Retiradas</th>
            <th style={styles.th}>Status</th>
          </tr>
        </thead>
        <tbody>
          {socios.length === 0 ? (
            <tr><td colSpan="7" style={styles.emptyState}>Nenhum socio cadastrado.</td></tr>
          ) : (
            socios.map((socio) => (
              <tr key={socio.id}>
                <td style={styles.td}>{socio.nome}</td>
                <td style={styles.td}>{socio.cpf || '-'}</td>
                <td style={styles.td}>{socio.telefone || '-'}</td>
                <td style={styles.td}>{socio.email || '-'}</td>
                <td style={styles.td}>{socio.percentualParticipacao}%</td>
                <td style={styles.td}>{formatCurrency(socio.totalRetiradas)}</td>
                <td style={styles.td}>
                  <span style={{ ...styles.badge, ...(socio.ativo ? styles.badgeActive : styles.badgeInactive) }}>
                    {socio.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {modalOpen && (
        <div style={styles.modalOverlay} onClick={() => setModalOpen(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>Novo Socio</h2>
            <form onSubmit={handleSubmit}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Nome *</label>
                <input style={styles.input} type="text" value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} required />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>CPF</label>
                <input style={styles.input} type="text" value={formData.cpf} onChange={(e) => setFormData({ ...formData, cpf: e.target.value })} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Telefone</label>
                <input style={styles.input} type="text" value={formData.telefone} onChange={(e) => setFormData({ ...formData, telefone: e.target.value })} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Email</label>
                <input style={styles.input} type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>% Participacao</label>
                <input style={styles.input} type="number" step="0.01" max="100" value={formData.percentualParticipacao} onChange={(e) => setFormData({ ...formData, percentualParticipacao: e.target.value })} />
              </div>
              <div style={styles.modalActions}>
                <button type="button" style={styles.buttonCancel} onClick={() => setModalOpen(false)}>Cancelar</button>
                <button type="submit" style={styles.button}>Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
