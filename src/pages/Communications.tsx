
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { MessageInput } from "@/components/communication/MessageInput";
import { ConversationHeader } from "@/components/communication/ConversationHeader";
import { useNavigate } from "react-router-dom";
import ExpenseDetailDialog from "@/components/expenses/ExpenseDetailDialog";
import { MessageList } from "@/components/communication/MessageList";
import { useCommunications } from "@/hooks/useCommunications";

const CommunicationsPage = () => {
  const navigate = useNavigate();
  const { 
    messages, 
    isLoading, 
    authLoading, 
    selectedExpense, 
    detailDialogOpen, 
    setDetailDialogOpen, 
    handleExpenseClick, 
    handleSendMessage,
    coParentInfo
  } = useCommunications();

  // Go to expense detail page
  const handleViewExpenseDetail = () => {
    if (selectedExpense) {
      navigate(`/expenses/${selectedExpense.id}`);
    }
    setDetailDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-famacle-blue-light/30">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12 max-w-6xl">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-famacle-slate mb-2">Communications</h1>
            <p className="text-gray-600">Keep all your co-parenting conversations organized and constructive</p>
          </div>
        </header>
        
        <Card className="p-6 shadow-lg border border-gray-100 relative">
          <ConversationHeader 
            recipient={coParentInfo.name} 
            status={coParentInfo.status}
            email={coParentInfo.email}
          />

          <div className="flex flex-col h-[600px]">
            <div className="flex-1 overflow-y-auto mb-4 pr-2">
              {authLoading || isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <p>Loading messages...</p>
                </div>
              ) : (
                <MessageList 
                  messages={messages} 
                  onExpenseClick={handleExpenseClick} 
                />
              )}
            </div>
            
            <MessageInput onSendMessage={handleSendMessage} />
          </div>
        </Card>
      </main>
      
      {/* Expense Detail Dialog */}
      {selectedExpense && (
        <ExpenseDetailDialog
          expense={selectedExpense}
          open={detailDialogOpen}
          onOpenChange={setDetailDialogOpen}
          onEdit={handleViewExpenseDetail}
        />
      )}
    </div>
  );
};

export default CommunicationsPage;
