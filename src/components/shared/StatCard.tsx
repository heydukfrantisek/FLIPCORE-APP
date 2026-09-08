import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  subtext?: string;
  color?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, subtext, color = 'text-gray-900' }) => (
  <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
    <h2 className="text-sm font-medium text-gray-500">{title}</h2>
    <p className={`text-3xl font-bold ${color}`}>{value}</p>
    {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
  </div>
);
