import React from 'react';

export const Card = ({ title, value, subtext }: { title: string; value: string; subtext?: string }) => (
  <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
    <h3 className="text-sm font-medium text-gray-500">{title}</h3>
    <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
    {subtext && <p className="text-sm text-gray-500 mt-1">{subtext}</p>}
  </div>
);
