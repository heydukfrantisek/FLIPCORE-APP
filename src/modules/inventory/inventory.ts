export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  status: 'A+' | 'A' | 'B' | 'C' | 'D';
}

export const getInventory = (): InventoryItem[] => {
  return [];
};
