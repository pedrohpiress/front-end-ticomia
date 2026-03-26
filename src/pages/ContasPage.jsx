import { useState, useEffect } from 'react';
import { contasService } from '../services/api';

const styles = {
  container: { padding: '0', backgroundColor: 'rgb(35, 39, 42)', minHeight: '100vh' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  title: { fontSize: '24px', fontWeight: 700, color: '#f4f6f8' },
  button: { backgroundColor: '#00a76f', color: '#f4f6f8', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 2px 8px 0 rgba(0,0,0,0.08)' },
  table: { width: '100%', backgroundColor: '#23272a', borderRadius: '16px', boxShadow: '0 0 2px 0 rgba(99, 115, 129, 0.18), 0 12px 24px -4px rgba(99, 115, 129, 0.10)', overflow: 'hidden' },
  tableHeader: { backgroundColor: '#23272a' },
  th: { padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: 600, color: '#b0b8c1', borderBottom: '1px solid rgba(99, 115, 129, 0.18)' },
  td: { padding: '16px', fontSize: '14px', color: '#f4f6f8', borderBottom: '1px solid rgba(99, 115, 129, 0.08)' },
  badge: { padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 600 },
  badgeActive: { backgroundColor: 'rgba(0, 167, 111, 0.16)', color: '#00a76f' },
  badgePrincipal: { backgroundColor: 'rgba(24, 119, 242, 0.16)', color: '#5BE49B' },
  loading: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px', color: '#b0b8c1' },
  error: { backgroundColor: '#2d1a1a', color: '#ff6f6f', padding: '16px', borderRadius: '8px', marginBottom: '24px' },
  emptyState: { textAlign: 'center', padding: '48px', color: '#b0b8c1' },
  saldoPositivo: { color: '#00a76f', fontWeight: 600 },
  saldoNegativo: { color: '#ff5630', fontWeight: 600 },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { backgroundColor: '#23272a', borderRadius: '16px', padding: '24px', width: '100%', maxWidth: '500px', boxShadow: '0 4px 32px 0 rgba(0,0,0,0.24)' },
  modalTitle: { fontSize: '18px', fontWeight: 600, color: '#f4f6f8', marginBottom: '24px' },
  formGroup: { marginBottom: '16px' },
  label: { display: 'block', fontSize: '14px', fontWeight: 500, color: '#b0b8c1', marginBottom: '8px' },
  input: { width: '100%', padding: '12px 14px', border: '1px solid rgba(99, 115, 129, 0.32)', borderRadius: '8px', fontSize: '14px', outline: 'none', backgroundColor: '#181a1b', color: '#f4f6f8' },
  select: { width: '100%', padding: '12px 14px', border: '1px solid rgba(99, 115, 129, 0.32)', borderRadius: '8px', fontSize: '14px', outline: 'none', backgroundColor: '#181a1b', color: '#f4f6f8' },
  modalActions: { display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' },
  buttonCancel: { backgroundColor: '#23272a', color: '#b0b8c1', border: '1px solid rgba(99, 115, 129, 0.32)', borderRadius: '8px', padding: '10px 20px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' },
};

const formatCurrency = (value) => {
  if (value === null || value === undefined) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const tiposConta = [
  { value: 'CORRENTE', label: 'Corrente' },
  { value: 'POUPANCA', label: 'Poupanca' },
  { value: 'DIGITAL', label: 'Digital' },
  { value: 'INVESTIMENTO', label: 'Investimento' },
];

export default function ContasPage() {
  const [contas, setContas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ nome: '', tipo: 'CORRENTE', agencia: '', numeroConta: '', bancoId: 1, saldoInicial: '' });

  useEffect(() => { fetchContas(); }, []);

  const fetchContas = async () => {
    try {
      setLoading(true);
      const response = await contasService.getAll();
      setContas(response.data);
    } catch (err) {
      setError('Erro ao carregar contas.');
      setContas([
        { id: 1, nome: 'Caixa Principal', bancoNome: 'Caixa Economica', tipo: 'CORRENTE', agencia: '1234', numeroConta: '12345-6', saldoAtual: 45000, ativa: true, principal: true },
        { id: 2, nome: 'Conta Corrente BB', bancoNome: 'Banco do Brasil', tipo: 'CORRENTE', agencia: '5678', numeroConta: '67890-1', saldoAtual: 32500, ativa: true, principal: false },
        { id: 3, nome: 'Nubank Empresa', bancoNome: 'Nubank', tipo: 'DIGITAL', agencia: '-', numeroConta: '98765432', saldoAtual: 12000, ativa: true, principal: false },
      ]);
    } finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await contasService.create({ ...formData, saldoInicial: parseFloat(formData.saldoInicial) || 0 });
      setModalOpen(false);
      setFormData({ nome: '', tipo: 'CORRENTE', agencia: '', numeroConta: '', bancoId: 1, saldoInicial: '' });
      fetchContas();
    } catch (err) { alert('Erro ao criar conta.'); }
  };

  if (loading) return <div style={styles.loading}>Carregando contas...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Contas Bancarias</h1>
        <button style={styles.button} onClick={() => setModalOpen(true)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" /></svg>
          Nova Conta
        </button>
      </div>
      {error && <div style={styles.error}>{error}</div>}
      <table style={styles.table}>
        <thead style={styles.tableHeader}>
          <tr>
            <th style={styles.th}>Nome</th>
            <th style={styles.th}>Banco</th>
            <th style={styles.th}>Tipo</th>
            <th style={styles.th}>Agencia</th>
            <th style={styles.th}>Conta</th>
            <th style={styles.th}>Saldo Atual</th>
            <th style={styles.th}>Status</th>
          </tr>
        </thead>
        <tbody>
          {contas.length === 0 ? (
            <tr><td colSpan="7" style={styles.emptyState}>Nenhuma conta cadastrada.</td></tr>
          ) : (
            contas.map((conta) => (
              <tr key={conta.id}>
                <td style={styles.td}>
                  {conta.nome}
                  {conta.principal && <span style={{ ...styles.badge, ...styles.badgePrincipal, marginLeft: '8px' }}>Principal</span>}
                </td>
                <td style={styles.td}>{conta.bancoNome || '-'}</td>
                <td style={styles.td}>{conta.tipo}</td>
                <td style={styles.td}>{conta.agencia || '-'}</td>
                <td style={styles.td}>{conta.numeroConta || '-'}</td>
                <td style={{ ...styles.td, ...(conta.saldoAtual >= 0 ? styles.saldoPositivo : styles.saldoNegativo) }}>
                  {formatCurrency(conta.saldoAtual)}
                </td>
                <td style={styles.td}>
                  <span style={{ ...styles.badge, ...styles.badgeActive }}>
                    {conta.ativa ? 'Ativa' : 'Inativa'}
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
            <h2 style={styles.modalTitle}>Nova Conta</h2>
            <form onSubmit={handleSubmit}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Nome *</label>
                <input style={styles.input} type="text" value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} required />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Tipo *</label>
                <select style={styles.select} value={formData.tipo} onChange={(e) => setFormData({ ...formData, tipo: e.target.value })} required>
                  {tiposConta.map((tipo) => (<option key={tipo.value} value={tipo.value}>{tipo.label}</option>))}
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Agencia</label>
                <input style={styles.input} type="text" value={formData.agencia} onChange={(e) => setFormData({ ...formData, agencia: e.target.value })} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Numero da Conta</label>
                <input style={styles.input} type="text" value={formData.numeroConta} onChange={(e) => setFormData({ ...formData, numeroConta: e.target.value })} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Saldo Inicial</label>
                <input style={styles.input} type="number" step="0.01" value={formData.saldoInicial} onChange={(e) => setFormData({ ...formData, saldoInicial: e.target.value })} />
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
