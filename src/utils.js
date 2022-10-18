// Format date as a human readable string.
export function formatDate(date) {
  if (!date) {
    return null;
  }
  return `${date.toLocaleDateString('fr')} ${date.toLocaleTimeString('fr')}`;
}

// Format longitude or latitude
export function formatLoc(num) {
  return num?.toFixed(5);
}

export function formatDecimal(float) {
  return float?.toFixed(2).toString().replace('.', ',');
}

const monthNames = ['ignore zero', 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']

export function formatMonth(index) {
  return monthNames[index];
}
