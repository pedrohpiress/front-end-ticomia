/**
 * Utilitário global para formatação e parsing de valores monetários
 * Aceita múltiplos formatos: 1000, 1.000, 1000,50, 1000.50, 1.000,50, 1,000.50
 */

/**
 * Normaliza qualquer entrada de valor monetário para número decimal
 * @param {string|number} value - Valor a normalizar
 * @returns {number} Valor normalizado ou NaN se inválido
 *
 * Exemplos:
 * '1.000,50' → 1000.50
 * '1,000.50' → 1000.50
 * '1000'     → 1000
 * '1000,50'  → 1000.50
 * '1000.50'  → 1000.50
 * '1.000'    → 1000
 * '1,000'    → 1000
 */
export const normalizeCurrency = (value) => {
  if (value === null || value === undefined || value === '') {
    return NaN;
  }

  // Converter para string e remover espaços
  let str = String(value).trim();

  if (str === '') {
    return NaN;
  }

  // Contar ocorrências de vírgula e ponto
  const commCount = (str.match(/,/g) || []).length;
  const dotCount = (str.match(/\./g) || []).length;

  // Se não há separadores, é só um número
  if (commCount === 0 && dotCount === 0) {
    const result = parseFloat(str);
    return isNaN(result) ? NaN : result;
  }

  // Se há apenas vírgula
  if (commCount > 0 && dotCount === 0) {
    // Se há apenas uma vírgula, é decimal
    if (commCount === 1) {
      // Verificar se está no final (vírgula decimal)
      const parts = str.split(',');
      // Se a parte após vírgula tem 1-2 dígitos, é decimal
      if (parts[1].length <= 2) {
        str = str.replace('.', '').replace(',', '.');
      } else {
        // Senão é milhar (usar brasileiro: 1.000 com ponto)
        str = str.replace(',', '');
      }
    } else {
      // Múltiplas vírgulas - usar a última como decimal
      const lastCommaIndex = str.lastIndexOf(',');
      str = str.substring(0, lastCommaIndex).replace(/,/g, '') + '.' + str.substring(lastCommaIndex + 1);
    }
  }
  // Se há apenas ponto
  else if (dotCount > 0 && commCount === 0) {
    // Se há apenas um ponto
    if (dotCount === 1) {
      // Verificar se está no final (ponto decimal)
      const parts = str.split('.');
      // Se a parte após ponto tem 1-2 dígitos, é decimal
      if (parts[1].length <= 2) {
        // Já está no formato correto (ponto decimal)
      } else {
        // Senão é milhar - remover ponto
        str = str.replace(/\./g, '');
      }
    } else {
      // Múltiplos pontos - usar o último como decimal
      const lastDotIndex = str.lastIndexOf('.');
      str = str.substring(0, lastDotIndex).replace(/\./g, '') + '.' + str.substring(lastDotIndex + 1);
    }
  }
  // Se há ambos (vírgula e ponto)
  else if (commCount > 0 && dotCount > 0) {
    const lastDot = str.lastIndexOf('.');
    const lastComma = str.lastIndexOf(',');

    // Qual vem por último?
    if (lastDot > lastComma) {
      // Ponto é decimal: remover vírgulas (milhares)
      str = str.replace(/,/g, '');
    } else {
      // Vírgula é decimal: remover pontos (milhares) e substituir vírgula por ponto
      str = str.replace(/\./g, '').replace(',', '.');
    }
  }

  const result = parseFloat(str);
  return isNaN(result) ? NaN : result;
};

/**
 * Formata um número para exibição em formato monetário brasileiro
 * @param {number|string} value - Valor a formatar
 * @returns {string} Valor formatado como 'R$ 1.000,50'
 */
export const formatCurrency = (value) => {
  try {
    const num = typeof value === 'string' ? normalizeCurrency(value) : Number(value);

    if (isNaN(num)) {
      return 'R$ 0,00';
    }

    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  } catch (error) {
    console.warn('Erro ao formatar moeda:', error);
    return 'R$ 0,00';
  }
};

/**
 * Valida se um valor é uma moeda válida
 * @param {string|number} value - Valor a validar
 * @returns {boolean} true se é válido, false caso contrário
 */
export const isValidCurrency = (value) => {
  if (value === null || value === undefined || value === '') {
    return false;
  }

  const normalized = normalizeCurrency(value);
  return !isNaN(normalized) && normalized >= 0;
};

/**
 * Parse com validação - lança erro se inválido
 * @param {string|number} value - Valor a fazer parse
 * @returns {number} Valor parseado
 * @throws {Error} Se o valor não é uma moeda válida
 */
export const parseCurrency = (value) => {
  if (!isValidCurrency(value)) {
    throw new Error(`Valor inválido: ${value}`);
  }

  return normalizeCurrency(value);
};

/**
 * Formata valor mantendo a entrada do usuário enquanto digita
 * Usado em onChange de inputs
 * @param {string} input - Valor digitado pelo usuário
 * @returns {string} Valor formatado
 */
export const formatCurrencyInput = (input) => {
  if (!input) return '';

  // Normalizar e depois formatar
  const normalized = normalizeCurrency(input);
  if (isNaN(normalized)) {
    return input; // Retornar original se não conseguir normalizar
  }

  return formatCurrency(normalized);
};

/**
 * Remove formatação de um valor
 * @param {string} value - Valor formatado
 * @returns {string} Valor limpo
 */
export const stripCurrency = (value) => {
  if (!value) return '';
  return String(value).replace(/[^\d,.-]/g, '');
};
