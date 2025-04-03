
import ExpenseTotalCard from './cards/ExpenseTotalCard';
import PendingExpensesCard from './cards/PendingExpensesCard';
import SummaryCardsLoading from './cards/SummaryCardsLoading';
import { useSummaryData } from '@/hooks/useSummaryData';

const SummaryCards = () => {
  const { loading, totalExpenses, pendingExpenses } = useSummaryData();

  if (loading) {
    return <SummaryCardsLoading />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <ExpenseTotalCard total={totalExpenses} />
      <PendingExpensesCard pendingExpenses={pendingExpenses} />
    </div>
  );
};

export default SummaryCards;
