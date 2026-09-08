import React, { useState } from 'react';
import { InventoryItem } from '../../modules/inventory/service';

export const InventoryForm = ({ onSubmit }: { onSubmit: (item: InventoryItem) => void }) => {
  const [formData, setFormData] = useState<Omit<InventoryItem, 'createdAt'>>({
    sku: '',
    name: '',
    category: '',
    status: 'A+',
    purchasePrice: 0,
    salePrice: 0
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'purchasePrice' || name === 'salePrice' ? Number(value) : value }));
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData as InventoryItem); }} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <input name="sku" placeholder="SKU" onChange={handleChange} className="border p-2 rounded" required />
        <input name="name" placeholder="Název" onChange={handleChange} className="border p-2 rounded" required />
        <input name="category" placeholder="Kategorie" onChange={handleChange} className="border p-2 rounded" required />
        <select name="status" onChange={handleChange} className="border p-2 rounded">
          {['A+', 'A', 'B', 'C', 'D'].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <input name="purchasePrice" type="number" placeholder="Nákupní cena" onChange={handleChange} className="border p-2 rounded" required />
        <input name="salePrice" type="number" placeholder="Prodejní cena" onChange={handleChange} className="border p-2 rounded" required />
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Přidat položku</button>
    </form>
  );
};
