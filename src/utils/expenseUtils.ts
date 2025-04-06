
import { ExpenseCategory, ExpenseStatus } from "@/utils/types";

// Category utility functions
export const getCategoryColor = (category: ExpenseCategory): string => {
  const categoryColors: Record<ExpenseCategory, string> = {
    medical: "bg-red-500",
    education: "bg-blue-500",
    clothing: "bg-purple-500",
    activities: "bg-green-500",
    food: "bg-orange-500",
    other: "bg-gray-500",
  };
  
  return categoryColors[category] || "bg-gray-500";
};

export const getCategoryIcon = (category: ExpenseCategory): string => {
  const categoryIcons: Record<ExpenseCategory, string> = {
    medical: "heart-pulse",
    education: "book-open",
    clothing: "shirt",
    activities: "ticket",
    food: "utensils",
    other: "circle-ellipsis",
  };
  
  return categoryIcons[category] || "circle";
};

// Status utility functions
export const getStatusColor = (status: ExpenseStatus): string => {
  const statusColors: Record<ExpenseStatus, string> = {
    pending: "bg-yellow-400 text-yellow-800",
    approved: "bg-green-400 text-green-800",
    disputed: "bg-red-400 text-red-800",
    paid: "bg-blue-400 text-blue-800",
  };
  
  return statusColors[status] || "bg-gray-400 text-gray-800";
};

export const getStatusText = (status: ExpenseStatus): string => {
  const statusText: Record<ExpenseStatus, string> = {
    pending: "Pending",
    approved: "Approved",
    disputed: "Disputed",
    paid: "Paid",
  };
  
  return statusText[status] || "Unknown";
};

// Format currency with a given symbol or default to $
export const formatCurrency = (amount: number, currencySymbol = '$'): string => {
  // Handle null, undefined, or NaN values
  if (amount === null || amount === undefined || isNaN(amount)) {
    return `${currencySymbol}0.00`;
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD', // This isn't as important as the symbol we display
    minimumFractionDigits: 2,
    // Use the provided symbol instead of the one from the locale
  }).format(amount).replace('$', currencySymbol);
};

// Format date
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};
