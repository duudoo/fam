
import { DollarSign, FileText, Calendar, CreditCard, Bell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format, parseISO } from 'date-fns';
import { mockEvents, mockExpenses, mockParents } from '@/utils/mockData';
import { Event, Expense } from '@/utils/types';

const SummaryCards = () => {
  const totalExpenses = mockExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const pendingExpenses = mockExpenses.filter(exp => exp.status === 'pending');
  const upcomingEvents = mockEvents
    .filter(event => {
      const eventDate = parseISO(event.startDate);
      return eventDate >= new Date();
    })
    .sort((a, b) => {
      return parseISO(a.startDate).getTime() - parseISO(b.startDate).getTime();
    })
    .slice(0, 3);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <ExpenseTotalCard total={totalExpenses} />
      <PendingExpensesCard pendingExpenses={pendingExpenses} />
      <UpcomingEventsCard upcomingEvents={upcomingEvents} />
    </div>
  );
};

interface ExpenseTotalCardProps {
  total: number;
}

const ExpenseTotalCard = ({ total }: ExpenseTotalCardProps) => (
  <Card className="relative overflow-hidden">
    <CardHeader className="pb-2">
      <CardTitle className="text-lg font-medium text-gray-700 flex items-center">
        <DollarSign className="w-5 h-5 mr-2 text-famacle-blue" />
        Total Expenses
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold text-famacle-slate">${total.toFixed(2)}</div>
      <p className="text-gray-500 text-sm">Last updated today</p>
    </CardContent>
    <div className="absolute top-0 right-0 p-3">
      <Avatar className="h-10 w-10 border-2 border-white">
        <AvatarImage src={mockParents[0].avatar} />
        <AvatarFallback>AJ</AvatarFallback>
      </Avatar>
    </div>
  </Card>
);

interface PendingExpensesCardProps {
  pendingExpenses: Expense[];
}

const PendingExpensesCard = ({ pendingExpenses }: PendingExpensesCardProps) => (
  <Card className="relative overflow-hidden">
    <CardHeader className="pb-2">
      <CardTitle className="text-lg font-medium text-gray-700 flex items-center">
        <FileText className="w-5 h-5 mr-2 text-famacle-teal" />
        Pending Approval
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold text-famacle-slate">{pendingExpenses.length}</div>
      <p className="text-gray-500 text-sm">
        {pendingExpenses.length > 0 
          ? `$${pendingExpenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)} pending`
          : 'No pending expenses'}
      </p>
    </CardContent>
    <div className="absolute top-0 right-0 p-3">
      <CreditCard className="w-6 h-6 text-famacle-teal" />
    </div>
  </Card>
);

interface UpcomingEventsCardProps {
  upcomingEvents: Event[];
}

const UpcomingEventsCard = ({ upcomingEvents }: UpcomingEventsCardProps) => (
  <Card className="relative overflow-hidden">
    <CardHeader className="pb-2">
      <CardTitle className="text-lg font-medium text-gray-700 flex items-center">
        <Calendar className="w-5 h-5 mr-2 text-famacle-coral" />
        Upcoming Events
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold text-famacle-slate">{upcomingEvents.length}</div>
      <p className="text-gray-500 text-sm">
        Next: {upcomingEvents.length > 0 
          ? format(parseISO(upcomingEvents[0].startDate), 'MMM d')
          : 'No upcoming events'}
      </p>
    </CardContent>
    <div className="absolute top-0 right-0 p-3">
      <Bell className="w-6 h-6 text-famacle-coral" />
    </div>
  </Card>
);

export default SummaryCards;
