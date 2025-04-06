
/**
 * Utility functions for working with categories
 */

/**
 * Capitalizes the first letter of each word in a string
 * Memoization could be added if this becomes a performance bottleneck
 */
export const capitalizeCategory = (category: string): string => {
  if (!category) return '';
  return category
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Formats a category for display
 */
export const formatCategoryForDisplay = (category: string): string => {
  return capitalizeCategory(category);
};

/**
 * Formats a category for storage (lowercase, trimmed)
 */
export const formatCategoryForStorage = (category: string): string => {
  return category.trim().toLowerCase();
};

/**
 * Checks if a category exists in an array (case-insensitive)
 */
export const categoryExists = (categories: string[], category: string): boolean => {
  const normalizedCategory = formatCategoryForStorage(category);
  return categories.map(c => c.toLowerCase()).includes(normalizedCategory);
};

/**
 * Sort categories alphabetically
 */
export const sortCategories = (categories: string[]): string[] => {
  return [...categories].sort((a, b) => a.localeCompare(b));
};
