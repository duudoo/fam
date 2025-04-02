
import { useEffect, useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import UserSettings from '@/components/settings/UserSettings';
import FamilyCircleSettings from '@/components/settings/FamilyCircleSettings';
import CurrencySettings from '@/components/settings/CurrencySettings';
import ExpenseSettings from '@/components/settings/ExpenseSettings';
import NotificationSettings from '@/components/settings/NotificationSettings';
import CalendarSyncSettings from '@/components/calendar/CalendarSyncSettings';
import { Spinner } from '@/components/ui/spinner';
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import { Circle, Calendar, Settings as SettingsIcon, Bell, DollarSign, Calculator } from 'lucide-react';

const SettingsPage = () => {
  const { user, loading } = useAuth();
  const [selectedTab, setSelectedTab] = useState('user');

  // Redirect to appropriate tab if specified in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab && ['user', 'circle', 'currency', 'expenses', 'notifications', 'calendar'].includes(tab)) {
      setSelectedTab(tab);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto py-6 text-center">
        <p>Please sign in to access settings</p>
      </div>
    );
  }

  return (
    <CurrencyProvider>
      <div className="container mx-auto py-6 pt-24">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-famacle-slate">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>

        <Tabs defaultValue={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
          <TabsList className="grid grid-cols-2 md:grid-cols-6 gap-2">
            <TabsTrigger value="user" className="flex items-center gap-2">
              <SettingsIcon className="h-4 w-4" />
              <span className="hidden md:inline">User</span>
              <span className="md:hidden">User</span>
            </TabsTrigger>
            <TabsTrigger value="circle" className="flex items-center gap-2">
              <Circle className="h-4 w-4" />
              <span className="hidden md:inline">Circle</span>
              <span className="md:hidden">Circle</span>
            </TabsTrigger>
            <TabsTrigger value="currency" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              <span className="hidden md:inline">Currency</span>
              <span className="md:hidden">Currency</span>
            </TabsTrigger>
            <TabsTrigger value="expenses" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              <span className="hidden md:inline">Expenses</span>
              <span className="md:hidden">Expenses</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden md:inline">Notifications</span>
              <span className="md:hidden">Notif.</span>
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden md:inline">Calendar</span>
              <span className="md:hidden">Calendar</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="user" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Settings</CardTitle>
                <CardDescription>
                  Manage your profile and personal information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UserSettings />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="circle" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Circle className="h-5 w-5 text-famacle-blue" />
                  <span>Your Circle</span>
                </CardTitle>
                <CardDescription>
                  Manage your children and co-parents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FamilyCircleSettings />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="currency" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Currency Settings</CardTitle>
                <CardDescription>
                  Customize the currency used throughout the application
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CurrencySettings />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="expenses" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Expense Settings</CardTitle>
                <CardDescription>
                  Configure your default expense split methods and categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ExpenseSettings />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Customize how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <NotificationSettings />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="calendar" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-famacle-blue" />
                  <span>Calendar Settings</span>
                </CardTitle>
                <CardDescription>
                  Connect and synchronize your external calendars
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CalendarSyncSettings />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </CurrencyProvider>
  );
};

export default SettingsPage;
