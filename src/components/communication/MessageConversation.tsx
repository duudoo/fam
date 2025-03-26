
import { useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCheck, Check, FileText, Image } from "lucide-react";
import { Message, Attachment, AttachmentType } from "@/utils/types";

interface MessageConversationProps {
  messages: Message[];
}

export const MessageConversation = ({ messages }: MessageConversationProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const renderMessageStatus = (status: string) => {
    switch (status) {
      case "sending":
        return null;
      case "sent":
        return <Check className="h-4 w-4 text-gray-400" />;
      case "delivered":
        return <Check className="h-4 w-4 text-gray-400" />;
      case "seen":
        return <CheckCheck className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const renderAttachment = (attachment: Attachment) => {
    switch (attachment.type) {
      case "image":
        return (
          <div className="mb-2 rounded-md overflow-hidden">
            <img 
              src={attachment.url} 
              alt={attachment.name} 
              className="max-w-full max-h-72 object-contain"
            />
            <div className="text-xs mt-1 text-gray-500 flex items-center">
              <Image className="h-3 w-3 mr-1" />
              {attachment.name}
            </div>
          </div>
        );
      case "document":
      case "audio":
      case "video":
      case "other":
      default:
        return (
          <div className="mb-2 p-3 bg-gray-100 rounded-md flex items-center gap-2">
            <FileText className="h-5 w-5 text-gray-600" />
            <div className="flex-1 overflow-hidden">
              <div className="text-sm font-medium truncate">{attachment.name}</div>
              {attachment.size && (
                <div className="text-xs text-gray-500">
                  {(attachment.size / 1024).toFixed(1)} KB
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      {messages.map((message) => {
        const isUserMessage = message.senderId === "user";
        
        return (
          <AnimatePresence key={message.id}>
            <motion.div
              className={`flex ${isUserMessage ? "justify-end" : "justify-start"}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-end gap-2 max-w-[80%]">
                {!isUserMessage && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" alt="Sarah" />
                    <AvatarFallback>SJ</AvatarFallback>
                  </Avatar>
                )}
                
                <div
                  className={`p-3 rounded-lg ${
                    isUserMessage
                      ? "bg-famacle-blue text-white rounded-tr-none"
                      : "bg-white border border-gray-200 rounded-tl-none"
                  }`}
                >
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mb-2">
                      {message.attachments.map((attachment) => (
                        <div key={attachment.id}>
                          {renderAttachment(attachment)}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {message.text && (
                    <div className="text-sm whitespace-pre-wrap break-words">{message.text}</div>
                  )}
                  
                  <div className="flex items-center gap-1 mt-1">
                    <span className={`text-xs ${isUserMessage ? "text-blue-100" : "text-gray-500"}`}>
                      {message.timestamp}
                    </span>
                    {isUserMessage && renderMessageStatus(message.status)}
                  </div>
                </div>
                
                {isUserMessage && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" alt="You" />
                    <AvatarFallback>ME</AvatarFallback>
                  </Avatar>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};
