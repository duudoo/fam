
import { useState, useEffect } from "react";
import { ExpenseCategory, ExpenseStatus } from "@/utils/types";
import { useDebounce } from "@/hooks/useDebounce";

export const useExpenseFilters = () => {
  const [filter, setFilter] = useState<ExpenseStatus | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<ExpenseCategory | "all">("all");
  const [searchInputValue, setSearchInputValue] = useState("");
  const searchQuery = useDebounce(searchInputValue, 300);

  return {
    filter,
    setFilter,
    categoryFilter, 
    setCategoryFilter,
    searchQuery,
    searchInputValue,
    setSearchInputValue,
  };
};
