import { useState, useEffect } from 'react';
import { fluxoCaixaService } from '../services/api';

const styles = {
  container: { padding: '0' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  title: { fontSize: '24px', fontWeight: 700, color: '#ffffff' },
  buttonGroup: { display: 'flex', gap: '12px' },
  button: { backgroundColor: '#00a76f', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' },
  buttonSecondary: { backgroundColor: '#1877F2', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' },
  table: { width: '100%', backgroundColor: 'rgb(35, 39, 42)', borderRadius: '16px', boxShadow: '0 0 2px 0 rgba(145, 158, 171, 0.2), 0 12px 24px -4px rgba(145, 158, 171, 0.12)', overflow: 'hidden' },
  tableHeader: { backgroundColor: 'rgb(35, 39, 42)' },
  th: { padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: 600, color: '#ffffff', borderBottom: '1px solid rgba(145, 158, 171, 0.2)' },
  td: { padding: '16px', fontSize: '14px', color: '#ffffff', borderBottom: '1px solid rgba(145, 158, 171, 0.08)' },
  badge: { padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 600 },
  badgeEntrada: { backgroundColor: 'rgba(0, 167, 111, 0.16)', color: '#00a76f' },
  badgeSaida: { backgroundColor: 'rgba(255, 86, 48, 0.16)', color: '#ff5630' },
  badgePendente: { backgroundColor: 'rgba(255, 171, 0, 0.16)', color: '#B76E00' },
  badgeEfetivado: { backgroundColor: 'rgba(0, 167, 111, 0.16)', color: '#00a76f' },
  loading: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px', color: '#637381' },
  error: { backgroundColor: '#fff5f5', color: '#b71c1c', padding: '16px', borderRadius: '8px', marginBottom: '24px' },
  emptyState: { textAlign: 'center', padding: '48px', color: '#637381' },
  valorEntrada: { color: '#00a76f', fontWeight: 600 },
  valorSaida: { color: '#ff5630', fontWeight: 600 },
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

export default function FluxoCaixaPage() {
  const [lancamentos, setLancamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [tipoLancamento, setTipoLancamento] = useState('ENTRADA');
  const [formData, setFormData] = useState({ descricao: '', valor: '', dataLancamento: '', contaId: 1 });

  useEffect(() => { fetchLancamentos(); }, []);

  const fetchLancamentos = async () => {
    try {
      setLoading(true);
      const response = await fluxoCaixaService.getAll({ page: 0, size: 20 });
      setLancamentos(response.data.content || response.data);
    } catch (err) {
      setError('Erro ao carregar fluxo de caixa.');
      setLancamentos([
        { id: 1, tipo: 'ENTRADA', descricao: 'Venda de ingressos Lote 1', valor: 45000, dataLancamento: '2025-03-01', contaNome: 'Caixa Principal', status: 'EFETIVADO' },
        { id: 2, tipo: 'SAIDA', descricao: 'Pagamento fornecedor', valor: 15000, dataLancamento: '2025-03-05', contaNome: 'Conta Corrente', status: 'EFETIVADO' },
        { id: 3, tipo: 'ENTRADA', descricao: 'Patrocinio Empresa X', valor: 25000, dataLancamento: '2025-03-10', contaNome: 'Conta Corrente', status: 'PENDENTE' },
        { id: 4, tipo: 'SAIDA', descricao: 'Aluguel espaco', valor: 8000, dataLancamento: '2025-03-15', contaNome: 'Caixa Principal', status: 'EFETIVADO' },
        { id: 5, tipo: 'ENTRADA', descricao: 'Venda de ingressos Lote 2', valor: 55000, dataLancamento: '2025-03-18', contaNome: 'Caixa Principal', status: 'PENDENTE' },
      ]);
    } finally { setLoading(false); }
  };

  const openModal = (tipo) => {
    setTipoLancamento(tipo);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const service = tipoLancamento === 'ENTRADA' ? fluxoCaixaService.registrarEntrada : fluxoCaixaService.registrarSaida;
      await service({ ...formData, valor: parseFloat(formData.valor) });
      setModalOpen(false);
      setFormData({ descricao: '', valor: '', dataLancamento: '', contaId: 1 });
      fetchLancamentos();
    } catch (err) { alert('Erro ao registrar lancamento.'); }
  };

  if (loading) return <div style={styles.loading}>Carregando fluxo de caixa...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Fluxo de Caixa</h1>
        <div style={styles.buttonGroup}>
          <button style={styles.button} onClick={() => openModal('ENTRADA')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" /></svg>
            Nova Entrada
          </button>
          <button style={styles.buttonSecondary} onClick={() => openModal('SAIDA')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13H5v-2h14v2z" /></svg>
            Nova Saida
          </button>
        </div>
      </div>
      {error && <div style={styles.error}>{error}</div>}
      <table style={styles.table}>
        <thead style={styles.tableHeader}>
          <tr>
            <th style={styles.th}>Data</th>
            <th style={styles.th}>Tipo</th>
            <th style={styles.th}>Descricao</th>
            <th style={styles.th}>Conta</th>
            <th style={styles.th}>Valor</th>
            <th style={styles.th}>Status</th>
          </tr>
        </thead>
        <tbody>
          {lancamentos.length === 0 ? (
            <tr><td colSpan="6" style={styles.emptyState}>Nenhum lancamento registrado.</td></tr>
          ) : (
            lancamentos.map((lancamento) => (
              <tr key={lancamento.id}>
                <td style={styles.td}>{formatDate(lancamento.dataLancamento)}</td>
                <td style={styles.td}>
                  <span style={{ ...styles.badge, ...(lancamento.tipo === 'ENTRADA' ? styles.badgeEntrada : styles.badgeSaida) }}>
                    {lancamento.tipo}
                  </span>
                </td>
                <td style={styles.td}>{lancamento.descricao}</td>
                <td style={styles.td}>{lancamento.contaNome || '-'}</td>
                <td style={{ ...styles.td, ...(lancamento.tipo === 'ENTRADA' ? styles.valorEntrada : styles.valorSaida) }}>
                  {lancamento.tipo === 'ENTRADA' ? '+' : '-'} {formatCurrency(lancamento.valor)}
                </td>
                <td style={styles.td}>
                  <span style={{ ...styles.badge, ...(lancamento.status === 'EFETIVADO' ? styles.badgeEfetivado : styles.badgePendente) }}>
                    {lancamento.status}
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
            <h2 style={styles.modalTitle}>Nova {tipoLancamento === 'ENTRADA' ? 'Entrada' : 'Saida'}</h2>
            <form onSubmit={handleSubmit}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Descricao *</label>
                <input style={styles.input} type="text" value={formData.descricao} onChange={(e) => setFormData({ ...formData, descricao: e.target.value })} required />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Valor *</label>
                <input style={styles.input} type="number" step="0.01" value={formData.valor} onChange={(e) => setFormData({ ...formData, valor: e.target.value })} required />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Data *</label>
                <input style={styles.input} type="date" value={formData.dataLancamento} onChange={(e) => setFormData({ ...formData, dataLancamento: e.target.value })} required />
              </div>
              <div style={styles.modalActions}>
                <button type="button" style={styles.buttonCancel} onClick={() => setModalOpen(false)}>Cancelar</button>
                <button type="submit" style={tipoLancamento === 'ENTRADA' ? styles.button : styles.buttonSecondary}>Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
