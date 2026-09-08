
import React from 'react';
import { useCollection } from '../../hooks/useCollection';
import { Task, updateTaskStatus } from '../../modules/tasks/service';
import { CheckCircle, Circle } from 'lucide-react';
import { TaskForm } from './TaskForm';

export const TaskList = () => {
  const { data: tasks, loading } = useCollection<Task>('tasks');

  if (loading) return <div>Načítání úkolů...</div>;

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Úkoly</h2>
      <TaskForm />
      <div className="space-y-2">
        {tasks.map(task => (
          <div key={task.id} className="flex items-center justify-between p-2 border rounded">
            <span className={task.status === 'done' ? 'line-through text-gray-500' : ''}>{task.title}</span>
            <button onClick={() => updateTaskStatus(task.id!, task.status === 'done' ? 'todo' : 'done')}>
              {task.status === 'done' ? <CheckCircle className="text-green-500" /> : <Circle />}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
