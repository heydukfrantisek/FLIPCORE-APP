
export interface Task {
  id?: string;
  title: string;
  status: 'todo' | 'in-progress' | 'done';
  assignedTo?: string;
  createdAt: Date;
}

import { db } from '../../lib/firebase'; // Need to check where firebase is initialized
import { collection, addDoc, query, orderBy, onSnapshot, updateDoc, doc } from 'firebase/firestore';

const TASKS_COLLECTION = 'tasks';

export const addTask = async (task: Omit<Task, 'id'>) => {
  await addDoc(collection(db, TASKS_COLLECTION), task);
};

export const updateTaskStatus = async (id: string, status: 'todo' | 'in-progress' | 'done') => {
  await updateDoc(doc(db, TASKS_COLLECTION, id), { status });
};
