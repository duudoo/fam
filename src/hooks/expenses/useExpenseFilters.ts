
import { useState } from "react";
import { ExpenseCategory, ExpenseStatus } from "@/utils/types";

export const useExpenseFilters = () => {
  const [filter, setFilter] = useState<ExpenseStatus | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<ExpenseCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  return {
    filter,
    setFilter,
    categoryFilter, 
    setCategoryFilter,
    searchQuery,
    setSearchQuery,
  };
};
