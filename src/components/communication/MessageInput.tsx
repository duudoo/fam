
import { useState, useRef } from "react";
import { Send, ImagePlus, Paperclip, FileText, Image, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Attachment, AttachmentType, Message } from "@/utils/types";

interface MessageInputProps {
  onSendMessage: (message: Omit<Message, "id" | "status">) => void;
  disabled?: boolean;
}

export const MessageInput = ({ onSendMessage, disabled = false }: MessageInputProps) => {
  const [newMessage, setNewMessage] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = () => {
    if (newMessage.trim() === "" && attachments.length === 0) return;
    
    const message = {
      senderId: "user", 
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachments: attachments.length > 0 ? [...attachments] : undefined
    };
    
    onSendMessage(message);
    setNewMessage("");
    setAttachments([]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: AttachmentType) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newAttachments: Attachment[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileUrl = URL.createObjectURL(file);
      
      newAttachments.push({
        id: `${Date.now()}-${i}`,
        type: type,
        url: fileUrl,
        name: file.name,
        size: file.size
      });
    }

    setAttachments([...attachments, ...newAttachments]);
    
    // Reset the input value so the same file can be selected again
    e.target.value = '';
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments(attachments.filter(attachment => attachment.id !== id));
  };

  const triggerImageUpload = () => {
    imageInputRef.current?.click();
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="border-t pt-4">
      {attachments.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {attachments.map((attachment) => (
            <div 
              key={attachment.id} 
              className="bg-gray-100 px-3 py-1.5 rounded-full flex items-center gap-1.5"
            >
              {attachment.type === 'image' ? (
                <Image className="h-4 w-4 text-gray-600" />
              ) : (
                <FileText className="h-4 w-4 text-gray-600" />
              )}
              <span className="text-sm truncate max-w-[120px]">{attachment.name}</span>
              <button 
                onClick={() => handleRemoveAttachment(attachment.id)}
                className="hover:bg-gray-200 rounded-full p-0.5"
              >
                <X className="h-3.5 w-3.5 text-gray-500" />
              </button>
            </div>
          ))}
        </div>
      )}
      
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <Textarea 
            placeholder={disabled ? "Add co-parent to send messages" : "Type your message here..."}
            className="min-h-[80px] resize-none"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && !disabled) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={disabled}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            title="Attach image"
            onClick={triggerImageUpload}
            disabled={disabled}
          >
            <ImagePlus className="h-5 w-5" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            title="Attach file"
            onClick={triggerFileUpload}
            disabled={disabled}
          >
            <Paperclip className="h-5 w-5" />
          </Button>
          <Button 
            onClick={handleSendMessage}
            disabled={disabled || (newMessage.trim() === "" && attachments.length === 0)}
            className="px-4"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Hidden file inputs */}
      <input
        type="file"
        ref={imageInputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => handleFileChange(e, 'image')}
      />
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={(e) => handleFileChange(e, 'document')}
      />
      
      <p className="text-xs text-gray-500 mt-2">
        Press Enter to send. Use Shift+Enter for a new line.
      </p>
    </div>
  );
};
