import { db } from "../../lib/firebase";
import { collection, getDocs, addDoc, query, orderBy, Timestamp } from "firebase/firestore";

export interface Transaction {
  id?: string;
  type: 'sale' | 'expense';
  amount: number;
  description: string;
  date: Date;
  itemId?: string;
}

const COLLECTION_NAME = "transactions";

export const getTransactions = async (): Promise<Transaction[]> => {
  const q = query(collection(db, COLLECTION_NAME), orderBy("date", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return { 
      id: doc.id, 
      ...data,
      date: (data.date as Timestamp).toDate()
    } as Transaction;
  });
};

export const addTransaction = async (transaction: Transaction) => {
  return await addDoc(collection(db, COLLECTION_NAME), {
    ...transaction,
    date: Timestamp.fromDate(transaction.date),
  });
};

export const getFinanceSummary = async (): Promise<{ totalSales: number, totalExpenses: number }> => {
  const transactions = await getTransactions();
  const totalSales = transactions.filter(t => t.type === 'sale').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  return { totalSales, totalExpenses };
};
