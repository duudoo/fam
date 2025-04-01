
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";
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
        <FormItem className="mb-2">
          <FormLabel>Location (Optional)</FormLabel>
          <FormControl>
            <div className="flex items-center">
              <MapPin className="mr-2 h-4 w-4 text-gray-400" />
              <Input placeholder="Enter location" className="text-base md:text-sm" {...field} />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default LocationSection;
