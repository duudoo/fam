
import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Expense } from '@/utils/types';
import { useChildren } from '@/hooks/children';
import { format } from 'date-fns';
import CategoryBadge from '../CategoryBadge';
import StatusBadge from '../StatusBadge';
import { useCurrency } from '@/contexts/CurrencyContext';
import { formatCurrency } from '@/utils/expenseUtils';

interface ChildExpenseReportProps {
  expenses: Expense[] | undefined;
}

const ChildExpenseReport = ({ expenses = [] }: ChildExpenseReportProps) => {
  const { data: children = [] } = useChildren();
  const [selectedChildId, setSelectedChildId] = useState<string>("");
  const [childExpenses, setChildExpenses] = useState<Expense[]>([]);
  const { currency } = useCurrency();
  
  useEffect(() => {
    if (selectedChildId && expenses) {
      const filtered = expenses.filter(expense => 
        expense.childIds?.includes(selectedChildId)
      );
      setChildExpenses(filtered);
    } else {
      setChildExpenses([]);
    }
  }, [selectedChildId, expenses]);
  
  const totalAmount = childExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  if (children.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Child Expense Report</CardTitle>
          <CardDescription>No children found. Add children to view expense reports.</CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Child Expense Report</CardTitle>
        <CardDescription>View expenses by child</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <label className="text-sm font-medium">Select Child</label>
          <Select value={selectedChildId} onValueChange={setSelectedChildId}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select a child" />
            </SelectTrigger>
            <SelectContent>
              {children.map(child => (
                <SelectItem key={child.id} value={child.id}>
                  {child.name || child.initials}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {selectedChildId && (
          <>
            <div className="mb-4">
              <h3 className="text-lg font-medium">
                Total: {formatCurrency(totalAmount, currency.symbol)}
              </h3>
              <p className="text-sm text-gray-500">
                {childExpenses.length} expense{childExpenses.length !== 1 ? 's' : ''}
              </p>
            </div>
            
            {childExpenses.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {childExpenses.map(expense => (
                      <TableRow key={expense.id}>
                        <TableCell className="font-medium">{expense.description}</TableCell>
                        <TableCell>{formatCurrency(expense.amount, currency.symbol)}</TableCell>
                        <TableCell>{format(new Date(expense.date), 'MMM d, yyyy')}</TableCell>
                        <TableCell><CategoryBadge category={expense.category} /></TableCell>
                        <TableCell><StatusBadge status={expense.status} /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No expenses found for this child</p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ChildExpenseReport;
