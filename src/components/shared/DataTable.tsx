import React from 'react';

export interface Column<T> {
  header: string;
  accessor: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
}

export const DataTable = <T,>({ columns, data }: DataTableProps<T>) => (
  <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
    <table className="w-full text-left">
      <thead className="bg-gray-50 border-b border-gray-200">
        <tr>
          {columns.map((col, i) => <th key={i} className="p-4 font-semibold text-gray-900">{col.header}</th>)}
        </tr>
      </thead>
      <tbody>
        {data.map((item, i) => (
          <tr key={i} className="border-b border-gray-100">
            {columns.map((col, j) => <td key={j} className="p-4 text-gray-600">{col.accessor(item)}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
