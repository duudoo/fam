
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./EventFormSchema";

interface LocationSectionProps {
  form: UseFormReturn<FormValues>;
}

const LocationSection = ({ form }: LocationSectionProps) => {
  return (
    <FormField
      control={form.control}
      name="location"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Location (Optional)</FormLabel>
          <FormControl>
            <Input placeholder="Enter location" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default LocationSection;
