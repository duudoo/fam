
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateField } from "./fields/DateField";
import { DescriptionField } from "./fields/DescriptionField";
import { AmountField } from "./fields/AmountField";
import CategoryField from "./fields/CategoryField";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Control } from "react-hook-form";

interface ExpenseDetailsSectionProps {
  control: Control<any>;
}

const ExpenseDetailsSection = ({ control }: ExpenseDetailsSectionProps) => {
  const { currency } = useCurrency();
  
  return (
    <>
      <CardHeader className="px-0">
        <CardTitle>Expense Details</CardTitle>
      </CardHeader>
      <CardContent className="px-0 space-y-4">
        <DescriptionField control={control} />
        <AmountField control={control} currencySymbol={currency.symbol} />
        <DateField control={control} />
        <CategoryField control={control} />
      </CardContent>
    </>
  );
};

export default ExpenseDetailsSection;
