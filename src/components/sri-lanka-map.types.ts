export type MappedAttraction = {
  id: string;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
};

export type SriLankaMapProps = {
  attractions: MappedAttraction[];
  onAttractionPress: (id: string) => void;
  onRecenterReady: (recenter: () => void) => void;
};
