export interface DictionaryItem {
  name: string;
  shape: {
    modelPath: string;
    targetSize: number;
    unit: string;
  };
  taste: {
    sweet: number;
    sour: number;
    salty: number;
    bitter: number;
    umami: number;
  };
  color: {
    colorRegions: Array<{
      meshPath: string;
    }>;
  };
}
