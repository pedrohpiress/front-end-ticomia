import { useState, useEffect } from 'react';
import { despesasService } from '../services/api';

const styles = {
  container: { padding: '0', backgroundColor: '#23272a', minHeight: '100vh' },
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
  if (!value) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('pt-BR');
};

const getStatusBadge = (status) => {
  const statusStyles = {
    ABERTA: styles.badgeAberta,
    QUITADA: styles.badgeQuitada,
    PARCIAL: styles.badgeParcial,
  };
  return statusStyles[status] || styles.badgeAberta;
};

export default function DespesasPage() {
  const [despesas, setDespesas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    descricao: '',
    valorTotal: '',
    dataVencimento: '',
    observacoes: '',
  });

  useEffect(() => {
    fetchDespesas();
  }, []);

  const fetchDespesas = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await despesasService.getAll();
      setDespesas(response.data);
    } catch (err) {
      console.error('Erro ao carregar despesas:', err);
      setError('Erro ao carregar despesas. Verifique se o backend esta rodando.');
      setDespesas([
        { id: 1, descricao: 'Aluguel do espaco', fornecedorNome: 'Imobiliaria XYZ', categoriaNome: 'Infraestrutura', valorTotal: 15000, valorPago: 15000, status: 'QUITADA', dataVencimento: '2025-03-15' },
        { id: 2, descricao: 'Equipe de seguranca', fornecedorNome: 'Seguranca ABC', categoriaNome: 'Producao', valorTotal: 8000, valorPago: 4000, status: 'PARCIAL', dataVencimento: '2025-03-20' },
        { id: 3, descricao: 'Material de divulgacao', fornecedorNome: 'Grafica Express', categoriaNome: 'Marketing', valorTotal: 3500, valorPago: 0, status: 'ABERTA', dataVencimento: '2025-03-25' },
        { id: 4, descricao: 'Som e iluminacao', fornecedorNome: 'AudioLight', categoriaNome: 'Producao', valorTotal: 12000, valorPago: 0, status: 'ABERTA', dataVencimento: '2025-03-28' },
        { id: 5, descricao: 'Alimentacao equipe', fornecedorNome: 'Buffet Gourmet', categoriaNome: 'Logistica', valorTotal: 5000, valorPago: 5000, status: 'QUITADA', dataVencimento: '2025-03-10' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await despesasService.create({
        ...formData,
        valorTotal: parseFloat(formData.valorTotal),
      });
      setModalOpen(false);
      setFormData({ descricao: '', valorTotal: '', dataVencimento: '', observacoes: '' });
      fetchDespesas();
    } catch (err) {
      console.error('Erro ao criar despesa:', err);
      alert('Erro ao criar despesa. Verifique os dados e tente novamente.');
    }
  };

  if (loading) {
    return <div style={styles.loading}>Carregando despesas...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Despesas</h1>
        <button
          style={styles.button}
          onClick={() => setModalOpen(true)}
          onMouseEnter={(e) => (e.target.style.backgroundColor = '#007867')}
          onMouseLeave={(e) => (e.target.style.backgroundColor = '#00a76f')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
          </svg>
          Nova Despesa
        </button>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      <table style={styles.table}>
        <thead style={styles.tableHeader}>
          <tr>
            <th style={styles.th}>Descricao</th>
            <th style={styles.th}>Fornecedor</th>
            <th style={styles.th}>Categoria</th>
            <th style={styles.th}>Valor Total</th>
            <th style={styles.th}>Valor Pago</th>
            <th style={styles.th}>Vencimento</th>
            <th style={styles.th}>Status</th>
          </tr>
        </thead>
        <tbody>
          {despesas.length === 0 ? (
            <tr>
              <td colSpan="7" style={styles.emptyState}>
                Nenhuma despesa cadastrada.
              </td>
            </tr>
          ) : (
            despesas.map((despesa) => (
              <tr key={despesa.id}>
                <td style={styles.td}>{despesa.descricao}</td>
                <td style={styles.td}>{despesa.fornecedorNome || '-'}</td>
                <td style={styles.td}>{despesa.categoriaNome || '-'}</td>
                <td style={styles.td}>{formatCurrency(despesa.valorTotal)}</td>
                <td style={styles.td}>{formatCurrency(despesa.valorPago)}</td>
                <td style={styles.td}>{formatDate(despesa.dataVencimento)}</td>
                <td style={styles.td}>
                  <span style={{ ...styles.badge, ...getStatusBadge(despesa.status) }}>
                    {despesa.status}
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
            <h2 style={styles.modalTitle}>Nova Despesa</h2>
            <form onSubmit={handleSubmit}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Descricao *</label>
                <input
                  style={styles.input}
                  type="text"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Valor Total *</label>
                <input
                  style={styles.input}
                  type="number"
                  step="0.01"
                  value={formData.valorTotal}
                  onChange={(e) => setFormData({ ...formData, valorTotal: e.target.value })}
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Data de Vencimento</label>
                <input
                  style={styles.input}
                  type="date"
                  value={formData.dataVencimento}
                  onChange={(e) => setFormData({ ...formData, dataVencimento: e.target.value })}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Observacoes</label>
                <input
                  style={styles.input}
                  type="text"
                  value={formData.observacoes}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                />
              </div>
              <div style={styles.modalActions}>
                <button type="button" style={styles.buttonCancel} onClick={() => setModalOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" style={styles.button}>
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
