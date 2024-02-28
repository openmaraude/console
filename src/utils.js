// Format date as a human readable string.
export function formatDate(date, display = null) {
  if (!date) {
    return null;
  }
  if (display === 'date') {
    return new Date(date).toLocaleDateString('fr');
  }
  if (display === 'time') {
    return new Date(date).toLocaleTimeString('fr');
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

// Extract the departement code from the town INSEE code
export function departementCode(insee) {
  const prefix = insee.substr(0, 2);
  return prefix === '97' || prefix === '98' ? insee.substr(0, 3) : prefix;
}

const monthNames = ['ignore zero', 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

export function formatMonth(index) {
  return monthNames[index];
}

export function formatPhoneNumber(number) {
  if (!number) {
    return "-";
  }
  return number.replace(/^\+/g, '').replace(/^33/g, '0').replace(/^(\d{2}) ?(\d{2}) ?(\d{2}) ?(\d{2}) ?(\d{2})$/, '$1 $2 $3 $4 $5');
}

export async function reverseGeocode({ lon, lat }) {
  if (!lon || !lat) {
    return '?';
  }
  const API_URL = 'https://api-adresse.data.gouv.fr/reverse/';
  const url = new URL(`${API_URL}?type=housenumber&limit=1&lon=${lon}&lat=${lat}`);
  return fetch(url).then((resp) => {
    if (!resp.ok) {
      return resp.statusText;
    }
    return resp.json().then((geoJSON) => {
      const result = geoJSON.features[0];
      if (!result) {
        return "(adresse introuvable)";
      }
      const { properties: { label } } = result;
      return label;
    });
  });
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
  '84', '85', '86', '88', '89', '78', '988',
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
  // These are not part of the INSEE regions
  "988": {
    "name": "Nouvelle-Calédonie",
    "departements": [
      "988",
    ],
  },
};

// Ordered by name, not number
export const regions = [
  '84', '27', '53', '24', '94', '44', '01', '03', '32', '11', '04', '02', '06', '28', '75', '76', '52', '93', '988',
];

export const metropoles = {
  grenoble: {
    name: "Grenoble",
    insee: ['38185', '38057', '38059', '38071', '38068', '38111', '38126', '38150', '38151', '38158', '38169', '38170', '38179', '38187', '38188', '38200', '38229', '38235', '38258', '38252', '38271', '38277', '38279', '38281', '38309', '38317', '38325', '38328', '38364', '38382', '38388', '38421', '38423', '38436', '38445', '38471', '38472', '38474', '38478', '38485', '38486', '38516', '38524', '38528', '38529', '38533', '38540', '38545', '38562'],
  },
  lyon: {
    name: "Lyon",
    insee: ['69123', '69003', '69029', '69033', '69034', '69040', '69044', '69046', '69271', '69063', '69273', '69068', '69069', '69071', '69072', '69275', '69081', '69276', '69085', '69087', '69088', '69089', '69278', '69091', '69096', '69100', '69279', '69116', '69117', '69127', '69282', '69283', '69284', '69142', '69143', '69149', '69152', '69153', '69163', '69286', '69168', '69191', '69194', '69202', '69199', '69204', '69205', '69207', '69290', '69233', '69292', '69293', '69296', '69244', '69250', '69256', '69259', '69260', '69266'],
  },
  rouen: {
    name: "Rouen",
    insee: ['76540', '76005', '76020', '76039', '76056', '76069', '76088', '76095', '76108', '76103', '76116', '76131', '76157', '76165', '76178', '76212', '76216', '76222', '76231', '76237', '76273', '76475', '76282', '76313', '76319', '76322', '76350', '76354', '76366', '76367', '76377', '76378', '76391', '76402', '76410', '76429', '76436', '76451', '76448', '76457', '76464', '76474', '76484', '76486', '76497', '76498', '76513', '76514', '76536', '76550', '76558', '76560', '76561', '76575', '76591', '76599', '76614', '76617', '76631', '76634', '76636', '76640', '76608', '76681', '76682', '76705', '76709', '76717', '76750', '76753', '76759'],
  },
};

export const hailTerminalStatus = [
  'failure',
  'declined_by_taxi',
  'incident_taxi',
  'timeout_taxi',
  'declined_by_customer',
  'timeout_customer',
  'timeout_accepted_by_customer',
  'finished',
  // Added as a successful outcome
  'customer_on_board',
];

export const MIDDLE_FRANCE = [46.536, 2.4302]; // Center map on Metropolitan France
export const PARIS = [48.8566, 2.3511];
export const LYON = [45.7589, 4.8312];
