import { useState, useEffect } from 'react';
import { equipamentosService } from '../services/api';

const styles = {  container: { padding: '0' },
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
  stats: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' },
  statCard: { backgroundColor: '#23272a', borderRadius: '12px', padding: '20px', boxShadow: '0 0 2px 0 rgba(255, 255, 255, 0.2), 0 12px 24px -4px rgba(20, 20, 20, 0.12)' },
  statValue: { fontSize: '24px', fontWeight: 700, color: '#f4f6f8' },
  statLabel: { fontSize: '14px', color: '#b0b3b8', marginTop: '4px' },
};

export default function EquipamentosPage() {
  const [equipamentos, setEquipamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { fetchEquipamentos(); }, []);

  const fetchEquipamentos = async () => {
    try {
      setLoading(true);
      const response = await equipamentosService.getAll();
      // Garante que equipamentos seja sempre um array
      setEquipamentos(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError('Erro ao carregar equipamentos.');
      setEquipamentos([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles_map = {
      DISPONIVEL: { style: styles.badgeDisponivel, text: 'Disponivel' },
      EM_USO: { style: styles.badgeEmUso, text: 'Em Uso' },
      MANUTENCAO: { style: styles.badgeManutencao, text: 'Manutencao' },
    };
    return styles_map[status] || { style: styles.badgeDisponivel, text: status };
  };

  const stats = {
    total: equipamentos.length,
    emUso: equipamentos.filter(e => e.status === 'EM_USO').length,
    disponiveis: equipamentos.filter(e => e.status === 'DISPONIVEL').length,
    manutencao: equipamentos.filter(e => e.status === 'MANUTENCAO').length,
  };

  if (loading) return <div style={styles.loading}>Carregando equipamentos...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Equipamentos</h1>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.stats}>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{stats.total}</div>
          <div style={styles.statLabel}>Total de Equipamentos</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statValue, color: '#1877F2' }}>{stats.emUso}</div>
          <div style={styles.statLabel}>Em Uso</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statValue, color: '#00a76f' }}>{stats.disponiveis}</div>
          <div style={styles.statLabel}>Disponiveis</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statValue, color: '#B76E00' }}>{stats.manutencao}</div>
          <div style={styles.statLabel}>Em Manutencao</div>
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
          </tr>
        </thead>
        <tbody>
          {equipamentos.length === 0 ? (
            <tr><td colSpan="6" style={styles.emptyState}>Nenhum equipamento cadastrado.</td></tr>
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
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
