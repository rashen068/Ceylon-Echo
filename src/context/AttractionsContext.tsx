import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

import { subscribeToAttractions } from '@/services/attractionService';
import type { Attraction } from '@/services/attractionService';

type AttractionsContextValue = {
  attractions: Attraction[];
  isLoading: boolean;
  error: string | null;
};

const AttractionsContext = createContext<AttractionsContextValue | null>(null);

export function AttractionsProvider({ children }: { children: ReactNode }) {
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    let unsubscribe: (() => void) | undefined;

    void Promise.resolve()
      .then(() =>
        subscribeToAttractions(
          (nextAttractions) => {
            setAttractions(nextAttractions);
            setError(null);
            setIsLoading(false);
          },
          (loadError) => {
            setError(loadError.message);
            setIsLoading(false);
          },
        ),
      )
      .then((stop) => {
        if (active) {
          unsubscribe = stop;
        } else {
          stop();
        }
      })
      .catch((loadError: unknown) => {
        if (active) {
          setError(
            loadError instanceof Error ? loadError.message : 'Could not load attractions.',
          );
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
      unsubscribe?.();
    };
  }, []);

  const value = useMemo(
    () => ({ attractions, isLoading, error }),
    [attractions, isLoading, error],
  );

  return <AttractionsContext.Provider value={value}>{children}</AttractionsContext.Provider>;
}

export function useAttractionsContext() {
  const context = useContext(AttractionsContext);
  if (!context) {
    throw new Error('useAttractionsContext must be used inside AttractionsProvider');
  }
  return context;
}
