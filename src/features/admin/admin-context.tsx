import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

export type Attraction = {
  id: string;
  name: string;
  category: string;
  description: string;
  location: string;
  pin: string;
  audioGuide: string;
};

const initialAttractions: Attraction[] = [
  {
    id: 'sigiriya',
    name: 'Sigiriya Ancient Fortress',
    category: 'Ancient Citadel',
    description:
      'Rising dramatically from the central plains, the fifth-century Sigiriya Fortress is a masterpiece of ancient Sri Lankan planning.',
    location: 'Matale District, Central Province, Sri Lanka',
    pin: '7.9570° N, 80.7603° E',
    audioGuide: 'sigiriya-cliff-entrance.mp3',
  },
  {
    id: 'temple-of-the-tooth',
    name: 'Temple of the Tooth Relic',
    category: 'Sacred Site',
    description:
      'A revered Buddhist temple in Kandy, home to the sacred tooth relic of the Buddha.',
    location: 'Kandy, Central Province, Sri Lanka',
    pin: '7.2936° N, 80.6413° E',
    audioGuide: '',
  },
  {
    id: 'yala',
    name: 'Yala National Park Safari',
    category: 'Wildlife Reserve',
    description:
      'Explore the varied landscapes and wildlife of Sri Lanka’s best-known national park.',
    location: 'Hambantota District, Southern Province, Sri Lanka',
    pin: '6.3725° N, 81.5185° E',
    audioGuide: '',
  },
  {
    id: 'dambulla',
    name: 'Dambulla Golden Temple',
    category: 'Rock Cave Complex',
    description:
      'A remarkable cave temple complex with centuries of Buddhist art and history.',
    location: 'Dambulla, Central Province, Sri Lanka',
    pin: '7.8567° N, 80.6492° E',
    audioGuide: '',
  },
];

type AdminContextValue = {
  attractions: Attraction[];
  addAttraction: (attraction: Omit<Attraction, 'id'>) => void;
  updateAttraction: (id: string, attraction: Omit<Attraction, 'id'>) => void;
};

const AdminContext = createContext<AdminContextValue | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [attractions, setAttractions] = useState(initialAttractions);

  const value = useMemo(
    () => ({
      attractions,
      addAttraction: (attraction: Omit<Attraction, 'id'>) => {
        setAttractions((current) => [
          ...current,
          { ...attraction, id: `attraction-${Date.now()}` },
        ]);
      },
      updateAttraction: (id: string, attraction: Omit<Attraction, 'id'>) => {
        setAttractions((current) =>
          current.map((item) => (item.id === id ? { ...attraction, id } : item)),
        );
      },
    }),
    [attractions],
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used inside AdminProvider');
  }
  return context;
}
