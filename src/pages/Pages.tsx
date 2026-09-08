import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { addInventoryItem, deleteInventoryItem, InventoryItem, getInventoryTotalValue } from '../modules/inventory/service';
import { Transaction, getFinanceSummary } from '../modules/finance/service';
import { InventoryForm } from '../components/inventory/InventoryForm';
import { DataTable, Column } from '../components/shared/DataTable';
import { useCollection } from '../hooks/useCollection';
import { ProgressBar } from '../components/shared/ProgressBar';
import { progressData } from '../data/progress';
import { TaskList } from '../components/tasks/TaskList';
import ReactMarkdown from 'react-markdown';
import llmsContent from '../../llms.txt?raw';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [showTasks, setShowTasks] = useState(localStorage.getItem('showTasks') !== 'false');

  const toggleTasks = () => {
    const next = !showTasks;
    setShowTasks(next);
    localStorage.setItem('showTasks', String(next));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex gap-3">
          <button 
            onClick={() => navigate('/sklad')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            + Přidat komponentu
          </button>
          <button 
            onClick={() => alert('Audit inzerátů zahájen... (tato funkce bude brzy dokončena)')}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Audit inzerátu
          </button>
        </div>
      </div>
      
      {/* Widget Settings */}
      <div className="bg-gray-100 p-4 rounded-lg">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={showTasks} onChange={toggleTasks} />
          Zobrazit úkoly na dashboardu
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title="Obrat (měsíc)" value="125 000 Kč" subtext="Cílová marže 25-35%" />
        <Card title="Zisk (měsíc)" value="37 500 Kč" subtext="Marže 30%" />
        <Card title="Vázaný kapitál" value="450 000 Kč" subtext="Hodnota skladu" />
        <Card title="Očekávaný zisk" value="112 500 Kč" subtext="Z neprodaného zboží" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Stav PC Sestav</h2>
          <p className="text-gray-600">V servisu: 3 | Připraveno: 2 | Inzerováno: 5</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Doprava a expedice</h2>
          <p className="text-gray-600">Odesláno (posledních 7 dní): 8</p>
        </div>
        {showTasks && <TaskList />}
      </div>
    </div>
  );
};

const InventoryPage = () => {
  const { data: items, loading } = useCollection<InventoryItem>('inventory');

  const handleAddItem = async (item: InventoryItem) => {
    await addInventoryItem(item);
  };

  const handleDeleteItem = async (id: string) => {
    if (confirm('Opravdu smazat?')) {
      await deleteInventoryItem(id);
    }
  };

  const columns: Column<InventoryItem>[] = [
    { header: 'SKU', accessor: (item) => item.sku },
    { header: 'Název', accessor: (item) => item.name },
    { header: 'Kategorie', accessor: (item) => item.category },
    { header: 'Stav', accessor: (item) => item.status },
    { header: 'Akce', accessor: (item) => <button onClick={() => handleDeleteItem(item.id!)} className="text-red-600 hover:text-red-800">Smazat</button> }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Sklad</h1>
      <InventoryForm onSubmit={handleAddItem} />
      {loading ? <p>Načítání...</p> : <DataTable columns={columns} data={items} />}
    </div>
  );
};

const FinancePage = () => {
  const { data: transactions, loading } = useCollection<Transaction>('transactions');

  const columns: Column<Transaction>[] = [
    { header: 'Datum', accessor: (t) => t.date.toLocaleDateString() },
    { header: 'Popis', accessor: (t) => t.description },
    { header: 'Typ', accessor: (t) => t.type },
    { header: 'Částka', accessor: (t) => <span className={t.type === 'sale' ? 'text-green-600' : 'text-red-600'}>{t.type === 'sale' ? '+' : '-'}{t.amount} CZK</span> }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Finance</h1>
      {loading ? <p>Načítání...</p> : <DataTable columns={columns} data={transactions} />}
    </div>
  );
};

const ReportsPage = () => {
  const [data, setData] = useState<{ inventoryValue: number, totalSales: number, totalExpenses: number }>({ inventoryValue: 0, totalSales: 0, totalExpenses: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [invValue, financeData] = await Promise.all([
        getInventoryTotalValue(),
        getFinanceSummary()
      ]);
      setData({ inventoryValue: invValue, ...financeData });
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Sestavy</h1>
      {loading ? <p>Načítání...</p> : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-sm font-medium text-gray-500">Celková hodnota skladu</h2>
            <p className="text-3xl font-bold text-gray-900">{data.inventoryValue} CZK</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-sm font-medium text-gray-500">Celkové příjmy</h2>
            <p className="text-3xl font-bold text-green-600">{data.totalSales} CZK</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-sm font-medium text-gray-500">Celkové náklady</h2>
            <p className="text-3xl font-bold text-red-600">{data.totalExpenses} CZK</p>
          </div>
        </div>
      )}
    </div>
  );
};

const SettingsPage = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Nastavení a správa</h1>
      
      {/* Diagnostika */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Diagnostika serveru a databáze</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-md font-semibold mb-2">Informace o serveru</h3>
            <p className="text-gray-600">Prostředí: {process.env.NODE_ENV || 'development'}</p>
            <p className="text-gray-600">Port: 3000</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-md font-semibold mb-2">Databáze (Firestore)</h3>
            <p className="text-gray-600">Projekt ID: ai-studio-flipcoreos</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm col-span-1 md:col-span-2">
            <h3 className="text-md font-semibold mb-2">Logy a chyby</h3>
            <p className="text-gray-600">Aktuálně žádné kritické chyby.</p>
          </div>
        </div>
      </section>

      {/* Postup vývoje */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Postup vývoje</h2>
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 font-semibold text-gray-900">Modul</th>
                <th className="p-4 font-semibold text-gray-900">Postup</th>
                <th className="p-4 font-semibold text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody>
              {progressData.map((item, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="p-4 font-medium text-gray-900">{item.name}</td>
                  <td className="p-4 w-64"><ProgressBar progress={item.progress} /></td>
                  <td className="p-4 text-gray-600 capitalize">{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

const TasksPage = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold text-gray-900">Úkoly</h1>
    <TaskList />
  </div>
);

const DocumentationPage = () => (
  <div className="space-y-4">
    <h1 className="text-2xl font-bold">Dokumentace</h1>
    <div className="markdown-body p-4 bg-white border border-gray-200 rounded-lg">
      <ReactMarkdown>{llmsContent}</ReactMarkdown>
    </div>
  </div>
);

export { DashboardPage, InventoryPage, ReportsPage, FinancePage, SettingsPage, TasksPage, DocumentationPage };
