
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { AddChildInput } from "@/utils/types";

interface ChildFormProps {
  onSubmit: (child: AddChildInput) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  initialValues?: {
    name: string;
    initials: string;
    dateOfBirth: string;
  };
}

const ChildForm = ({ 
  onSubmit, 
  onCancel, 
  isSubmitting = false,
  initialValues
}: ChildFormProps) => {
  const [name, setName] = useState(initialValues?.name || "");
  const [initials, setInitials] = useState(initialValues?.initials || "");
  const [dateOfBirth, setDateOfBirth] = useState(initialValues?.dateOfBirth || "");
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!initials) {
      newErrors.initials = "Initials are required";
    } else if (initials.length > 4) {
      newErrors.initials = "Initials should be 4 characters or less";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    onSubmit({
      name: name || null,
      initials,
      dateOfBirth: dateOfBirth || null
    });
  };

  const generateInitials = (fullName: string) => {
    if (!fullName) return "";
    
    const names = fullName.trim().split(" ");
    if (names.length === 1) {
      return names[0].substring(0, 2).toUpperCase();
    }
    
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    
    // Only auto-generate initials if they haven't been manually changed
    if (!initials || initials === generateInitials(name)) {
      setInitials(generateInitials(newName));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={name}
            onChange={handleNameChange}
            placeholder="Child's full name"
          />
        </div>
        
        <div>
          <Label htmlFor="initials">Initials</Label>
          <Input
            id="initials"
            value={initials}
            onChange={(e) => setInitials(e.target.value.toUpperCase())}
            placeholder="Initials (e.g. AB)"
            className="uppercase"
            maxLength={4}
            required
          />
          {errors.initials && (
            <p className="text-sm text-red-500 mt-1">{errors.initials}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="dateOfBirth">Date of Birth</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            max={format(new Date(), "yyyy-MM-dd")}
          />
        </div>
        
        <div className="flex justify-end gap-2 mt-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : initialValues ? "Update" : "Add Child"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ChildForm;
