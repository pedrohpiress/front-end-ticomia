import { useState, useEffect } from 'react';
import { lotesService } from '../services/api';

const styles = {
  container: { padding: '0' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  title: { fontSize: '24px', fontWeight: 700, color: '#ffffff' },
  button: { backgroundColor: '#00a76f', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' },
  table: { width: '100%', backgroundColor: 'rgb(35, 39, 42)', borderRadius: '16px', boxShadow: '0 0 2px 0 rgba(145, 158, 171, 0.2), 0 12px 24px -4px rgba(145, 158, 171, 0.12)', overflow: 'hidden' },
  tableHeader: { backgroundColor: 'rgb(35, 39, 42)' },
  th: { padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: 600, color: '#ffffff', borderBottom: '1px solid rgba(145, 158, 171, 0.2)' },
  td: { padding: '16px', fontSize: '14px', color: '#ffffff', borderBottom: '1px solid rgba(145, 158, 171, 0.08)' },
  badge: { padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 600 },
  badgeAtivo: { backgroundColor: 'rgba(0, 167, 111, 0.16)', color: '#00a76f' },
  badgeEsgotado: { backgroundColor: 'rgba(255, 86, 48, 0.16)', color: '#ff5630' },
  badgeInativo: { backgroundColor: 'rgba(145, 158, 171, 0.16)', color: '#637381' },
  loading: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px', color: '#637381' },
  error: { backgroundColor: '#fff5f5', color: '#b71c1c', padding: '16px', borderRadius: '8px', marginBottom: '24px' },
  emptyState: { textAlign: 'center', padding: '48px', color: '#637381' },
  progressBar: { width: '100%', height: '8px', backgroundColor: 'rgba(145, 158, 171, 0.16)', borderRadius: '4px', overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#00a76f', borderRadius: '4px' },
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

const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('pt-BR');
};

export default function LotesPage() {
  const [lotes, setLotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ nome: '', valor: '', quantidade: '', dataInicio: '', dataFim: '', eventoId: 1 });

  useEffect(() => { fetchLotes(); }, []);

  const fetchLotes = async () => {
    try {
      setLoading(true);
      const response = await lotesService.getAll();
      setLotes(response.data);
    } catch (err) {
      setError('Erro ao carregar lotes.');
      setLotes([
        { id: 1, nome: 'Lote 1 - Promocional', nomeEvento: 'Festival de Verao 2025', valor: 50, quantidade: 500, quantidadeVendida: 500, quantidadeDisponivel: 0, dataInicio: '2025-01-15', dataFim: '2025-02-15', ativo: false, vendaAtiva: false, esgotado: true },
        { id: 2, nome: 'Lote 2 - Regular', nomeEvento: 'Festival de Verao 2025', valor: 80, quantidade: 1000, quantidadeVendida: 750, quantidadeDisponivel: 250, dataInicio: '2025-02-16', dataFim: '2025-04-15', ativo: true, vendaAtiva: true, esgotado: false },
        { id: 3, nome: 'Lote 3 - Final', nomeEvento: 'Festival de Verao 2025', valor: 120, quantidade: 500, quantidadeVendida: 0, quantidadeDisponivel: 500, dataInicio: '2025-04-16', dataFim: '2025-06-14', ativo: true, vendaAtiva: false, esgotado: false },
        { id: 4, nome: 'VIP', nomeEvento: 'Festival de Verao 2025', valor: 250, quantidade: 200, quantidadeVendida: 85, quantidadeDisponivel: 115, dataInicio: '2025-01-15', dataFim: '2025-06-14', ativo: true, vendaAtiva: true, esgotado: false },
      ]);
    } finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await lotesService.create({ ...formData, valor: parseFloat(formData.valor), quantidade: parseInt(formData.quantidade) });
      setModalOpen(false);
      setFormData({ nome: '', valor: '', quantidade: '', dataInicio: '', dataFim: '', eventoId: 1 });
      fetchLotes();
    } catch (err) { alert('Erro ao criar lote.'); }
  };

  const getStatusBadge = (lote) => {
    if (lote.esgotado) return { style: styles.badgeEsgotado, text: 'Esgotado' };
    if (!lote.ativo) return { style: styles.badgeInativo, text: 'Inativo' };
    if (lote.vendaAtiva) return { style: styles.badgeAtivo, text: 'Venda Ativa' };
    return { style: styles.badgeInativo, text: 'Aguardando' };
  };

  if (loading) return <div style={styles.loading}>Carregando lotes...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Lotes de Ingresso</h1>
        <button style={styles.button} onClick={() => setModalOpen(true)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" /></svg>
          Novo Lote
        </button>
      </div>
      {error && <div style={styles.error}>{error}</div>}
      <table style={styles.table}>
        <thead style={styles.tableHeader}>
          <tr>
            <th style={styles.th}>Nome</th>
            <th style={styles.th}>Evento</th>
            <th style={styles.th}>Valor</th>
            <th style={styles.th}>Vendidos/Total</th>
            <th style={styles.th}>Progresso</th>
            <th style={styles.th}>Periodo</th>
            <th style={styles.th}>Status</th>
          </tr>
        </thead>
        <tbody>
          {lotes.length === 0 ? (
            <tr><td colSpan="7" style={styles.emptyState}>Nenhum lote cadastrado.</td></tr>
          ) : (
            lotes.map((lote) => {
              const percentual = (lote.quantidadeVendida / lote.quantidade) * 100;
              const status = getStatusBadge(lote);
              return (
                <tr key={lote.id}>
                  <td style={styles.td}>{lote.nome}</td>
                  <td style={styles.td}>{lote.nomeEvento || '-'}</td>
                  <td style={styles.td}>{formatCurrency(lote.valor)}</td>
                  <td style={styles.td}>{lote.quantidadeVendida} / {lote.quantidade}</td>
                  <td style={styles.td}>
                    <div style={styles.progressBar}>
                      <div style={{ ...styles.progressFill, width: `${percentual}%`, backgroundColor: percentual >= 100 ? '#ff5630' : '#00a76f' }} />
                    </div>
                    <small style={{ color: '#637381' }}>{percentual.toFixed(0)}%</small>
                  </td>
                  <td style={styles.td}>{formatDate(lote.dataInicio)} - {formatDate(lote.dataFim)}</td>
                  <td style={styles.td}>
                    <span style={{ ...styles.badge, ...status.style }}>{status.text}</span>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {modalOpen && (
        <div style={styles.modalOverlay} onClick={() => setModalOpen(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>Novo Lote</h2>
            <form onSubmit={handleSubmit}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Nome *</label>
                <input style={styles.input} type="text" value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} required />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Valor *</label>
                <input style={styles.input} type="number" step="0.01" value={formData.valor} onChange={(e) => setFormData({ ...formData, valor: e.target.value })} required />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Quantidade *</label>
                <input style={styles.input} type="number" value={formData.quantidade} onChange={(e) => setFormData({ ...formData, quantidade: e.target.value })} required />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Data Inicio *</label>
                <input style={styles.input} type="date" value={formData.dataInicio} onChange={(e) => setFormData({ ...formData, dataInicio: e.target.value })} required />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Data Fim *</label>
                <input style={styles.input} type="date" value={formData.dataFim} onChange={(e) => setFormData({ ...formData, dataFim: e.target.value })} required />
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
