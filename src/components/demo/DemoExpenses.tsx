
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Check, DollarSign } from "lucide-react";

const DemoExpenses = () => {
  const features = [
    "Track shared childcare expenses in one place",
    "Upload receipts directly from your phone",
    "Split costs automatically based on your agreement",
    "Get monthly summaries of expenses by category",
    "Export reports for legal or tax purposes"
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <p className="text-gray-600 mb-6">
          Famacle helps co-parents track, split, and settle childcare expenses without the stress of manual calculations or awkward money conversations.
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
      
      <div className="relative">
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <DollarSign className="mr-2 h-5 w-5 text-famacle-blue" />
            Recent Expenses
          </h3>
          
          {/* Mock expenses */}
          {[
            { name: "School Supplies", amount: 67.89, date: "Aug 15", paid: "You" },
            { name: "Doctor Visit", amount: 120.00, date: "Aug 10", paid: "Sarah" },
            { name: "Soccer Registration", amount: 95.00, date: "Aug 5", paid: "You" }
          ].map((expense, index) => (
            <motion.div 
              key={index}
              className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <div>
                <div className="font-medium">{expense.name}</div>
                <div className="text-sm text-gray-500">{expense.date}</div>
              </div>
              <div className="text-right">
                <div className="font-medium">${expense.amount.toFixed(2)}</div>
                <div className="text-sm text-gray-500">Paid by: {expense.paid}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DemoExpenses;
