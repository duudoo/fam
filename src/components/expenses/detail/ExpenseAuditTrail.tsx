
import { ScrollArea } from "@/components/ui/scroll-area";
import { useExpenseAuditTrail } from "@/hooks/expenses/useExpenseAuditTrail";
import { formatDistanceToNow } from "date-fns";
import { Clock, CheckCircle, AlertTriangle, CheckSquare, Ban } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ExpenseStatus } from "@/utils/types";

interface ExpenseAuditTrailProps {
  expenseId: string;
}

const ExpenseAuditTrail = ({ expenseId }: ExpenseAuditTrailProps) => {
  const { auditTrail, isLoading } = useExpenseAuditTrail(expenseId);
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Activity History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!auditTrail || auditTrail.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Activity History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">No activity recorded yet.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Activity History</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[250px] pr-4">
          <div className="relative pl-6 border-l border-gray-200">
            {auditTrail.map((entry, index) => (
              <div key={entry.id} className="mb-4 relative">
                {/* Dot on timeline */}
                <div className="absolute -left-[25px] mt-1.5">
                  {getStatusIcon(entry.status)}
                </div>
                
                {/* Entry content */}
                <div className="ml-2">
                  <div className="flex items-start justify-between">
                    <div className="font-medium text-sm text-famacle-slate">
                      {getStatusLabel(entry.status)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(entry.timestamp), { addSuffix: true })}
                    </div>
                  </div>
                  
                  {entry.note && (
                    <div className="text-sm text-gray-600 mt-1">
                      {entry.note}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

const getStatusIcon = (status: ExpenseStatus | string) => {
  switch(status) {
    case 'pending':
      return <Clock className="h-4 w-4 text-amber-500" />;
    case 'approved':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'disputed':
      return <AlertTriangle className="h-4 w-4 text-orange-500" />;
    case 'paid':
      return <CheckSquare className="h-4 w-4 text-blue-500" />;
    case 'deleted':
      return <Ban className="h-4 w-4 text-red-500" />;
    default:
      return <Clock className="h-4 w-4 text-gray-500" />;
  }
};

const getStatusLabel = (status: ExpenseStatus | string) => {
  switch(status) {
    case 'pending':
      return 'Expense Pending';
    case 'approved':
      return 'Expense Approved';
    case 'disputed':
      return 'Expense Needs Clarification';
    case 'paid':
      return 'Expense Paid';
    case 'deleted':
      return 'Expense Deleted';
    default:
      return `Status: ${status}`;
  }
};

export default ExpenseAuditTrail;
