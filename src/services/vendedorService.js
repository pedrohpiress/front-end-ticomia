const ONLY_DIGITS_REGEX = /\D/g;

const MIN_BR_PHONE_LENGTH = 10;
const MAX_BR_PHONE_LENGTH = 11;
const MIN_INTL_BR_PHONE_LENGTH = 12;
const MAX_INTL_BR_PHONE_LENGTH = 13;

export const getVendedorTelefone = (vendedor) => {
  if (!vendedor) return '';

  const telefone = vendedor.telefone ?? vendedor.whatsapp ?? '';
  return String(telefone || '').trim();
};

export const normalizePhoneForWhatsApp = (telefone) => {
  const digits = String(telefone || '').replace(ONLY_DIGITS_REGEX, '');

  if (!digits) {
    return '';
  }

  if (
    digits.startsWith('55') &&
    digits.length >= MIN_INTL_BR_PHONE_LENGTH &&
    digits.length <= MAX_INTL_BR_PHONE_LENGTH
  ) {
    return digits;
  }

  if (digits.length >= MIN_BR_PHONE_LENGTH && digits.length <= MAX_BR_PHONE_LENGTH) {
    return `55${digits}`;
  }

  return '';
};

export const normalizeVendedorTelefone = (vendedor) => {
  const telefone = getVendedorTelefone(vendedor);
  return {
    ...vendedor,
    telefone,
  };
};
