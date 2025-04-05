import { Card, CardContent } from '@/components/ui/card';
import { Expense, ExpenseCategory } from '@/utils/types';
import { formatCurrency } from '@/utils/expenseUtils';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell, PieChart, Pie, Legend } from 'recharts';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useChildren } from '@/hooks/children';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';

interface ExpenseOverviewProps {
  expenses: Expense[] | undefined;
}

const ExpenseOverview = ({ expenses = [] }: ExpenseOverviewProps) => {
  const { currency } = useCurrency();
  const { data: children = [] } = useChildren();
  const [activeTab, setActiveTab] = useState('category');
  
  const getChildAllocation = (expense: Expense, childId: string): number => {
    if (expense.childSplitAmounts && expense.childSplitAmounts[childId]) {
      return expense.childSplitAmounts[childId];
    }
    
    if (expense.childIds && expense.childIds.length > 0) {
      return expense.amount / expense.childIds.length;
    }
    
    return 0;
  };
  
  const totalExpenses = expenses ? expenses.reduce((sum, expense) => sum + expense.amount, 0) : 0;
  
  const expensesByCategory: Record<string, number> = {};
  if (expenses && expenses.length > 0) {
    expenses.forEach((expense) => {
      const { category } = expense;
      expensesByCategory[category] = (expensesByCategory[category] || 0) + expense.amount;
    });
  }
  
  const expensesByChild: Record<string, number> = {};
  if (expenses && expenses.length > 0 && children.length > 0) {
    expenses.forEach((expense) => {
      if (expense.childIds && expense.childIds.length > 0) {
        expense.childIds.forEach(childId => {
          const childAmount = getChildAllocation(expense, childId);
          expensesByChild[childId] = (expensesByChild[childId] || 0) + childAmount;
        });
      }
    });
  }
  
  const categoryChartData = Object.entries(expensesByCategory).map(([category, amount]) => ({
    category,
    amount,
    color: getCategoryColorHex(category as ExpenseCategory)
  }));
  
  const childChartData = Object.entries(expensesByChild).map(([childId, amount]) => {
    const child = children.find(c => c.id === childId);
    return {
      name: child ? (child.name || child.initials) : childId,
      value: amount,
      color: getRandomChildColorHex(childId)
    };
  });

  return (
    <Card className="w-full mb-6">
      <CardContent className="pt-6">
        <Tabs defaultValue="category" value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="category">By Category</TabsTrigger>
            <TabsTrigger value="child">By Child</TabsTrigger>
          </TabsList>
        </Tabs>
      
        <TabsContent value="category" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <h3 className="text-lg font-medium mb-3">Expense Summary</h3>
              <p className="text-3xl font-bold mb-1">
                {formatCurrency(totalExpenses, currency.symbol)}
              </p>
              <p className="text-sm text-gray-500">
                {expenses?.length || 0} total expenses
              </p>
              
              <div className="mt-4 space-y-3">
                {categoryChartData.map(({ category, amount }) => (
                  <div key={category}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="capitalize">{category}</span>
                      <span className="font-medium">{formatCurrency(amount, currency.symbol)}</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getCategoryColorClass(category as ExpenseCategory)}`}
                        style={{ width: `${(amount / totalExpenses) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="lg:col-span-2 pt-12">
              {categoryChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={categoryChartData} margin={{ top: 0, right: 20, left: 10, bottom: 5 }}>
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => formatCurrency(value as number, currency.symbol)}
                      labelFormatter={(label) => label.charAt(0).toUpperCase() + label.slice(1)}
                    />
                    <Bar
                      dataKey="amount"
                      name="Amount"
                      radius={[4, 4, 0, 0]}
                      isAnimationActive={true}
                    >
                      {categoryChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No expense data to display
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="child" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <h3 className="text-lg font-medium mb-3">Expense by Child</h3>
              <p className="text-3xl font-bold mb-1">
                {formatCurrency(totalExpenses, currency.symbol)}
              </p>
              <p className="text-sm text-gray-500">
                {Object.keys(expensesByChild).length} children with expenses
              </p>
              
              <div className="mt-4 space-y-3">
                {childChartData.map(({ name, value, color }) => (
                  <div key={name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{name}</span>
                      <span className="font-medium">{formatCurrency(value, currency.symbol)}</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full"
                        style={{ 
                          width: `${(value / totalExpenses) * 100}%`,
                          backgroundColor: color 
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="lg:col-span-2 pt-12">
              {childChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={childChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                    >
                      {childChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => formatCurrency(value as number, currency.symbol)}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No child expense data to display
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </CardContent>
    </Card>
  );
};

const getCategoryColorClass = (category: ExpenseCategory): string => {
  const categoryColors: Record<ExpenseCategory, string> = {
    medical: 'bg-red-500',
    education: 'bg-blue-500',
    clothing: 'bg-purple-500',
    activities: 'bg-green-500',
    food: 'bg-orange-500',
    other: 'bg-gray-500',
  };
  
  return categoryColors[category] || 'bg-gray-500';
};

const getCategoryColorHex = (category: ExpenseCategory): string => {
  const categoryHexColors: Record<ExpenseCategory, string> = {
    medical: '#ef4444',   // red-500
    education: '#3b82f6', // blue-500
    clothing: '#a855f7',  // purple-500
    activities: '#22c55e', // green-500
    food: '#f97316',      // orange-500
    other: '#6b7280',     // gray-500
  };
  
  return categoryHexColors[category] || '#6b7280';
};

const getRandomChildColorHex = (childId: string): string => {
  const colors = [
    '#3b82f6', // blue
    '#ef4444', // red
    '#22c55e', // green
    '#a855f7', // purple
    '#f97316', // orange
    '#0ea5e9', // sky
    '#f59e0b', // amber
    '#ec4899', // pink
    '#10b981', // emerald
    '#6366f1'  // indigo
  ];
  
  const lastChar = childId.charCodeAt(childId.length - 1);
  const colorIndex = lastChar % colors.length;
  
  return colors[colorIndex];
};

export default ExpenseOverview;
