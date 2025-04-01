
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Flag } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./EventFormSchema";

interface PrioritySectionProps {
  form: UseFormReturn<FormValues>;
}

const PrioritySection = ({ form }: PrioritySectionProps) => {
  return (
    <FormField
      control={form.control}
      name="priority"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Priority</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a priority" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="low" className="flex items-center">
                <div className="flex items-center">
                  <Flag className="mr-2 h-4 w-4 text-famacle-slate-light" />
                  <span>Low</span>
                </div>
              </SelectItem>
              <SelectItem value="medium">
                <div className="flex items-center">
                  <Flag className="mr-2 h-4 w-4 text-famacle-blue" />
                  <span>Medium</span>
                </div>
              </SelectItem>
              <SelectItem value="high">
                <div className="flex items-center">
                  <Flag className="mr-2 h-4 w-4 text-famacle-coral" />
                  <span>High</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
};

export default PrioritySection;
