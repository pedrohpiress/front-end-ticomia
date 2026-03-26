import { useState, useEffect } from 'react';
import { vendedoresService } from '../services/api';

const styles = {
  container: {
    padding: '0',
    backgroundColor: '#23272a',
    minHeight: '100vh',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 700,
    color: '#f4f6f8',
  },
  button: {
    backgroundColor: '#00a76f',
    color: '#f4f6f8',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'background-color 0.2s',
    boxShadow: '0 2px 8px 0 rgba(0,0,0,0.08)',
  },
  table: {
    width: '100%',
    backgroundColor: '#23272a',
    borderRadius: '16px',
    boxShadow: '0 0 2px 0 rgba(99, 115, 129, 0.18), 0 12px 24px -4px rgba(99, 115, 129, 0.10)',
    overflow: 'hidden',
  },
  tableHeader: {
    backgroundColor: '#23272a',
  },
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
  badge: {
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: 600,
  },
  badgeActive: {
    backgroundColor: 'rgba(0, 167, 111, 0.16)',
    color: '#00a76f',
  },
  badgeInactive: {
    backgroundColor: 'rgba(255, 86, 48, 0.16)',
    color: '#ff5630',
  },
  loading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '200px',
    color: '#b0b8c1',
  },
  error: {
    backgroundColor: '#2d1a1a',
    color: '#ff6f6f',
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '24px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '48px',
    color: '#b0b8c1',
  },
  // Modal styles
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
    maxWidth: '500px',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 4px 32px 0 rgba(0,0,0,0.24)',
  },
  modalTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#f4f6f8',
    marginBottom: '24px',
  },
  formGroup: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: 500,
    color: '#b0b8c1',
    marginBottom: '8px',
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    border: '1px solid rgba(99, 115, 129, 0.32)',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
    backgroundColor: '#181a1b',
    color: '#f4f6f8',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '24px',
  },
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

const formatCurrency = (value) => {
  if (!value) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export default function VendedoresPage() {
  const [vendedores, setVendedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    whatsapp: '',
    tipoVendedorId: 1,
    observacoes: '',
  });

  useEffect(() => {
    fetchVendedores();
  }, []);

  const fetchVendedores = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await vendedoresService.getAll();
      setVendedores(response.data);
    } catch (err) {
      console.error('Erro ao carregar vendedores:', err);
      setError('Erro ao carregar vendedores. Verifique se o backend esta rodando.');
      // Dados mockados para demonstracao
      setVendedores([
        { id: 1, numero: 1, nome: 'Joao Silva', cidade: 'Sao Paulo', tipoVendedor: 'Comissario', whatsapp: '11999999999', ativo: true, totalFaturamento: 25000 },
        { id: 2, numero: 2, nome: 'Maria Santos', cidade: 'Rio de Janeiro', tipoVendedor: 'PDV', whatsapp: '21988888888', ativo: true, totalFaturamento: 22000 },
        { id: 3, numero: 3, nome: 'Pedro Souza', cidade: 'Belo Horizonte', tipoVendedor: 'Comissario', whatsapp: '31977777777', ativo: false, totalFaturamento: 18000 },
        { id: 4, numero: 4, nome: 'Ana Costa', cidade: 'Salvador', tipoVendedor: 'PDV', whatsapp: '71966666666', ativo: true, totalFaturamento: 15000 },
        { id: 5, numero: 5, nome: 'Carlos Lima', cidade: 'Curitiba', tipoVendedor: 'Escritorio', whatsapp: '41955555555', ativo: true, totalFaturamento: 12000 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await vendedoresService.create(formData);
      setModalOpen(false);
      setFormData({ nome: '', whatsapp: '', tipoVendedorId: 1, observacoes: '' });
      fetchVendedores();
    } catch (err) {
      console.error('Erro ao criar vendedor:', err);
      alert('Erro ao criar vendedor. Verifique os dados e tente novamente.');
    }
  };

  if (loading) {
    return <div style={styles.loading}>Carregando vendedores...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Vendedores</h1>
        <button
          style={styles.button}
          onClick={() => setModalOpen(true)}
          onMouseEnter={(e) => (e.target.style.backgroundColor = '#007867')}
          onMouseLeave={(e) => (e.target.style.backgroundColor = '#00a76f')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
          </svg>
          Novo Vendedor
        </button>
      </div>

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
          </tr>
        </thead>
        <tbody>
          {vendedores.length === 0 ? (
            <tr>
              <td colSpan="7" style={styles.emptyState}>
                Nenhum vendedor cadastrado.
              </td>
            </tr>
          ) : (
            vendedores.map((vendedor) => (
              <tr key={vendedor.id}>
                <td style={styles.td}>{vendedor.numero || vendedor.id}</td>
                <td style={styles.td}>{vendedor.nome}</td>
                <td style={styles.td}>{vendedor.cidade || '-'}</td>
                <td style={styles.td}>{vendedor.tipoVendedor || '-'}</td>
                <td style={styles.td}>{vendedor.whatsapp || '-'}</td>
                <td style={styles.td}>{formatCurrency(vendedor.totalFaturamento)}</td>
                <td style={styles.td}>
                  <span
                    style={{
                      ...styles.badge,
                      ...(vendedor.ativo ? styles.badgeActive : styles.badgeInactive),
                    }}
                  >
                    {vendedor.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Modal de Criar Vendedor */}
      {modalOpen && (
        <div style={styles.modalOverlay} onClick={() => setModalOpen(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>Novo Vendedor</h2>
            <form onSubmit={handleSubmit}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Nome *</label>
                <input
                  style={styles.input}
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>WhatsApp</label>
                <input
                  style={styles.input}
                  type="text"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  placeholder="11999999999"
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
                <button
                  type="button"
                  style={styles.buttonCancel}
                  onClick={() => setModalOpen(false)}
                >
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
