
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowUpRight, 
  Bell, 
  Calendar, 
  ChevronRight, 
  CreditCard, 
  DollarSign, 
  FileText, 
  PieChart, 
  Plus, 
  Receipt,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockExpenses, mockEvents, mockNotifications, mockParents } from '@/utils/mockData';
import { format, parseISO, isToday } from 'date-fns';
import ExpenseCard from './ExpenseCard';
import { cn } from '@/lib/utils';

const Dashboard = () => {
  const [expenseTab, setExpenseTab] = useState('pending');
  
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
  
  const recentNotifications = mockNotifications
    .sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    })
    .slice(0, 3);
  
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-famacle-slate">Welcome to Famacle</h1>
          <p className="text-gray-500 mt-1">Simplifying co-parenting coordination</p>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild>
            <Link to="/expenses">
              <Plus className="w-4 h-4 mr-2" />
              Log Expense
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/calendar">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Event
            </Link>
          </Button>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="relative overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-gray-700 flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-famacle-blue" />
              Total Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-famacle-slate">${totalExpenses.toFixed(2)}</div>
            <p className="text-gray-500 text-sm">Last updated today</p>
          </CardContent>
          <div className="absolute top-0 right-0 p-3">
            <Avatar className="h-10 w-10 border-2 border-white">
              <AvatarImage src={mockParents[0].avatar} />
              <AvatarFallback>AJ</AvatarFallback>
            </Avatar>
          </div>
        </Card>
        
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
      </div>
      
      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Expenses Section */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl font-semibold">Recent Expenses</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/expenses" className="flex items-center text-famacle-blue">
                    View All 
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="pending" onValueChange={setExpenseTab}>
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="approved">Approved</TabsTrigger>
                  <TabsTrigger value="recent">Recent</TabsTrigger>
                </TabsList>
                <TabsContent value="pending" className="space-y-4">
                  {mockExpenses.filter(e => e.status === 'pending').map(expense => (
                    <ExpenseCard key={expense.id} expense={expense} />
                  ))}
                </TabsContent>
                <TabsContent value="approved" className="space-y-4">
                  {mockExpenses.filter(e => e.status === 'approved').map(expense => (
                    <ExpenseCard key={expense.id} expense={expense} />
                  ))}
                </TabsContent>
                <TabsContent value="recent" className="space-y-4">
                  {mockExpenses
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .slice(0, 3)
                    .map(expense => (
                      <ExpenseCard key={expense.id} expense={expense} />
                    ))}
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button asChild variant="outline" className="w-full">
                <Link to="/expenses/new">
                  <Plus className="w-4 h-4 mr-2" />
                  New Expense
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          {/* Monthly Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Monthly Summary</CardTitle>
              <CardDescription>Expense breakdown by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-famacle-blue mr-2"></div>
                      <span className="text-sm font-medium">Education</span>
                    </div>
                    <span className="text-sm font-medium">$150.00</span>
                  </div>
                  <Progress value={30} className="h-2 bg-gray-100" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-famacle-teal mr-2"></div>
                      <span className="text-sm font-medium">Medical</span>
                    </div>
                    <span className="text-sm font-medium">$250.00</span>
                  </div>
                  <Progress value={50} className="h-2 bg-gray-100" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-famacle-coral mr-2"></div>
                      <span className="text-sm font-medium">Activities</span>
                    </div>
                    <span className="text-sm font-medium">$100.00</span>
                  </div>
                  <Progress value={20} className="h-2 bg-gray-100" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button variant="outline" className="w-full">
                <PieChart className="w-4 h-4 mr-2" />
                View Full Report
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="space-y-6">
          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl font-semibold">Upcoming Events</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/calendar" className="flex items-center text-famacle-blue">
                    Calendar
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.map(event => {
                  const eventDate = parseISO(event.startDate);
                  const isEventToday = isToday(eventDate);
                  
                  return (
                    <div 
                      key={event.id} 
                      className={cn(
                        "p-3 rounded-lg border",
                        isEventToday 
                          ? "border-famacle-coral bg-famacle-coral-light/30" 
                          : "border-gray-200"
                      )}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">
                            {event.title}
                            {isEventToday && (
                              <Badge className="ml-2 bg-famacle-coral text-white">Today</Badge>
                            )}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {format(parseISO(event.startDate), 'EEE, MMM d')}
                            {!event.allDay && ` • ${format(parseISO(event.startDate), 'h:mm a')}`}
                          </p>
                          {event.location && (
                            <p className="text-sm text-gray-500 mt-1">{event.location}</p>
                          )}
                        </div>
                        <div className={cn(
                          "flex items-center justify-center rounded-full w-8 h-8",
                          event.priority === 'high' 
                            ? "bg-famacle-coral-light text-famacle-coral" 
                            : event.priority === 'medium'
                              ? "bg-famacle-blue-light text-famacle-blue"
                              : "bg-gray-100 text-gray-500"
                        )}>
                          {event.priority === 'high' ? (
                            <Bell className="w-4 h-4" />
                          ) : (
                            <Clock className="w-4 h-4" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {upcomingEvents.length === 0 && (
                  <div className="text-center py-6">
                    <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">No upcoming events</p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button asChild variant="outline" className="w-full">
                <Link to="/calendar/new">
                  <Plus className="w-4 h-4 mr-2" />
                  New Event
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          {/* Recent Notifications */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl font-semibold">Notifications</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/notifications" className="flex items-center text-famacle-blue">
                    View All
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentNotifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={cn(
                      "p-3 rounded-lg border flex items-start gap-3",
                      notification.read 
                        ? "border-gray-200" 
                        : "border-famacle-blue-light bg-famacle-blue-light/30"
                    )}
                  >
                    <div className={cn(
                      "flex items-center justify-center rounded-full w-8 h-8 shrink-0",
                      notification.type.includes('expense') 
                        ? "bg-famacle-blue-light text-famacle-blue" 
                        : "bg-famacle-coral-light text-famacle-coral"
                    )}>
                      {notification.type.includes('expense') ? (
                        <Receipt className="w-4 h-4" />
                      ) : (
                        <Bell className="w-4 h-4" />
                      )}
                    </div>
                    
                    <div>
                      <p className="text-sm">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {format(new Date(notification.createdAt), 'MMM d, h:mm a')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button asChild variant="outline" className="w-full">
                <Link to="/notifications">
                  <Bell className="w-4 h-4 mr-2" />
                  All Notifications
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
