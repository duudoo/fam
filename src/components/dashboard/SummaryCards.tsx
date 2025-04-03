
import ExpenseTotalCard from './cards/ExpenseTotalCard';
import PendingExpensesCard from './cards/PendingExpensesCard';
import SummaryCardsLoading from './cards/SummaryCardsLoading';
import { useSummaryData } from '@/hooks/useSummaryData';
import UpcomingEventsCard from './cards/UpcomingEventsCard';

const SummaryCards = () => {
  const { loading, totalExpenses, pendingExpenses, upcomingEvents } = useSummaryData();

  if (loading) {
    return <SummaryCardsLoading />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <ExpenseTotalCard total={totalExpenses} />
      <PendingExpensesCard pendingExpenses={pendingExpenses} />
      <UpcomingEventsCard upcomingEvents={upcomingEvents} />
    </div>
  );
};

export default SummaryCards;
