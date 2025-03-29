
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, FileImage } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface ReceiptUploadSectionProps {
  onFileUpload: (url: string) => void;
  existingReceiptUrl?: string;
}

const ReceiptUploadSection = ({ onFileUpload, existingReceiptUrl }: ReceiptUploadSectionProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(existingReceiptUrl || null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    if (!user) {
      toast.error('You must be signed in to upload receipts');
      return;
    }

    // Check file type
    const fileType = file.type;
    if (!fileType.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size should be less than 5MB');
      return;
    }

    try {
      setIsUploading(true);
      
      // Generate a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `receipts/${fileName}`;
      
      // Upload to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('receipts')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('receipts')
        .getPublicUrl(filePath);

      if (publicUrlData && publicUrlData.publicUrl) {
        // Update preview
        setPreviewUrl(publicUrlData.publicUrl);
        
        // Call the callback with the URL
        onFileUpload(publicUrlData.publicUrl);
        
        toast.success('Receipt uploaded successfully');
      }
    } catch (error) {
      console.error('Error uploading receipt:', error);
      toast.error('Failed to upload receipt');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const removeReceipt = () => {
    setPreviewUrl(null);
    onFileUpload('');
    toast.success('Receipt removed');
  };

  return (
    <div 
      className={`border border-dashed ${dragActive ? 'border-primary bg-primary/5' : 'border-gray-300'} rounded-lg p-4 text-center w-full transition-colors`}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
    >
      <input 
        type="file"
        ref={fileInputRef}
        onChange={handleChange}
        accept="image/*"
        className="hidden"
      />
      
      {previewUrl ? (
        <div className="flex flex-col items-center gap-2">
          <div className="relative w-full max-w-xs mx-auto">
            <img 
              src={previewUrl} 
              alt="Receipt" 
              className="max-h-48 max-w-full object-contain rounded" 
            />
            <Button 
              type="button" 
              variant="destructive" 
              size="icon" 
              className="absolute -top-2 -right-2 h-6 w-6"
              onClick={removeReceipt}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-1">Receipt uploaded</p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 p-6">
          <FileImage className="w-12 h-12 text-gray-400 mb-2" />
          <p className="text-sm text-gray-500 mb-2">
            Drag & drop receipt image here or click to browse
          </p>
          <p className="text-xs text-gray-400 mb-4">Accepted formats: JPG, PNG, GIF (Max 5MB)</p>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            className="w-full max-w-[200px]"
            onClick={handleClick}
            disabled={isUploading}
          >
            {isUploading ? 'Uploading...' : 'Upload Receipt'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ReceiptUploadSection;
