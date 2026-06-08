/**
 * Utilitários para formatação e transformação de dados
 */

import { CONFIG } from '../configuracao/config';

/**
 * Formata um valor monetário para Euro
 * @param {number} value - Valor a formatar
 * @param {number} decimals - Número de casas decimais (padrão: 2)
 * @returns {string} Valor formatado com símbolo €
 */
export const formatCurrency = (value, decimals = 2) => {
  if (typeof value !== 'number' || isNaN(value)) return `${CONFIG.CURRENCY_SYMBOL}0.00`;

  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: CONFIG.CURRENCY,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

/**
 * Formata uma data para o formato legível (DD/MM/YYYY)
 * @param {string|Date} date - Data a formatar
 * @returns {string} Data formatada
 */
export const formatDate = (date) => {
  if (!date) return '';

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  return new Intl.DateTimeFormat('pt-PT', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(dateObj);
};

/**
 * Formata uma data para o formato ISO (YYYY-MM-DD)
 * @param {Date} date - Data a formatar
 * @returns {string} Data em formato ISO
 */
export const formatDateISO = (date) => {
  if (!date) return '';

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  return dateObj.toISOString().split('T')[0];
};

/**
 * Formata um mês e ano para exibição
 * @param {number} month - Número do mês (1-12)
 * @param {number} year - Ano
 * @returns {string} Mês e ano formatados
 */
export const formatMonthYear = (month, year) => {
  const date = new Date(year, month - 1);

  return new Intl.DateTimeFormat('pt-PT', {
    month: 'long',
    year: 'numeric',
  })
    .format(date)
    .charAt(0)
    .toUpperCase() + new Intl.DateTimeFormat('pt-PT', {
    month: 'long',
    year: 'numeric',
  })
    .format(date)
    .slice(1);
};

/**
 * Calcula a percentagem de um valor em relação a um total
 * @param {number} value - Valor
 * @param {number} total - Total
 * @returns {number} Percentagem (0-100)
 */
export const calculatePercentage = (value, total) => {
  if (total === 0) return 0;
  return (value / total) * 100;
};

/**
 * Trunca um texto a um número específico de caracteres
 * @param {string} text - Texto a truncar
 * @param {number} maxLength - Comprimento máximo
 * @returns {string} Texto truncado com reticências se necessário
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

/**
 * Valida um endereço de email
 * @param {string} email - Email a validar
 * @returns {boolean} True se válido, False caso contrário
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Calcula juros compostos
 * @param {number} principal - Capital inicial
 * @param {number} rate - Taxa anual (em percentagem)
 * @param {number} months - Número de meses
 * @returns {object} Objeto com montante final e juros ganhos
 */
export const calculateCompoundInterest = (principal, rate, months) => {
  if (principal <= 0 || rate < 0 || months <= 0) {
    return { finalAmount: principal, interest: 0 };
  }

  const monthlyRate = rate / 12 / 100;
  const finalAmount = principal * Math.pow(1 + monthlyRate, months);
  const interest = finalAmount - principal;

  return {
    finalAmount: parseFloat(finalAmount.toFixed(2)),
    interest: parseFloat(interest.toFixed(2)),
    monthlyBreakdown: generateMonthlyBreakdown(principal, monthlyRate, months),
  };
};

/**
 * Gera um resumo mês a mês para juros compostos
 * @private
 */
function generateMonthlyBreakdown(principal, monthlyRate, months) {
  const data = [];
  let currentAmount = principal;

  for (let i = 0; i <= months; i++) {
    data.push({
      month: i,
      amount: parseFloat(currentAmount.toFixed(2)),
      interest: i === 0 ? 0 : parseFloat((currentAmount - principal).toFixed(2)),
    });

    if (i < months) {
      currentAmount *= 1 + monthlyRate;
    }
  }

  return data;
}

/**
 * Agrupa um array de objetos por uma propriedade específica
 * @param {array} array - Array a agrupar
 * @param {string} property - Propriedade para agrupar
 * @returns {object} Objeto com grupos
 */
export const groupBy = (array, property) => {
  if (!Array.isArray(array)) return {};

  return array.reduce((acc, obj) => {
    const key = obj[property];
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(obj);
    return acc;
  }, {});
};

/**
 * Ordena um array por uma propriedade numérica
 * @param {array} array - Array a ordenar
 * @param {string} property - Propriedade para ordenar
 * @param {string} direction - 'asc' para ascendente, 'desc' para descendente
 * @returns {array} Array ordenado
 */
export const sortBy = (array, property, direction = 'asc') => {
  if (!Array.isArray(array)) return [];

  return [...array].sort((a, b) => {
    const aVal = a[property];
    const bVal = b[property];

    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

/**
 * Calcula o total de uma propriedade em um array
 * @param {array} array - Array com objetos
 * @param {string} property - Propriedade a somar
 * @returns {number} Soma total
 */
export const sumProperty = (array, property) => {
  if (!Array.isArray(array)) return 0;

  return array.reduce((sum, obj) => {
    const value = parseFloat(obj[property]) || 0;
    return sum + value;
  }, 0);
};

/**
 * Calcula a média de uma propriedade em um array
 * @param {array} array - Array com objetos
 * @param {string} property - Propriedade para calcular média
 * @returns {number} Média
 */
export const averageProperty = (array, property) => {
  if (!Array.isArray(array) || array.length === 0) return 0;

  const sum = sumProperty(array, property);
  return sum / array.length;
};
