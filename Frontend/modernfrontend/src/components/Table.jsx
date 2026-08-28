import React from "react";
import { PencilIcon, TrashIcon, EyeIcon } from "@heroicons/react/24/outline";

const Table = ({ columns, data, onEdit, onView, onDelete, customActions }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 text-xs">
        No data available
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto border-collapse divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                style={{ width: column.width || "auto" }}
                className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
              >
                {column.label || column.header}
              </th>
            ))}
            {(onEdit || onView || onDelete || customActions) && (
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50 transition-colors">
              {columns.map((column, colIndex) => (
                <td
                  key={colIndex}
                  style={{ width: column.width || "auto" }}
                  className="px-3 py-2 text-xs text-gray-900 align-middle"
                >
                  {column.render
                    ? column.render(row)
                    : row[column.key || column.accessor]}
                </td>
              ))}
              {(onEdit || onView || onDelete || customActions) && (
                <td className="px-4 py-2.5 whitespace-nowrap text-right text-xs font-medium">
                  <div className="flex justify-end gap-1.5">
                    {onView && (
                      <button
                        onClick={() => onView(row)}
                        className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                        title="View"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                    )}
                    {onEdit && (
                      <button
                        onClick={() => onEdit(row)}
                        className="p-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded transition-colors"
                        title="Edit"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                    )}
                    {customActions && customActions(row)}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(row)}
                        className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                        title="Delete"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
