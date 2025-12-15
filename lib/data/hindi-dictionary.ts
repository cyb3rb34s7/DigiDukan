/**
 * Hindi-English Dictionary for Kirana Store Products
 * Used for semantic search and alias suggestions
 */

// Hindi word → English equivalents (and variations)
export const hindiToEnglish: Record<string, string[]> = {
  // Salt
  namak: ['salt', 'noon', 'sendha'],
  noon: ['salt', 'namak'],

  // Sugar & Sweeteners
  cheeni: ['sugar', 'chini'],
  shakkar: ['sugar', 'jaggery', 'gur'],
  gur: ['jaggery', 'shakkar', 'gud'],
  mishri: ['rock sugar', 'crystal sugar', 'misri'],
  shahad: ['honey', 'madhu'],

  // Rice & Grains
  chawal: ['rice', 'basmati', 'chaval'],
  basmati: ['rice', 'chawal'],
  gehun: ['wheat', 'gehoon'],

  // Flour
  atta: ['flour', 'wheat flour', 'aata'],
  maida: ['refined flour', 'all purpose flour', 'white flour'],
  besan: ['gram flour', 'chickpea flour'],
  suji: ['semolina', 'rava', 'sooji'],
  rava: ['semolina', 'suji'],

  // Lentils & Pulses
  dal: ['lentils', 'pulses', 'daal'],
  chana: ['chickpea', 'gram', 'chole'],
  rajma: ['kidney beans', 'rajmah'],
  moong: ['mung bean', 'green gram', 'moong dal'],
  urad: ['black gram', 'urad dal'],
  toor: ['pigeon pea', 'arhar', 'toor dal'],
  masoor: ['red lentils', 'masur'],
  kabuli: ['chickpea', 'white chana', 'kabuli chana'],

  // Oils
  tel: ['oil', 'cooking oil'],
  sarson: ['mustard oil', 'sarson ka tel'],
  soyabean: ['soybean oil', 'soya'],
  mungfali: ['groundnut oil', 'peanut oil'],
  til: ['sesame oil', 'gingelly'],
  nariyal: ['coconut oil', 'coconut'],

  // Ghee & Butter
  ghee: ['clarified butter', 'desi ghee'],
  makhan: ['butter', 'makkhan'],

  // Dairy
  doodh: ['milk', 'dudh'],
  dahi: ['curd', 'yogurt', 'yoghurt'],
  paneer: ['cottage cheese', 'indian cheese'],

  // Spices
  masala: ['spice', 'spices', 'masale'],
  mirch: ['chilli', 'chili', 'pepper', 'mirchi'],
  lalmirch: ['red chilli', 'red chili', 'lal mirch'],
  kaali: ['black pepper', 'kali mirch'],
  haldi: ['turmeric', 'haldi powder'],
  jeera: ['cumin', 'zeera', 'jira'],
  dhania: ['coriander', 'dhaniya'],
  rai: ['mustard seeds', 'sarson'],
  methi: ['fenugreek', 'kasuri methi'],
  ajwain: ['carom seeds', 'ajvain'],
  heeng: ['asafoetida', 'hing'],
  dalchini: ['cinnamon', 'dalcheeni'],
  laung: ['cloves', 'lavang'],
  elaichi: ['cardamom', 'ilaichi', 'elaichi'],
  javitri: ['mace', 'jawitri'],
  jaiphal: ['nutmeg', 'jaaiphal'],
  tejpatta: ['bay leaf', 'tej patta'],
  kesar: ['saffron', 'keshar'],

  // Tea & Coffee
  chai: ['tea', 'chay', 'chaya'],
  patti: ['tea leaves', 'chai patti'],
  coffee: ['kaapi', 'kafi', 'kofi'],

  // Vegetables (common)
  aloo: ['potato', 'alu'],
  pyaaz: ['onion', 'pyaj', 'kanda'],
  tamatar: ['tomato', 'tamater'],
  lahsun: ['garlic', 'lasun'],
  adrak: ['ginger', 'adrakh'],

  // Snacks & Misc
  namkeen: ['snacks', 'savory', 'namkin'],
  biscuit: ['cookies', 'biscuits', 'biskut'],
  chips: ['crisps', 'wafers'],
  papad: ['papadum', 'pappad'],
  achar: ['pickle', 'achaar'],

  // Cleaning
  sabun: ['soap', 'saabun'],
  shampoo: ['shampoo'],
  detergent: ['washing powder', 'surf', 'rin'],

  // Brands often searched in Hindi
  tata: ['tata'],
  ashirvaad: ['ashirwad', 'aashirvaad'],
  fortune: ['fortune'],
  saffola: ['saffola'],
  patanjali: ['patanjali'],
};

// Auto-generate English → Hindi mapping
export const englishToHindi: Record<string, string[]> = {};

// Build reverse mapping
Object.entries(hindiToEnglish).forEach(([hindi, englishTerms]) => {
  englishTerms.forEach((eng) => {
    const engLower = eng.toLowerCase();
    if (!englishToHindi[engLower]) {
      englishToHindi[engLower] = [];
    }
    if (!englishToHindi[engLower].includes(hindi)) {
      englishToHindi[engLower].push(hindi);
    }
  });
});

// All terms combined for quick lookup
export const allTerms = new Set([
  ...Object.keys(hindiToEnglish),
  ...Object.keys(englishToHindi),
]);

/**
 * Get all related terms for a word (Hindi or English)
 */
export function getRelatedTerms(word: string): string[] {
  const wordLower = word.toLowerCase();
  const related = new Set<string>();

  // Check if it's a Hindi word
  if (hindiToEnglish[wordLower]) {
    hindiToEnglish[wordLower].forEach((term) => related.add(term));
  }

  // Check if it's an English word
  if (englishToHindi[wordLower]) {
    englishToHindi[wordLower].forEach((term) => related.add(term));
  }

  return Array.from(related);
}
