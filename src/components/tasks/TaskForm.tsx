import React, { useState } from 'react';
import { addTask } from '../../modules/tasks/service';

export const TaskForm = () => {
  const [title, setTitle] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    await addTask({
      title,
      status: 'todo',
      createdAt: new Date(),
    });
    setTitle('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Nový úkol..."
        className="flex-grow p-2 border border-gray-300 rounded-lg"
      />
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Přidat</button>
    </form>
  );
};
