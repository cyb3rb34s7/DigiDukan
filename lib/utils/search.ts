/**
 * Search Utilities - Semantic Search with Hindi-English Support
 */

import { hindiToEnglish, englishToHindi, getRelatedTerms } from '@/lib/data/hindi-dictionary';

/**
 * Expand a search query to include Hindi/English equivalents
 * Example: "namak" → "namak salt noon"
 */
export function expandSearchQuery(query: string): string {
  if (!query.trim()) return query;

  const words = query.toLowerCase().trim().split(/\s+/);
  const expanded = new Set<string>(words);

  words.forEach((word) => {
    // Get related terms from dictionary
    const related = getRelatedTerms(word);
    related.forEach((term) => expanded.add(term.toLowerCase()));

    // Also add the original word
    expanded.add(word);
  });

  return Array.from(expanded).join(' ');
}

/**
 * Get suggested aliases based on product name
 * Used when adding/editing products
 */
export function getSuggestedAliases(productName: string): string[] {
  if (!productName.trim()) return [];

  const nameLower = productName.toLowerCase();
  const suggestions = new Set<string>();

  // Check each Hindi term - if English equivalent is in product name, suggest Hindi
  Object.entries(hindiToEnglish).forEach(([hindi, englishTerms]) => {
    englishTerms.forEach((eng) => {
      if (nameLower.includes(eng.toLowerCase())) {
        suggestions.add(hindi);
      }
    });
  });

  // Check each English term - if Hindi equivalent is in product name, suggest English
  Object.entries(englishToHindi).forEach(([eng, hindiTerms]) => {
    if (nameLower.includes(eng)) {
      hindiTerms.forEach((hindi) => {
        // Also get English equivalents of this Hindi term
        const englishEquivs = hindiToEnglish[hindi] || [];
        englishEquivs.forEach((e) => {
          if (!nameLower.includes(e.toLowerCase())) {
            suggestions.add(e.toLowerCase());
          }
        });
      });
    }
  });

  // Also check if product name contains any Hindi words directly
  const words = nameLower.split(/\s+/);
  words.forEach((word) => {
    if (hindiToEnglish[word]) {
      hindiToEnglish[word].forEach((eng) => suggestions.add(eng.toLowerCase()));
    }
  });

  return Array.from(suggestions).slice(0, 8); // Limit to 8 suggestions
}

/**
 * Check if a search term matches a product (with Hindi-English support)
 */
export function matchesProduct(
  searchTerm: string,
  product: { name: string; aliases: string[] }
): boolean {
  const termLower = searchTerm.toLowerCase();
  const nameLower = product.name.toLowerCase();

  // Direct name match
  if (nameLower.includes(termLower)) return true;

  // Alias match
  if (product.aliases.some((alias) => alias.toLowerCase().includes(termLower))) {
    return true;
  }

  // Expanded term match
  const relatedTerms = getRelatedTerms(termLower);
  for (const related of relatedTerms) {
    if (nameLower.includes(related.toLowerCase())) return true;
    if (product.aliases.some((alias) => alias.toLowerCase().includes(related.toLowerCase()))) {
      return true;
    }
  }

  return false;
}
