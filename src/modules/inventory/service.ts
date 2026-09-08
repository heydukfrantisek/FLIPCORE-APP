import { db } from "../../lib/firebase";
import { collection, getDocs, addDoc, query, orderBy, deleteDoc, doc, updateDoc } from "firebase/firestore";

export interface InventoryItem {
  id?: string;
  sku: string;
  name: string;
  category: string;
  status: 'A+' | 'A' | 'B' | 'C' | 'D';
  purchasePrice: number;
  salePrice: number;
  createdAt: Date;
}

const COLLECTION_NAME = "inventory";

export const getInventoryItems = async (): Promise<InventoryItem[]> => {
  const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as InventoryItem));
};

export const addInventoryItem = async (item: InventoryItem) => {
  return await addDoc(collection(db, COLLECTION_NAME), {
    ...item,
    createdAt: new Date(),
  });
};

export const deleteInventoryItem = async (id: string) => {
  return await deleteDoc(doc(db, COLLECTION_NAME, id));
};

export const updateInventoryItem = async (id: string, item: Partial<InventoryItem>) => {
  return await updateDoc(doc(db, COLLECTION_NAME, id), item);
};

export const getInventoryTotalValue = async (): Promise<number> => {
  const items = await getInventoryItems();
  return items.reduce((sum, item) => sum + item.purchasePrice, 0);
};
