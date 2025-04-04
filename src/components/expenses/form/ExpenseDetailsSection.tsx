
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateField } from "./fields/DateField";
import { DescriptionField } from "./fields/DescriptionField";
import { AmountField } from "./fields/AmountField";
import CategoryField from "./fields/CategoryField";
import SplitMethodField from "./fields/SplitMethodField";
import { useCurrency } from "@/contexts/CurrencyContext";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./schema";
import { SplitMethod } from "@/utils/types";

interface ExpenseDetailsSectionProps {
  control?: any;
  form?: UseFormReturn<FormValues>;
  categories?: string[];
  splitMethods?: { value: string; label: string }[];
  onSplitMethodChange?: (method: SplitMethod) => void;
  isMobile?: boolean;
}

const ExpenseDetailsSection = ({ 
  control, 
  form,
  categories = [],
  splitMethods = [],
  onSplitMethodChange,
  isMobile = false
}: ExpenseDetailsSectionProps) => {
  const { currency } = useCurrency();
  
  if (!form) {
    return null;
  }
  
  // Format the split methods correctly
  const formattedSplitMethods = splitMethods && splitMethods.length > 0 
    ? splitMethods 
    : [
        { value: "none", label: "None" },
        { value: "50/50", label: "50/50" },
        { value: "custom", label: "Custom" },
      ];
  
  return (
    <>
      <CardHeader className="px-0">
        <CardTitle>Expense Details</CardTitle>
      </CardHeader>
      <CardContent className="px-0 space-y-4">
        <DescriptionField form={form} />
        <AmountField form={form} />
        <DateField form={form} />
        <CategoryField control={form.control} categories={categories} />
        <SplitMethodField 
          control={form.control} 
          splitMethods={formattedSplitMethods}
          onSplitMethodChange={onSplitMethodChange} 
        />
      </CardContent>
    </>
  );
};

export default ExpenseDetailsSection;
