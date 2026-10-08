import { useAttractionsContext } from '@/context/AttractionsContext';

export function useAttractions() {
  return useAttractionsContext();
}

export function useAttraction(id: string | undefined) {
  const { attractions, isLoading, error } = useAttractionsContext();
  const attraction = id ? attractions.find((item) => item.id === id) ?? null : null;

  return {
    attraction,
    isLoading,
    error:
      error ??
      (id
        ? !isLoading && !attraction
          ? 'This attraction could not be found.'
          : null
        : 'Choose an attraction to view its details.'),
  };
}
