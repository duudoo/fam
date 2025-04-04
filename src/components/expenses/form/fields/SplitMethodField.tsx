
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SplitMethod } from "@/utils/types";
import { Control } from "react-hook-form";

interface SplitMethodFieldProps {
  control: Control<any>;
  onSplitMethodChange?: (method: SplitMethod) => void;
}

const SplitMethodField = ({ control, onSplitMethodChange }: SplitMethodFieldProps) => {
  const splitMethods: { value: SplitMethod; label: string }[] = [
    { value: "none", label: "None" },
    { value: "50/50", label: "50/50" },
    { value: "custom", label: "Custom" },
  ];

  return (
    <FormField
      control={control}
      name="splitMethod"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Split Method</FormLabel>
          <Select
            onValueChange={(value) => {
              field.onChange(value);
              onSplitMethodChange?.(value as SplitMethod);
            }}
            defaultValue={field.value}
            value={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select split method" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {splitMethods.map((method) => (
                <SelectItem key={method.value} value={method.value}>
                  {method.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default SplitMethodField;
