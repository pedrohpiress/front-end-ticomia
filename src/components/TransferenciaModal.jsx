import { useState, useMemo } from 'react';
import { contasService } from '../services/api';
import { formatCurrency, normalizeCurrency, isValidCurrency, stripCurrency } from '../utils/currencyUtils';

const styles = {
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
    maxHeight: '80vh',
    overflow: 'auto',
  },
  title: { fontSize: '18px', fontWeight: 600, color: '#f4f6f8', marginBottom: '16px' },
  subtitle: { fontSize: '12px', color: '#90caf9', marginBottom: '16px', fontStyle: 'italic' },
  formGroup: { marginBottom: '16px' },
  label: { fontSize: '14px', fontWeight: 500, color: '#b0b8c1', marginBottom: '8px', display: 'block' },
  select: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid rgba(99, 115, 129, 0.32)',
    borderRadius: '8px',
    fontSize: '14px',
    backgroundColor: '#181a1b',
    color: '#f4f6f8',
    marginBottom: '12px',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid rgba(99, 115, 129, 0.32)',
    borderRadius: '8px',
    fontSize: '14px',
    backgroundColor: '#181a1b',
    color: '#f4f6f8',
    marginBottom: '12px',
  },
  balanceInfo: {
    backgroundColor: '#1e2326',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '16px',
    color: '#b0b8c1',
    fontSize: '12px',
  },
  error: { color: '#ff6f6f', fontSize: '12px', marginTop: '4px' },
  success: { color: '#7ad9b2', fontSize: '12px', marginTop: '4px' },
  actions: { display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' },
  button: {
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    border: 'none',
  },
  buttonCancel: {
    backgroundColor: '#23272a',
    color: '#b0b8c1',
    border: '1px solid rgba(99, 115, 129, 0.32)',
  },
  buttonTransfer: { backgroundColor: '#00a76f', color: '#fff' },
  buttonDisabled: { opacity: 0.6, cursor: 'not-allowed' },
};

export default function TransferenciaModal({ isOpen, contas, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    contaOrigemId: '',
    contaDestinoId: '',
    valor: '',
    descricao: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const saldoOrigem = useMemo(() => {
    if (!formData.contaOrigemId) return 0;
    const conta = contas.find((c) => c.id === Number(formData.contaOrigemId));
    return Number(conta?.saldoAtual ?? 0);
  }, [formData.contaOrigemId, contas]);

  const isValid = useMemo(() => {
    const valor = Number(formData.valor) || 0;
    return (
      formData.contaOrigemId &&
      formData.contaDestinoId &&
      formData.contaOrigemId !== formData.contaDestinoId &&
      valor > 0 &&
      valor <= saldoOrigem
    );
  }, [formData, saldoOrigem]);

  const validationMessage = useMemo(() => {
    const valor = Number(formData.valor) || 0;

    if (!formData.contaOrigemId) return 'Selecione a conta de origem';
    if (!formData.contaDestinoId) return 'Selecione a conta de destino';
    if (formData.contaOrigemId === formData.contaDestinoId) {
      return 'Conta de origem e destino devem ser diferentes';
    }
    if (valor <= 0) return 'Valor deve ser maior que zero';
    if (valor > saldoOrigem) {
      return `Saldo insuficiente. Saldo disponível: ${formatCurrency(saldoOrigem)}`;
    }
    return null;
  }, [formData, saldoOrigem]);

  const handleSubmit = async () => {
    if (!isValid) {
      setError(validationMessage);
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      setSuccess(null);

      const payload = {
        contaOrigemId: Number(formData.contaOrigemId),
        contaDestinoId: Number(formData.contaDestinoId),
        valor: Number(formData.valor),
      };

      await contasService.transferir(payload);
      setSuccess('Transferência realizada com sucesso!');
      setTimeout(() => {
        setFormData({ contaOrigemId: '', contaDestinoId: '', valor: '', descricao: '' });
        onSuccess?.();
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Erro ao realizar transferência:', err);
      setError(err.response?.data?.message || 'Erro ao realizar transferência. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 style={styles.title}>Transferência Entre Contas</h2>
        <p style={styles.subtitle}>Transfira saldo entre suas contas bancárias</p>

        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}

        <div style={styles.formGroup}>
          <label style={styles.label}>Conta Origem *</label>
          <select
            style={styles.select}
            value={formData.contaOrigemId}
            onChange={(e) =>
              setFormData({ ...formData, contaOrigemId: e.target.value, contaDestinoId: '' })
            }
            disabled={isSubmitting}
          >
            <option value="">Selecionar conta</option>
            {contas.map((conta) => (
              <option key={conta.id} value={conta.id}>
                {conta.nome} - {formatCurrency(conta.saldoAtual)}
              </option>
            ))}
          </select>
          {formData.contaOrigemId && (
            <div style={styles.balanceInfo}>Saldo disponível: {formatCurrency(saldoOrigem)}</div>
          )}
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Conta Destino *</label>
          <select
            style={styles.select}
            value={formData.contaDestinoId}
            onChange={(e) => setFormData({ ...formData, contaDestinoId: e.target.value })}
            disabled={isSubmitting || !formData.contaOrigemId}
          >
            <option value="">Selecionar conta</option>
            {contas
              .filter((c) => c.id !== Number(formData.contaOrigemId))
              .map((conta) => (
                <option key={conta.id} value={conta.id}>
                  {conta.nome} - {formatCurrency(conta.saldoAtual)}
                </option>
              ))}
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Valor *</label>
          <input
            style={styles.input}
            type="text"
            value={formData.valor ? formatCurrency(formData.valor) : ''}
            onChange={(e) => {
              const stripped = stripCurrency(e.target.value);
              const normalized = normalizeCurrency(stripped);
              if (!isNaN(normalized) || stripped === '') {
                setFormData({
                  ...formData,
                  valor: isNaN(normalized) ? '' : normalized,
                });
              }
            }}
            onBlur={(e) => {
              const stripped = stripCurrency(e.target.value);
              const normalized = normalizeCurrency(stripped);
              if (!isNaN(normalized)) {
                setFormData({ ...formData, valor: normalized });
              }
            }}
            placeholder="R$ 0,00"
            disabled={isSubmitting}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Descrição (opcional)</label>
          <input
            style={styles.input}
            type="text"
            value={formData.descricao}
            onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
            placeholder="Ex: Transferência para pagamento de fornecedores"
            disabled={isSubmitting}
          />
        </div>

        <div style={styles.actions}>
          <button
            style={{ ...styles.button, ...styles.buttonCancel }}
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            style={{
              ...styles.button,
              ...styles.buttonTransfer,
              ...(!isValid || isSubmitting ? styles.buttonDisabled : null),
            }}
            onClick={handleSubmit}
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? 'Processando...' : 'Confirmar Transferência'}
          </button>
        </div>
      </div>
    </div>
  );
}
