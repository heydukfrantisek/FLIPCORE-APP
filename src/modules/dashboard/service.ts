import { db } from '../../lib/firebase';
import { collection, getDocs, updateDoc, doc, deleteDoc, addDoc, onSnapshot } from 'firebase/firestore';

export interface DashboardWidget {
  id?: string;
  header: string;
  type: 'card' | 'text';
  content: string;
  enabled: boolean;
  order: number;
}

const WIDGETS_COLLECTION = 'dashboard_widgets';

export const getWidgets = async () => {
  const querySnapshot = await getDocs(collection(db, WIDGETS_COLLECTION));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DashboardWidget));
};

export const updateWidget = async (widget: DashboardWidget) => {
  const { id, ...data } = widget;
  if (id) {
    await updateDoc(doc(db, WIDGETS_COLLECTION, id), data);
  } else {
    await addDoc(collection(db, WIDGETS_COLLECTION), data);
  }
};

export const deleteWidget = async (id: string) => {
  await deleteDoc(doc(db, WIDGETS_COLLECTION, id));
};
