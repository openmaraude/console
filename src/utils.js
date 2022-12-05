// Format date as a human readable string.
export function formatDate(date) {
  if (!date) {
    return null;
  }
  return new Date(date).toLocaleString('fr');
}

// Format longitude or latitude
export function formatLoc(num) {
  return num?.toFixed(5);
}

export function formatDecimal(float) {
  return float?.toFixed(2).toString().replace('.', ',');
}

const monthNames = ['ignore zero', 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

export function formatMonth(index) {
  return monthNames[index];
}

/* eslint quote-props: ["error", "consistent"] */
export const departementNames = {
  '01': "Ain",
  '02': "Aisne",
  '03': "Allier",
  '04': "Alpes-de-Haute-Provence",
  '05': "Hautes-Alpes",
  '06': "Alpes-Maritimes",
  '07': "Ardèche",
  '08': "Ardennes",
  '09': "Ariège",
  '10': "Aube",
  '11': "Aude",
  '12': "Aveyron",
  '13': "Bouches-du-Rhône",
  '14': "Calvados",
  '15': "Cantal",
  '16': "Charente",
  '17': "Charente-Maritime",
  '18': "Cher",
  '19': "Corrèze",
  '2A': "Corse-du-Sud",
  '2B': "Haute-Corse",
  '21': "Côte-d'Or",
  '22': "Côtes-d'Armor",
  '23': "Creuse",
  '24': "Dordogne",
  '25': "Doubs",
  '26': "Drôme",
  '27': "Eure",
  '28': "Eure-et-Loir",
  '29': "Finistère",
  '30': "Gard",
  '31': "Haute-Garonne",
  '32': "Gers",
  '33': "Gironde",
  '34': "Hérault",
  '35': "Ille-et-Vilaine",
  '36': "Indre",
  '37': "Indre-et-Loire",
  '38': "Isère",
  '39': "Jura",
  '40': "Landes",
  '41': "Loir-et-Cher",
  '42': "Loire",
  '43': "Haute-Loire",
  '44': "Loire-Atlantique",
  '45': "Loiret",
  '46': "Lot",
  '47': "Lot-et-Garonne",
  '48': "Lozère",
  '49': "Maine-et-Loire",
  '50': "Manche",
  '51': "Marne",
  '52': "Haute-Marne",
  '53': "Mayenne",
  '54': "Meurthe-et-Moselle",
  '55': "Meuse",
  '56': "Morbihan",
  '57': "Moselle",
  '58': "Nièvre",
  '59': "Nord",
  '60': "Oise",
  '61': "Orne",
  '62': "Pas-de-Calais",
  '63': "Puy-de-Dôme",
  '64': "Pyrénées-Atlantiques",
  '65': "Hautes-Pyrénées",
  '66': "Pyrénées-Orientales",
  '67': "Bas-Rhin",
  '68': "Haut-Rhin",
  '69': "Rhône",
  '70': "Haute-Saône",
  '71': "Saône-et-Loire",
  '72': "Sarthe",
  '73': "Savoie",
  '74': "Haute-Savoie",
  '75': "Paris",
  '76': "Seine-Maritime",
  '77': "Seine-et-Marne",
  '78': "Yvelines",
  '79': "Deux-Sèvres",
  '80': "Somme",
  '81': "Tarn",
  '82': "Tarn-et-Garonne",
  '83': "Var",
  '84': "Vaucluse",
  '85': "Vendée",
  '86': "Vienne",
  '87': "Haute-Vienne",
  '88': "Vosges",
  '89': "Yonne",
  '90': "Territoire de Belfort",
  '91': "Essonne",
  '92': "Hauts-de-Seine",
  '93': "Seine-Saint-Denis",
  '94': "Val-de-Marne",
  '95': "Val-d'Oise",
  '971': "Guadeloupe",
  '972': "Martinique",
  '973': "Guyane",
  '974': "La Réunion",
  '976': "Mayotte",
  '988': "Nouvelle-Calédonie",
};

// Ordered by name, not number
export const departements = [
  '01', '02', '03', '04', '06', '07', '08', '09', '10', '11', '12', '67', '13', '14', '15', '16',
  '17', '18', '19', '2A', '21', '22', '23', '79', '24', '25', '26', '91', '27', '28', '29', '30',
  '32', '33', '971', '973', '68', '2B', '31', '43', '52', '70', '74', '87', '05', '65', '92',
  '34', '35', '36', '37', '38', '39', '974', '40', '41', '42', '44', '45', '46', '47', '48', '49',
  '50', '51', '972', '53', '976', '54', '55', '56', '57', '58', '59', '988', '60', '61', '75', '62', '63',
  '64', '66', '69', '71', '72', '73', '77', '76', '93', '80', '81', '82', '90', '95', '94', '83',
  '84', '85', '86', '88', '89', '78',
];

export const regionDetails = {
  "01": {
    "name": "Guadeloupe",
    "departements": [
      "971",
    ],
  },
  "02": {
    "name": "Martinique",
    "departements": [
      "972",
    ],
  },
  "03": {
    "name": "Guyane",
    "departements": [
      "973",
    ],
  },
  "04": {
    "name": "La R\u00e9union",
    "departements": [
      "974",
    ],
  },
  "06": {
    "name": "Mayotte",
    "departements": [
      "976",
    ],
  },
  "11": {
    "name": "\u00cele-de-France",
    "departements": [
      "75",
      "77",
      "78",
      "91",
      "92",
      "93",
      "94",
      "95",
    ],
  },
  "24": {
    "name": "Centre-Val de Loire",
    "departements": [
      "18",
      "28",
      "36",
      "37",
      "41",
      "45",
    ],
  },
  "27": {
    "name": "Bourgogne-Franche-Comt\u00e9",
    "departements": [
      "21",
      "25",
      "39",
      "58",
      "70",
      "71",
      "89",
      "90",
    ],
  },
  "28": {
    "name": "Normandie",
    "departements": [
      "14",
      "27",
      "50",
      "61",
      "76",
    ],
  },
  "32": {
    "name": "Hauts-de-France",
    "departements": [
      "02",
      "59",
      "60",
      "62",
      "80",
    ],
  },
  "44": {
    "name": "Grand Est",
    "departements": [
      "08",
      "10",
      "51",
      "52",
      "54",
      "55",
      "57",
      "67",
      "68",
      "88",
    ],
  },
  "52": {
    "name": "Pays de la Loire",
    "departements": [
      "44",
      "49",
      "53",
      "72",
      "85",
    ],
  },
  "53": {
    "name": "Bretagne",
    "departements": [
      "22",
      "29",
      "35",
      "56",
    ],
  },
  "75": {
    "name": "Nouvelle-Aquitaine",
    "departements": [
      "16",
      "17",
      "19",
      "23",
      "24",
      "33",
      "40",
      "47",
      "64",
      "79",
      "86",
      "87",
    ],
  },
  "76": {
    "name": "Occitanie",
    "departements": [
      "09",
      "11",
      "12",
      "30",
      "31",
      "32",
      "34",
      "46",
      "48",
      "65",
      "66",
      "81",
      "82",
    ],
  },
  "84": {
    "name": "Auvergne-Rh\u00f4ne-Alpes",
    "departements": [
      "01",
      "03",
      "07",
      "15",
      "26",
      "38",
      "42",
      "43",
      "63",
      "69",
      "73",
      "74",
    ],
  },
  "93": {
    "name": "Provence-Alpes-C\u00f4te d'Azur",
    "departements": [
      "04",
      "05",
      "06",
      "13",
      "83",
      "84",
    ],
  },
  "94": {
    "name": "Corse",
    "departements": [
      "2A",
      "2B",
    ],
  },
};

// Ordered by name, not number
export const regions = [
  '84', '27', '53', '24', '94', '44', '01', '03', '32', '11', '04', '02', '06', '28', '75', '76', '52', '93',
];
