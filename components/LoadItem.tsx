import React, { useState } from 'react';
import { Carga, LoadStatus } from '../types';

interface LoadItemProps {
  load: Carga;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

// Helper function to check if a date is today
const isToday = (someDate: Date): boolean => {
    if (!(someDate instanceof Date) || isNaN(someDate.getTime())) return false;
    const today = new Date();
    return someDate.getDate() === today.getDate() &&
           someDate.getMonth() === today.getMonth() &&
           someDate.getFullYear() === today.getFullYear();
};

// Helper function to check if a date is older than a certain number of days
const isOlderThan = (someDate: Date, days: number): boolean => {
    if (!(someDate instanceof Date) || isNaN(someDate.getTime())) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today to the start of the day
    
    const pastDate = new Date(today);
    pastDate.setDate(pastDate.getDate() - days);

    // Normalize someDate to the start of the day for accurate comparison
    const checkDate = new Date(someDate);
    checkDate.setHours(0, 0, 0, 0);

    return checkDate < pastDate;
}


const formatDateTime = (date: Date): string => {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
      return 'Invalid Date';
  }
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

const LoadItem: React.FC<LoadItemProps> = ({ load, onDelete, onToggleStatus }) => {
  const isPending = load.status === LoadStatus.Pending;
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(load.cargaId);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  const isLoadForToday = isToday(load.dateTime);
  const isLoadOld = isOlderThan(load.dateTime, 5);

  const statusIndicatorClass = isPending 
    ? (isLoadForToday ? 'bg-blue-500' : 'bg-transparent')
    : 'bg-green-500';

  const dateClass = isPending && isLoadOld 
    ? 'text-red-400 font-medium' 
    : 'text-gray-500';


  return (
    <li className={`flex items-center justify-between p-4 border-b border-gray-700 transition-all duration-300 ${
        !isPending 
        ? 'bg-gradient-to-r from-green-900/70 to-green-900/40' 
        : 'bg-gray-800 hover:bg-gray-700/50'
    }`}>
      <div className="flex flex-col space-y-1">
        <div className="flex items-center space-x-3">
          <span 
            className="font-mono text-indigo-400 font-bold text-lg cursor-pointer hover:text-indigo-300 transition-colors"
            onClick={handleCopy}
            title="Copiar número da carga"
          >
            {copied ? 'Copiado!' : load.cargaId}
          </span>
          <span className="font-mono text-gray-300 text-xl font-bold">{load.lojaId}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <span
            className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${statusIndicatorClass}`}
            title={isPending && isLoadForToday ? 'Pendente para hoje' : (isPending ? 'Pendente' : 'Finalizado')}
          ></span>
          <span className={dateClass}>{formatDateTime(load.dateTime)}</span>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button
            onClick={() => onToggleStatus(load.id)}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                isPending
                ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                : 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'
            }`}
        >
            {isPending ? 'Finalizar' : 'Reabrir'}
        </button>
        <button
          onClick={() => onDelete(load.id)}
          className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 focus:ring-offset-gray-900 transition-all duration-200"
        >
          Excluir
        </button>
      </div>
    </li>
  );
};

export default LoadItem;