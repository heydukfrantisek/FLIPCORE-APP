import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Box, BarChart3, Wallet, Settings, 
  FileText, Terminal, ChevronRight, ChevronDown, Clock 
} from 'lucide-react';

export default function Shell({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isSettingsActive = location.pathname.startsWith('/nastaveni');
  
  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Sklad', path: '/sklad', icon: Box },
    { name: 'Sestavy', path: '/sestavy', icon: BarChart3 },
    { name: 'Finance', path: '/finance', icon: Wallet },
    { name: 'Úkoly', path: '/ukoly', icon: Clock },
    { 
      name: 'Nastavení', 
      path: '/nastaveni',
      icon: Settings,
      submenu: [
        { name: 'Diagnostika', path: '/nastaveni' },
        { name: 'Postup vývoje', path: '/nastaveni' },
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col">
        <h1 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2">
          <Terminal className="text-blue-600" /> FLIPCORE-OS
        </h1>
        <nav className="space-y-1 flex-grow">
          {navItems.map((item) => (
            <div key={item.name}>
              <div className="flex items-center justify-between">
                <Link to={item.path} className="flex-1 flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors">
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
                {item.submenu && (
                   <div className="px-2">
                     {isSettingsActive ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                   </div>
                )}
              </div>
              
              {item.submenu && isSettingsActive && (
                <div className="pl-12 space-y-1 mt-1 pb-2">
                  {item.submenu.map(sub => (
                    <Link key={sub.name} to={sub.path} className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-blue-600">
                      {sub.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
        <nav className="mt-auto pt-4 border-t border-gray-200">
          <Link to="/dokumentace" className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors">
            <FileText className="w-5 h-5" />
            Dokumentace
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
