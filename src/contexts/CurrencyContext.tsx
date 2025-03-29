
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type Currency = {
  code: string;
  symbol: string;
  name: string;
};

export const currencies: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'CAD', symbol: '$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: '$', name: 'Australian Dollar' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
  { code: 'MXN', symbol: '$', name: 'Mexican Peso' },
];

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  saveCurrencyPreference: (currencyCode: string) => Promise<void>;
  isLoading: boolean;
}

const defaultCurrency = currencies.find(c => c.code === 'USD') || currencies[0];

const CurrencyContext = createContext<CurrencyContextType>({
  currency: defaultCurrency,
  setCurrency: () => {},
  saveCurrencyPreference: async () => {},
  isLoading: false
});

export function useCurrency() {
  return useContext(CurrencyContext);
}

interface CurrencyProviderProps {
  children: ReactNode;
}

export function CurrencyProvider({ children }: CurrencyProviderProps) {
  const [currency, setCurrency] = useState<Currency>(defaultCurrency);
  const [isLoading, setIsLoading] = useState(false);

  // Load user's currency preference on initial load
  useEffect(() => {
    async function loadCurrencyPreference() {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('currency_preference')
            .eq('id', user.id)
            .single();
            
          if (error) throw error;
          
          if (data?.currency_preference) {
            const userCurrency = currencies.find(c => c.code === data.currency_preference);
            if (userCurrency) {
              setCurrency(userCurrency);
            }
          }
        } catch (error) {
          console.error('Error loading currency preference:', error);
        }
      }
    }
    
    loadCurrencyPreference();
  }, []);

  // Save user's currency preference
  const saveCurrencyPreference = async (currencyCode: string) => {
    setIsLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      const { error } = await supabase
        .from('profiles')
        .update({ currency_preference: currencyCode })
        .eq('id', user.id);
        
      if (error) throw error;
      
      // Update current currency state
      const newCurrency = currencies.find(c => c.code === currencyCode);
      if (newCurrency) {
        setCurrency(newCurrency);
      }
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error saving currency preference:', error);
      toast.error('Failed to save currency preference');
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CurrencyContext.Provider value={{ 
      currency, 
      setCurrency, 
      saveCurrencyPreference,
      isLoading 
    }}>
      {children}
    </CurrencyContext.Provider>
  );
}
