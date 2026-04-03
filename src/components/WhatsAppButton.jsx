import { normalizePhoneForWhatsApp } from '../services/vendedorService';

const styles = {
  wrapper: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonBase: {
    width: '34px',
    height: '34px',
    borderRadius: '999px',
    border: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    backgroundColor: '#25D366',
    color: '#ffffff',
    textDecoration: 'none',
    transition: 'transform 0.15s ease, filter 0.15s ease',
  },
  buttonDisabled: {
    backgroundColor: 'rgba(99, 115, 129, 0.32)',
    color: '#b0b8c1',
    cursor: 'not-allowed',
    filter: 'grayscale(0.2)',
  },
};

const WhatsAppIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.52 3.48A11.85 11.85 0 0 0 12.08 0C5.54 0 .22 5.3.22 11.82c0 2.08.54 4.1 1.57 5.9L0 24l6.45-1.7a11.8 11.8 0 0 0 5.63 1.44h.01c6.53 0 11.84-5.3 11.84-11.82 0-3.16-1.23-6.13-3.41-8.44zm-8.44 18.26h-.01a9.78 9.78 0 0 1-4.99-1.37l-.36-.21-3.83 1 1.02-3.73-.24-.38a9.83 9.83 0 0 1-1.5-5.22c0-5.42 4.45-9.83 9.92-9.83 2.65 0 5.14 1.03 7.01 2.9a9.77 9.77 0 0 1 2.9 6.94c0 5.42-4.45 9.83-9.92 9.83zm5.39-7.35c-.3-.15-1.78-.88-2.05-.98-.27-.1-.47-.15-.67.15-.2.3-.77.98-.94 1.18-.17.2-.35.23-.65.08-.3-.15-1.26-.46-2.4-1.46-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.53.08-.8.38-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.87 1.22 3.07.15.2 2.1 3.2 5.09 4.49.71.31 1.27.5 1.7.64.72.23 1.37.2 1.89.12.58-.09 1.78-.73 2.03-1.44.25-.71.25-1.32.18-1.44-.08-.12-.28-.2-.58-.35z" />
  </svg>
);

export default function WhatsAppButton({ telefone, mensagem }) {
  const sanitizedPhone = normalizePhoneForWhatsApp(telefone);

  const hasPhone = Boolean(String(telefone || '').trim());
  const isValidPhone = Boolean(sanitizedPhone);
  const encodedMessage = mensagem ? encodeURIComponent(mensagem) : '';

  const whatsappUrl = isValidPhone
    ? `https://wa.me/${sanitizedPhone}${encodedMessage ? `?text=${encodedMessage}` : ''}`
    : '';

  let tooltip = 'Falar no WhatsApp';
  if (!hasPhone) {
    tooltip = 'Telefone nao cadastrado';
  } else if (!isValidPhone) {
    tooltip = 'Telefone invalido';
  }

  if (!isValidPhone) {
    return (
      <span style={styles.wrapper} title={tooltip}>
        <button
          type="button"
          style={{ ...styles.buttonBase, ...styles.buttonDisabled }}
          disabled
          aria-label={tooltip}
        >
          <WhatsAppIcon />
        </button>
      </span>
    );
  }

  return (
    <span style={styles.wrapper} title={tooltip}>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={styles.buttonBase}
        aria-label={tooltip}
      >
        <WhatsAppIcon />
      </a>
    </span>
  );
}
