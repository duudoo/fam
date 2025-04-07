
/**
 * Utility functions for working with categories
 */
import { useMemo } from 'react';

// Create a simple memoization cache
const memoize = <T extends (...args: any[]) => any>(fn: T): T => {
  const cache = new Map();
  
  return ((...args: any[]) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
};

/**
 * Capitalizes the first letter of each word in a string
 * Memoized for performance
 */
export const capitalizeCategory = memoize((category: string): string => {
  if (!category) return '';
  return category
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
});

/**
 * Formats a category for display - memoized
 */
export const formatCategoryForDisplay = memoize((category: string): string => {
  return capitalizeCategory(category);
});

/**
 * Formats a category for storage (lowercase, trimmed) - memoized
 */
export const formatCategoryForStorage = memoize((category: string): string => {
  return category.trim().toLowerCase();
});

/**
 * Checks if a category exists in an array (case-insensitive) - memoized
 */
export const categoryExists = memoize((categories: string[], category: string): boolean => {
  const normalizedCategory = formatCategoryForStorage(category);
  return categories.map(c => c.toLowerCase()).includes(normalizedCategory);
});

/**
 * Sort categories alphabetically - memoized
 */
export const sortCategories = memoize((categories: string[]): string[] => {
  return [...categories].sort((a, b) => a.localeCompare(b));
});

/**
 * Hook to use memoized categories
 */
export const useSortedCategories = (categories: string[]) => {
  return useMemo(() => sortCategories(categories), [categories]);
};
