
import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Check, MessageCircle } from "lucide-react";
import Navbar from "@/components/Navbar";

const CommunicationsPage = () => {
  const features = [
    "Keep all co-parenting conversations in one secure place",
    "Share photos and updates about your children",
    "Document important decisions for future reference",
    "Set up automated reminders for the other parent",
    "Maintain a civil tone with our communication tools"
  ];

  // Sample messages
  const messages = [
    { sender: "You", text: "Emma has soccer practice this Saturday at 10am. Can you take her?", time: "2:45 PM" },
    { sender: "Sarah", text: "Yes, I can take her. Will pick her up at 9:30am.", time: "3:12 PM" },
    { sender: "You", text: "Great, thanks! She'll have her gear ready.", time: "3:15 PM" },
    { sender: "Sarah", text: "Also, did you schedule her dentist appointment for next month?", time: "3:20 PM" },
    { sender: "You", text: "Yes, it's on the 15th at 4pm. Added it to the shared calendar.", time: "3:22 PM" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-famacle-blue-light/30">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12 max-w-6xl">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-famacle-slate mb-2">Communications</h1>
          <p className="text-gray-600">Keep all your co-parenting conversations organized and constructive</p>
        </header>
        
        <Card className="p-6 shadow-lg border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <MessageCircle className="h-6 w-6 text-famacle-blue" />
            <h2 className="text-2xl font-semibold">Parent Communications</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <p className="text-gray-600 mb-6">
                Famacle provides a dedicated communication platform that helps co-parents maintain clear, documented, and civil conversations about their children.
              </p>
              
              <ul className="space-y-3">
                {features.map((feature, index) => (
                  <motion.li 
                    key={index}
                    className="flex items-start gap-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <span className="rounded-full bg-famacle-blue-light p-1 mt-0.5">
                      <Check className="h-3 w-3 text-famacle-blue" />
                    </span>
                    <span>{feature}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
            
            <div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 h-full">
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <MessageCircle className="mr-2 h-5 w-5 text-famacle-blue" />
                  Recent Conversations
                </h3>
                
                <div className="flex flex-col gap-3 overflow-y-auto max-h-[300px]">
                  {messages.map((message, index) => (
                    <motion.div 
                      key={index}
                      className={`flex ${message.sender === "You" ? "justify-end" : "justify-start"}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      <div 
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.sender === "You" 
                            ? "bg-famacle-blue text-white rounded-tr-none" 
                            : "bg-white border border-gray-200 rounded-tl-none"
                        }`}
                      >
                        <div className="text-sm">{message.text}</div>
                        <div className={`text-xs mt-1 ${message.sender === "You" ? "text-blue-100" : "text-gray-500"}`}>
                          {message.time}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default CommunicationsPage;
