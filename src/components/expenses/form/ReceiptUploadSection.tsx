
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

const ReceiptUploadSection = () => {
  return (
    <div className="border border-dashed border-gray-300 rounded-lg p-4 text-center w-full">
      <div className="flex flex-col items-center justify-center gap-2">
        <Upload className="w-6 h-6 text-gray-400" />
        <p className="text-sm text-gray-500">
          Drag & drop receipt here or click to browse
        </p>
        <Button type="button" variant="outline" size="sm" className="w-full max-w-[200px]">
          Upload Receipt
        </Button>
      </div>
    </div>
  );
};

export default ReceiptUploadSection;
