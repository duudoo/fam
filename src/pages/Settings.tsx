
import { useEffect, useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import UserSettings from '@/components/settings/UserSettings';
import CurrencySettings from '@/components/settings/CurrencySettings';
import ExpenseSettings from '@/components/settings/ExpenseSettings';
import NotificationSettings from '@/components/settings/NotificationSettings';
import { Spinner } from '@/components/ui/spinner';
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import { Circle } from 'lucide-react';

const SettingsPage = () => {
  const { user, loading } = useAuth();
  const [selectedTab, setSelectedTab] = useState('user');

  // Redirect to appropriate tab if specified in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab && ['user', 'circle', 'currency', 'expenses', 'notifications'].includes(tab)) {
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
          <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2">
            <TabsTrigger value="user">User Settings</TabsTrigger>
            <TabsTrigger value="circle">Circle</TabsTrigger>
            <TabsTrigger value="currency">Currency</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
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
                <iframe 
                  src="/user-management" 
                  className="w-full min-h-[70vh] border-none" 
                  title="Circle Management"
                />
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
        </Tabs>
      </div>
    </CurrencyProvider>
  );
};

export default SettingsPage;
