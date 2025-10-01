import React from 'react';
import { Carga } from '../types';
import LoadItem from './LoadItem';

interface LoadListProps {
  loads: Carga[];
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

const LoadList: React.FC<LoadListProps> = ({ loads, onDelete, onToggleStatus }) => {
  if (loads.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        Nenhuma carga para exibir. Cole os dados acima e clique em "Adicionar Cargas".
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700">
      <div className="flex items-center justify-between bg-gray-900/70 p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
        <span>CARGA / LOJA</span>
        <span>Ações</span>
      </div>
      <ul>
        {loads.map((load) => (
          <LoadItem
            key={load.id}
            load={load}
            onDelete={onDelete}
            onToggleStatus={onToggleStatus}
          />
        ))}
      </ul>
    </div>
  );
};

export default LoadList;