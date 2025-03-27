
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

// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
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
