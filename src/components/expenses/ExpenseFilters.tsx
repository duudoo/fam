
import { Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ExpenseCategory, ExpenseStatus } from "@/utils/types";

interface ExpenseFiltersProps {
  filter: ExpenseStatus | "all";
  setFilter: (value: ExpenseStatus | "all") => void;
  categoryFilter: ExpenseCategory | "all";
  setCategoryFilter: (value: ExpenseCategory | "all") => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}

const ExpenseFilters = ({
  filter,
  setFilter,
  categoryFilter,
  setCategoryFilter,
  searchQuery,
  setSearchQuery,
}: ExpenseFiltersProps) => {
  // Expense categories
  const categories: ExpenseCategory[] = [
    "medical",
    "education",
    "clothing",
    "activities",
    "food",
    "other",
  ];

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
      <Tabs value={filter} onValueChange={setFilter as (value: string) => void} className="w-full md:w-auto">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="paid">Paid</TabsTrigger>
          <TabsTrigger value="disputed">Disputed</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="flex items-center gap-2 w-full md:w-auto">
        <div className="relative flex-1 md:flex-none md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            placeholder="Search expenses..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Select value={categoryFilter as string} onValueChange={value => setCategoryFilter(value as any)}>
          <SelectTrigger className="w-[180px]">
            <div className="flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Category" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category} className="capitalize">
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ExpenseFilters;
