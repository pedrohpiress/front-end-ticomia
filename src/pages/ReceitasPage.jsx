import { useState, useEffect } from 'react';
import { receitasService } from '../services/api';

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
  modal: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '24px',
    width: '100%',
    maxWidth: '500px',
    maxHeight: '90vh',
    overflow: 'auto',
  },
  modalTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#212b36',
    marginBottom: '24px',
  },
  formGroup: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: 500,
    color: '#637381',
    marginBottom: '8px',
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    border: '1px solid rgba(145, 158, 171, 0.32)',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  select: {
    width: '100%',
    padding: '12px 14px',
    border: '1px solid rgba(145, 158, 171, 0.32)',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    backgroundColor: '#fff',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '24px',
  },
  buttonCancel: {
    backgroundColor: '#ffffff',
    color: '#637381',
    border: '1px solid rgba(145, 158, 171, 0.32)',
    borderRadius: '8px',
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
  },
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

const tiposReceita = [
  { value: 'BILHETERIA', label: 'Bilheteria' },
  { value: 'PATROCINIO', label: 'Patrocinio' },
  { value: 'BAR', label: 'Bar' },
  { value: 'ESTACIONAMENTO', label: 'Estacionamento' },
  { value: 'MERCHANDISING', label: 'Merchandising' },
  { value: 'RENDIMENTO', label: 'Rendimento' },
  { value: 'OUTRAS', label: 'Outras' },
];

export default function ReceitasPage() {
  const [receitas, setReceitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    descricao: '',
    tipo: 'BILHETERIA',
    valor: '',
    dataReceita: '',
    observacoes: '',
  });

  useEffect(() => {
    fetchReceitas();
  }, []);

  const fetchReceitas = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await receitasService.getAll();
      setReceitas(response.data);
    } catch (err) {
      console.error('Erro ao carregar receitas:', err);
      setError('Erro ao carregar receitas. Verifique se o backend esta rodando.');
      setReceitas([
        { id: 1, descricao: 'Vendas Lote 1', tipo: 'BILHETERIA', tipoDescricao: 'Bilheteria', valor: 45000, dataReceita: '2025-03-01', efetivada: true, contaNome: 'Caixa Principal' },
        { id: 2, descricao: 'Patrocinio Empresa ABC', tipo: 'PATROCINIO', tipoDescricao: 'Patrocinio', valor: 25000, dataReceita: '2025-03-05', efetivada: true, contaNome: 'Conta Corrente' },
        { id: 3, descricao: 'Vendas Bar - Evento Teste', tipo: 'BAR', tipoDescricao: 'Bar', valor: 12000, dataReceita: '2025-03-10', efetivada: false, contaNome: 'Caixa Principal' },
        { id: 4, descricao: 'Vendas Lote 2', tipo: 'BILHETERIA', tipoDescricao: 'Bilheteria', valor: 55000, dataReceita: '2025-03-15', efetivada: true, contaNome: 'Conta Corrente' },
        { id: 5, descricao: 'Camisetas e produtos', tipo: 'MERCHANDISING', tipoDescricao: 'Merchandising', valor: 8000, dataReceita: '2025-03-18', efetivada: false, contaNome: 'Caixa Principal' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await receitasService.create({
        ...formData,
        valor: parseFloat(formData.valor),
      });
      setModalOpen(false);
      setFormData({ descricao: '', tipo: 'BILHETERIA', valor: '', dataReceita: '', observacoes: '' });
      fetchReceitas();
    } catch (err) {
      console.error('Erro ao criar receita:', err);
      alert('Erro ao criar receita. Verifique os dados e tente novamente.');
    }
  };

  if (loading) {
    return <div style={styles.loading}>Carregando receitas...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Receitas</h1>
        <button
          style={styles.button}
          onClick={() => setModalOpen(true)}
          onMouseEnter={(e) => (e.target.style.backgroundColor = '#007867')}
          onMouseLeave={(e) => (e.target.style.backgroundColor = '#00a76f')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
          </svg>
          Nova Receita
        </button>
      </div>

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
          </tr>
        </thead>
        <tbody>
          {receitas.length === 0 ? (
            <tr>
              <td colSpan="6" style={styles.emptyState}>
                Nenhuma receita cadastrada.
              </td>
            </tr>
          ) : (
            receitas.map((receita) => (
              <tr key={receita.id}>
                <td style={styles.td}>{receita.descricao}</td>
                <td style={styles.td}>
                  <span style={{ ...styles.badge, ...styles.badgeTipo }}>
                    {receita.tipoDescricao || receita.tipo}
                  </span>
                </td>
                <td style={styles.td}>{formatCurrency(receita.valor)}</td>
                <td style={styles.td}>{formatDate(receita.dataReceita)}</td>
                <td style={styles.td}>{receita.contaNome || '-'}</td>
                <td style={styles.td}>
                  <span
                    style={{
                      ...styles.badge,
                      ...(receita.efetivada ? styles.badgeEfetivada : styles.badgePendente),
                    }}
                  >
                    {receita.efetivada ? 'Efetivada' : 'Pendente'}
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
            <h2 style={styles.modalTitle}>Nova Receita</h2>
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
                <label style={styles.label}>Tipo *</label>
                <select
                  style={styles.select}
                  value={formData.tipo}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                  required
                >
                  {tiposReceita.map((tipo) => (
                    <option key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </option>
                  ))}
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Valor *</label>
                <input
                  style={styles.input}
                  type="number"
                  step="0.01"
                  value={formData.valor}
                  onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Data da Receita *</label>
                <input
                  style={styles.input}
                  type="date"
                  value={formData.dataReceita}
                  onChange={(e) => setFormData({ ...formData, dataReceita: e.target.value })}
                  required
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
