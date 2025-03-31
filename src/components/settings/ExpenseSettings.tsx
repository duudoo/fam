
import { Separator } from '@/components/ui/separator';
import { ExpenseSettingsHeader } from './expense/ExpenseSettingsHeader';
import { DefaultSplitMethodForm } from './expense/DefaultSplitMethodForm';
import { CategoryManager } from './expense/CategoryManager';

const ExpenseSettings = () => {
  return (
    <div className="space-y-6">
      <ExpenseSettingsHeader />
      
      <DefaultSplitMethodForm />
      
      <Separator className="my-6" />
      
      <CategoryManager />
    </div>
  );
};

export default ExpenseSettings;
