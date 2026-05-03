export function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value || 0))
}

export function formatPercent(value) {
  return `${Number(value || 0).toFixed(1)}%`
}

export function formatDecimal(value, digits = 2) {
  return Number(value || 0).toFixed(digits)
}
