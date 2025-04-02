
import { Message } from "@/utils/types";
import { ExpenseAttachment } from "./ExpenseAttachment";

interface MessageListProps {
  messages: Message[];
  onExpenseClick: (expenseId: string) => void;
}

export const MessageList = ({ messages, onExpenseClick }: MessageListProps) => {
  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div 
          key={message.id} 
          className={`flex ${message.senderId === "user" ? "justify-end" : "justify-start"}`}
        >
          <div 
            className={`max-w-[70%] p-3 rounded-lg ${
              message.senderId === "user" 
                ? "bg-famacle-blue text-white rounded-tr-none" 
                : "bg-gray-200 text-gray-800 rounded-tl-none"
            }`}
          >
            <div className="mb-1">{message.text}</div>
            
            {/* Render expense attachments if any */}
            {message.attachments?.map((attachment, index) => (
              <div key={index}>
                <ExpenseAttachment 
                  attachment={attachment} 
                  variant={message.senderId === "user" ? "dark" : "light"}
                  onExpenseClick={onExpenseClick}
                />
              </div>
            ))}
            
            <div className={`text-xs mt-1 ${message.senderId === "user" ? "text-blue-100" : "text-gray-500"}`}>
              {message.timestamp}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
