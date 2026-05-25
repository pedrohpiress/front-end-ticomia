import { useState, useMemo } from 'react';
import { despesasService } from '../services/api';
import { formatCurrency, normalizeCurrency, isValidCurrency } from '../utils/currencyUtils';

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
    maxWidth: '600px',
    maxHeight: '80vh',
    overflow: 'auto',
  },
  title: { fontSize: '18px', fontWeight: 600, color: '#f4f6f8', marginBottom: '16px' },
  subtitle: { fontSize: '12px', color: '#90caf9', marginBottom: '16px', fontStyle: 'italic' },
  balanceInfo: {
    backgroundColor: '#1e2326',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '16px',
    color: '#b0b8c1',
  },
  label: { fontSize: '14px', fontWeight: 500, color: '#b0b8c1', marginBottom: '8px', marginTop: '12px', display: 'block' },
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
  paymentRow: {
    display: 'flex',
    gap: '12px',
    marginBottom: '12px',
    padding: '12px',
    backgroundColor: '#1e2326',
    borderRadius: '8px',
    alignItems: 'flex-end',
  },
  paymentRowField: { flex: 1, minWidth: 0 },
  fieldLabel: { fontSize: '12px', color: '#90caf9', marginBottom: '4px', display: 'block' },
  removeButton: {
    backgroundColor: '#d32f2f',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    padding: '8px 12px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 600,
  },
  addButton: {
    backgroundColor: '#00a76f',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    padding: '10px 16px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 600,
    marginTop: '12px',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px',
    backgroundColor: '#1e2326',
    borderRadius: '8px',
    marginTop: '16px',
    marginBottom: '16px',
  },
  totalLabel: { color: '#b0b8c1', fontWeight: 600 },
  totalValue: { color: '#f4f6f8', fontWeight: 700, fontSize: '16px' },
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
  buttonPay: { backgroundColor: '#00a76f', color: '#fff' },
  buttonDisabled: { opacity: 0.6, cursor: 'not-allowed' },
};

export default function MultiAccountPaymentModal({ isOpen, despesa, contas, onClose, onSuccess }) {
  const [payments, setPayments] = useState([{ contaId: '', valor: '' }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const saldoRestante = useMemo(() => {
    return Number(despesa?.saldoRestante ?? 0);
  }, [despesa]);

  const totalPagamento = useMemo(() => {
    return payments.reduce((sum, p) => sum + (Number(p.valor) || 0), 0);
  }, [payments]);

  const isValid = useMemo(() => {
    return (
      payments.length > 0 &&
      payments.every((p) => p.contaId && p.valor) &&
      totalPagamento > 0 &&
      totalPagamento <= saldoRestante
    );
  }, [payments, saldoRestante, totalPagamento]);

  const validationMessage = useMemo(() => {
    if (payments.some((p) => !p.contaId)) return 'Todas as contas devem ser selecionadas';
    if (payments.some((p) => !p.valor || Number(p.valor) <= 0)) return 'Todos os valores devem ser maiores que zero';
    if (totalPagamento > saldoRestante) {
      return `Total (${formatCurrency(totalPagamento)}) não pode ser maior que o saldo restante (${formatCurrency(saldoRestante)})`;
    }
    return null;
  }, [payments, saldoRestante, totalPagamento]);

  const handleAddPayment = () => {
    setPayments([...payments, { contaId: '', valor: '' }]);
  };

  const handleRemovePayment = (index) => {
    if (payments.length > 1) {
      setPayments(payments.filter((_, i) => i !== index));
    }
  };

  const handlePaymentChange = (index, field, value) => {
    const updatedPayments = [...payments];
    updatedPayments[index][field] = value;
    setPayments(updatedPayments);
  };

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
        pagamentos: payments.map((p) => ({
          contaId: Number(p.contaId),
          valor: Number(p.valor),
        })),
        dataPagamento: new Date().toISOString().split('T')[0],
        descricaoGeral: `Pagamento múltiplo - ${despesa.descricao}`,
      };

      await despesasService.pagarComMultiplos(despesa.id, payload);
      setSuccess('Pagamento realizado com sucesso!');
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Erro ao processar pagamento múltiplo:', err);
      setError(err.response?.data?.message || 'Erro ao processar pagamento. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 style={styles.title}>Pagamento com Múltiplas Contas</h2>
        <p style={styles.subtitle}>Você pode pagar o valor total ou parcial (irá subtraindo do saldo)</p>

        <div style={styles.balanceInfo}>
          <div>
            <strong>{despesa.descricao}</strong>
          </div>
          <div>Saldo Restante: {formatCurrency(saldoRestante)}</div>
        </div>

        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}

        <div>
          <label style={styles.label}>Pagamentos</label>
          {payments.map((payment, index) => (
            <div key={index} style={styles.paymentRow}>
              <div style={styles.paymentRowField}>
                <span style={styles.fieldLabel}>Conta</span>
                <select
                  style={styles.select}
                  value={payment.contaId}
                  onChange={(e) => handlePaymentChange(index, 'contaId', e.target.value)}
                  disabled={isSubmitting}
                >
                  <option value="">Selecionar conta</option>
                  {contas.map((conta) => (
                    <option key={conta.id} value={conta.id}>
                      {conta.nome} - {formatCurrency(conta.saldoAtual)}
                    </option>
                  ))}
                </select>
              </div>
              <div style={styles.paymentRowField}>
                <span style={styles.fieldLabel}>Valor (R$)</span>
                <input
                  type="text"
                  style={styles.input}
                  value={payment.valor ? formatCurrency(payment.valor) : ''}
                  onChange={(e) => {
                    const normalized = normalizeCurrency(e.target.value);
                    if (!isNaN(normalized) || e.target.value === '') {
                      handlePaymentChange(index, 'valor', isNaN(normalized) ? '' : normalized);
                    }
                  }}
                  onBlur={(e) => {
                    const normalized = normalizeCurrency(e.target.value);
                    if (!isNaN(normalized)) {
                      handlePaymentChange(index, 'valor', normalized);
                    }
                  }}
                  placeholder="R$ 0,00"
                  disabled={isSubmitting}
                />
              </div>
              {payments.length > 1 && (
                <button
                  type="button"
                  style={styles.removeButton}
                  onClick={() => handleRemovePayment(index)}
                  disabled={isSubmitting}
                >
                  Remover
                </button>
              )}
            </div>
          ))}
        </div>

        <button style={styles.addButton} onClick={handleAddPayment} disabled={isSubmitting}>
          + Adicionar Conta
        </button>

        <div style={styles.totalRow}>
          <span style={styles.totalLabel}>Total Configurado:</span>
          <span style={styles.totalValue}>{formatCurrency(totalPagamento)}</span>
        </div>

        {totalPagamento > 0 && totalPagamento < saldoRestante && (
          <div style={{ ...styles.balanceInfo, marginBottom: '16px' }}>
            <div style={{ color: '#90caf9', fontSize: '12px' }}>
              Saldo restante após este pagamento: <strong>{formatCurrency(saldoRestante - totalPagamento)}</strong>
            </div>
          </div>
        )}

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
              ...styles.buttonPay,
              ...((!isValid || isSubmitting) && styles.buttonDisabled),
            }}
            onClick={handleSubmit}
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? 'Processando...' : 'Confirmar Pagamento'}
          </button>
        </div>
      </div>
    </div>
  );
}
