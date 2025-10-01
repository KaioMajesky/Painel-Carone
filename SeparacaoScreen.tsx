import React, { useState, useMemo, useCallback } from 'react';
import { Carga, LoadStatus } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import LoadList from './components/LoadList';

const parseDateTime = (dateTimeStr: string): Date | null => {
    if (!dateTimeStr) return null;
    const parts = dateTimeStr.match(/^(\d{2})\/(\d{2})\/(\d{4})\s(\d{2}):(\d{2})$/);
    if (!parts) return null;
    const [, day, month, year, hour, minute] = parts;
    // Month is 0-indexed in JS Date constructor
    return new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute));
};


const SeparacaoScreen: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [loads, setLoads] = useLocalStorage<Carga[]>('cargas', []);
  const [filterStore, setFilterStore] = useState<string>('all');

  const stores = useMemo(() => {
    const storeSet = new Set(loads.map(load => load.lojaId));
    return ['all', ...Array.from(storeSet).sort()];
  }, [loads]);

  const handleAddLoads = useCallback(() => {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    const newLoads: Carga[] = [];

    lines.forEach(line => {
      // Use a regex to split by tab or multiple spaces, to handle different paste formats.
      const columns = line.trim().split(/\t| {2,}/);
      if (columns.length >= 5) {
        const dateTime = parseDateTime(columns[0]);
        const cargaId = columns[2]?.trim();
        const lojaId = columns[4]?.trim();

        if (dateTime && cargaId && lojaId) {
          // Avoid adding duplicates
          const exists = loads.some(l => l.cargaId === cargaId) || newLoads.some(l => l.cargaId === cargaId);
          if (!exists) {
            newLoads.push({
              id: `${cargaId}-${Date.now()}`,
              cargaId,
              lojaId,
              dateTime,
              status: LoadStatus.Pending,
            });
          }
        }
      }
    });

    if (newLoads.length > 0) {
      setLoads(prevLoads => [...prevLoads, ...newLoads]);
    }
    setText('');
  }, [text, loads, setLoads]);

  const handleDeleteAll = useCallback(() => {
    if (window.confirm('Tem certeza que deseja excluir todas as cargas?')) {
      setLoads([]);
    }
  }, [setLoads]);

  const handleDelete = useCallback((id: string) => {
    setLoads(prevLoads => prevLoads.filter(load => load.id !== id));
  }, [setLoads]);
  
  const handleToggleStatus = useCallback((id: string) => {
    setLoads(prevLoads =>
      prevLoads.map(load =>
        load.id === id 
        ? { ...load, status: load.status === LoadStatus.Pending ? LoadStatus.Completed : LoadStatus.Pending } 
        : load
      )
    );
  }, [setLoads]);

  const filteredLoads = useMemo(() => {
    const sorted = [...loads].sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime());
    if (filterStore === 'all') {
      return sorted;
    }
    return sorted.filter(load => load.lojaId === filterStore);
  }, [loads, filterStore]);
  
  const pendingCount = useMemo(() => {
      return filteredLoads.filter(load => load.status === LoadStatus.Pending).length;
  }, [filteredLoads]);

  return (
    <>
      <header className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Organizador de Cargas - Separação</h1>
      </header>

      <div className="space-y-8">
        <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 space-y-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Cole os dados aqui..."
            rows={6}
            className="w-full p-3 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 placeholder-gray-500"
          />
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleAddLoads}
              className="w-full sm:w-auto flex-1 px-6 py-3 text-sm font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900 transition-all duration-200"
            >
              Adicionar Cargas
            </button>
            <button
              onClick={handleDeleteAll}
              className="w-full sm:w-auto flex-1 px-6 py-3 text-sm font-semibold text-white bg-purple-700 rounded-md hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-600 focus:ring-offset-gray-900 transition-all duration-200"
            >
              Excluir Todas
            </button>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
          <div className="flex items-center gap-3">
              <label htmlFor="filter" className="font-medium text-gray-400">Filtrar por Loja:</label>
              <select
                  id="filter"
                  value={filterStore}
                  onChange={(e) => setFilterStore(e.target.value)}
                  className="bg-indigo-600 border-0 text-white font-medium rounded-md px-4 py-2 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900 cursor-pointer"
              >
                  {stores.map(store => (
                      <option key={store} value={store} className="bg-gray-800 font-medium">
                          {store === 'all' ? 'Todas as lojas' : store}
                      </option>
                  ))}
              </select>
          </div>
          <div className="text-lg font-semibold text-gray-300">
              Cargas pendentes: <span className="text-white font-bold">{pendingCount}</span>
          </div>
        </div>

        <LoadList loads={filteredLoads} onDelete={handleDelete} onToggleStatus={handleToggleStatus} />

      </div>
    </>
  );
}

export default SeparacaoScreen;
