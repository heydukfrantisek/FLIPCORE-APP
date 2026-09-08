/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Shell from './components/layout/Shell';
import { DashboardPage, InventoryPage, ReportsPage, FinancePage, SettingsPage, TasksPage, DocumentationPage } from './pages/Pages';

export default function App() {
  return (
    <BrowserRouter>
      <Shell>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/sklad" element={<InventoryPage />} />
          <Route path="/sestavy" element={<ReportsPage />} />
          <Route path="/finance" element={<FinancePage />} />
          <Route path="/ukoly" element={<TasksPage />} />
          <Route path="/nastaveni" element={<SettingsPage />} />
          <Route path="/dokumentace" element={<DocumentationPage />} />
        </Routes>
      </Shell>
    </BrowserRouter>
  );
}
