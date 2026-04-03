import { useContext, useEffect, useState } from 'react';
import { CaixaLocalContext } from '../components/CaixaLocalContext';
import { contasService } from '../services/api';

const styles = {
  container: { padding: '0', backgroundColor: '#23272a', minHeight: '100vh' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  title: { fontSize: '24px', fontWeight: 700, color: '#f4f6f8' },
  buttonRow: { display: 'flex', gap: '12px' },
  button: {
    backgroundColor: '#00a76f',
    color: '#f4f6f8',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  buttonSecondary: {
    backgroundColor: '#1877f2',
    color: '#f4f6f8',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  table: {
    width: '100%',
    backgroundColor: '#23272a',
    borderRadius: '16px',
    boxShadow: '0 0 2px 0 rgba(99, 115, 129, 0.18), 0 12px 24px -4px rgba(99, 115, 129, 0.10)',
    overflow: 'hidden',
  },
  tableHeader: { backgroundColor: '#23272a' },
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
  badge: { padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 600 },
  badgeActive: { backgroundColor: 'rgba(0, 167, 111, 0.16)', color: '#00a76f' },
  badgePrincipal: { backgroundColor: 'rgba(24, 119, 242, 0.16)', color: '#5be49b' },
  saldoPositivo: { color: '#00a76f', fontWeight: 600 },
  saldoNegativo: { color: '#ff5630', fontWeight: 600 },
  loading: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px', color: '#b0b8c1' },
  error: { backgroundColor: '#2d1a1a', color: '#ff6f6f', padding: '16px', borderRadius: '8px', marginBottom: '24px' },
  success: { backgroundColor: '#0f2f23', color: '#7ad9b2', padding: '16px', borderRadius: '8px', marginBottom: '24px' },
  emptyState: { textAlign: 'center', padding: '48px', color: '#b0b8c1' },
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
  modal: { backgroundColor: '#23272a', borderRadius: '16px', padding: '24px', width: '100%', maxWidth: '500px' },
  modalTitle: { fontSize: '18px', fontWeight: 600, color: '#f4f6f8', marginBottom: '24px' },
  formGroup: { marginBottom: '16px' },
  label: { display: 'block', fontSize: '14px', fontWeight: 500, color: '#b0b8c1', marginBottom: '8px' },
  input: {
    width: '100%',
    padding: '12px 14px',
    border: '1px solid rgba(99, 115, 129, 0.32)',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    backgroundColor: '#181a1b',
    color: '#f4f6f8',
  },
  select: {
    width: '100%',
    padding: '12px 14px',
    border: '1px solid rgba(99, 115, 129, 0.32)',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    backgroundColor: '#181a1b',
    color: '#f4f6f8',
  },
  modalActions: { display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' },
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

const tiposConta = [
  { value: 'CORRENTE', label: 'Corrente' },
  { value: 'POUPANCA', label: 'Poupanca' },
  { value: 'DIGITAL', label: 'Digital' },
  { value: 'INVESTIMENTO', label: 'Investimento' },
];

const formatCurrency = (value) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value) || 0);

export default function ContasPage() {
  const { saldosPorConta, setSaldoInicialContas, registrarTransferencia } = useContext(CaixaLocalContext);
  const [contas, setContas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [modalContaOpen, setModalContaOpen] = useState(false);
  const [modalTransferenciaOpen, setModalTransferenciaOpen] = useState(false);
  const [formConta, setFormConta] = useState({ nome: '', tipo: 'CORRENTE', agencia: '', numeroConta: '', bancoId: 1, saldoInicial: '' });
  const [formTransferencia, setFormTransferencia] = useState({ contaOrigemId: '', contaDestinoId: '', valor: '', descricao: '' });

  useEffect(() => {
    fetchContas();
  }, []);

  const fetchContas = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await contasService.getAll();
      const nextContas = response.data || [];
      setContas(nextContas);
      setSaldoInicialContas(nextContas);
    } catch (requestError) {
      console.error('Erro ao carregar contas:', requestError);
      setError('Erro ao carregar contas.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateConta = async (event) => {
    event.preventDefault();
    try {
      await contasService.create({
        ...formConta,
        saldoInicial: Number(formConta.saldoInicial) || 0,
      });
      setModalContaOpen(false);
      setFormConta({ nome: '', tipo: 'CORRENTE', agencia: '', numeroConta: '', bancoId: 1, saldoInicial: '' });
      await fetchContas();
      setSuccess('Conta criada com sucesso.');
    } catch (requestError) {
      console.error('Erro ao criar conta:', requestError);
      setError('Erro ao criar conta.');
    }
  };

  const handleTransferencia = async (event) => {
    event.preventDefault();
    try {
      const payload = {
        contaOrigemId: Number(formTransferencia.contaOrigemId),
        contaDestinoId: Number(formTransferencia.contaDestinoId),
        valor: Number(formTransferencia.valor),
        descricao: formTransferencia.descricao || undefined,
      };
      await contasService.transferir(payload);
      registrarTransferencia({
        valor: payload.valor,
        contaOrigemId: payload.contaOrigemId,
        contaDestinoId: payload.contaDestinoId,
        key: `contas-transferencia-${Date.now()}`,
      });
      setModalTransferenciaOpen(false);
      setFormTransferencia({ contaOrigemId: '', contaDestinoId: '', valor: '', descricao: '' });
      await fetchContas();
      setSuccess('Transferencia realizada com sucesso.');
    } catch (requestError) {
      console.error('Erro ao transferir:', requestError);
      setError('Erro ao realizar transferencia.');
    }
  };

  const getSaldoConta = (conta) => {
    if (saldosPorConta[conta.id] === undefined) {
      return Number(conta.saldoAtual || 0);
    }
    return Number(saldosPorConta[conta.id]);
  };

  if (loading) return <div style={styles.loading}>Carregando contas...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Contas Bancarias</h1>
        <div style={styles.buttonRow}>
          <button style={styles.buttonSecondary} onClick={() => setModalTransferenciaOpen(true)}>Transferir</button>
          <button style={styles.button} onClick={() => setModalContaOpen(true)}>Nova Conta</button>
        </div>
      </div>

      {success && <div style={styles.success}>{success}</div>}
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
            <tr>
              <td colSpan="7" style={styles.emptyState}>Nenhuma conta cadastrada.</td>
            </tr>
          ) : (
            contas.map((conta) => {
              const saldoVisual = getSaldoConta(conta);
              return (
                <tr key={conta.id}>
                  <td style={styles.td}>
                    {conta.nome}
                    {conta.principal && <span style={{ ...styles.badge, ...styles.badgePrincipal, marginLeft: '8px' }}>Principal</span>}
                  </td>
                  <td style={styles.td}>{conta.bancoNome || '-'}</td>
                  <td style={styles.td}>{conta.tipo}</td>
                  <td style={styles.td}>{conta.agencia || '-'}</td>
                  <td style={styles.td}>{conta.numeroConta || '-'}</td>
                  <td style={{ ...styles.td, ...(saldoVisual >= 0 ? styles.saldoPositivo : styles.saldoNegativo) }}>
                    {formatCurrency(saldoVisual)}
                  </td>
                  <td style={styles.td}>
                    <span style={{ ...styles.badge, ...styles.badgeActive }}>{conta.ativa ? 'Ativa' : 'Inativa'}</span>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {modalContaOpen && (
        <div style={styles.modalOverlay} onClick={() => setModalContaOpen(false)}>
          <div style={styles.modal} onClick={(event) => event.stopPropagation()}>
            <h2 style={styles.modalTitle}>Nova Conta</h2>
            <form onSubmit={handleCreateConta}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Nome *</label>
                <input style={styles.input} type="text" value={formConta.nome} onChange={(event) => setFormConta({ ...formConta, nome: event.target.value })} required />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Tipo *</label>
                <select style={styles.select} value={formConta.tipo} onChange={(event) => setFormConta({ ...formConta, tipo: event.target.value })} required>
                  {tiposConta.map((tipo) => (
                    <option key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </option>
                  ))}
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Agencia</label>
                <input style={styles.input} type="text" value={formConta.agencia} onChange={(event) => setFormConta({ ...formConta, agencia: event.target.value })} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Numero da Conta</label>
                <input style={styles.input} type="text" value={formConta.numeroConta} onChange={(event) => setFormConta({ ...formConta, numeroConta: event.target.value })} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Saldo Inicial</label>
                <input style={styles.input} type="number" step="0.01" value={formConta.saldoInicial} onChange={(event) => setFormConta({ ...formConta, saldoInicial: event.target.value })} />
              </div>
              <div style={styles.modalActions}>
                <button type="button" style={styles.buttonCancel} onClick={() => setModalContaOpen(false)}>Cancelar</button>
                <button type="submit" style={styles.button}>Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalTransferenciaOpen && (
        <div style={styles.modalOverlay} onClick={() => setModalTransferenciaOpen(false)}>
          <div style={styles.modal} onClick={(event) => event.stopPropagation()}>
            <h2 style={styles.modalTitle}>Transferencia Entre Contas</h2>
            <form onSubmit={handleTransferencia}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Conta Origem *</label>
                <select style={styles.select} value={formTransferencia.contaOrigemId} onChange={(event) => setFormTransferencia({ ...formTransferencia, contaOrigemId: event.target.value })} required>
                  <option value="">Selecione</option>
                  {contas.map((conta) => (
                    <option key={conta.id} value={conta.id}>
                      {conta.nome}
                    </option>
                  ))}
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Conta Destino *</label>
                <select style={styles.select} value={formTransferencia.contaDestinoId} onChange={(event) => setFormTransferencia({ ...formTransferencia, contaDestinoId: event.target.value })} required>
                  <option value="">Selecione</option>
                  {contas.map((conta) => (
                    <option key={conta.id} value={conta.id}>
                      {conta.nome}
                    </option>
                  ))}
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Valor *</label>
                <input style={styles.input} type="number" step="0.01" value={formTransferencia.valor} onChange={(event) => setFormTransferencia({ ...formTransferencia, valor: event.target.value })} required />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Descricao</label>
                <input style={styles.input} type="text" value={formTransferencia.descricao} onChange={(event) => setFormTransferencia({ ...formTransferencia, descricao: event.target.value })} />
              </div>
              <div style={styles.modalActions}>
                <button type="button" style={styles.buttonCancel} onClick={() => setModalTransferenciaOpen(false)}>Cancelar</button>
                <button type="submit" style={styles.buttonSecondary}>Transferir</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
