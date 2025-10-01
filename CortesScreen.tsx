import React, { useState, useMemo } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Corte, Setor } from './types';

const setores: Setor[] = ['Câmara Fria', 'Mezanino', 'Carga Seca'];

type SortableKeys = keyof Omit<Corte, 'id'>;

const getSetorClasses = (setor: Setor): string => {
  switch (setor) {
    case 'Câmara Fria':
      return 'bg-gradient-to-r from-red-900/30 to-gray-900/10';
    case 'Mezanino':
      return 'bg-gradient-to-r from-amber-900/30 to-gray-900/10';
    case 'Carga Seca':
      return 'bg-gradient-to-r from-blue-900/30 to-gray-900/10';
    default:
      return 'bg-gray-800';
  }
};


const CortesScreen: React.FC = () => {
  const [cortes, setCortes] = useLocalStorage<Corte[]>('cortes', []);
  const [codigo, setCodigo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [setor, setSetor] = useState<Setor | ''>('');
  const [sortConfig, setSortConfig] = useState<{ key: SortableKeys; direction: 'ascending' | 'descending' } | null>(null);

  const sortedCortes = useMemo(() => {
    let sortableItems = [...cortes];
    if (sortConfig !== null) {
        sortableItems.sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });
    }
    return sortableItems;
  }, [cortes, sortConfig]);

  const requestSort = (key: SortableKeys) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
        direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key: SortableKeys) => {
    if (!sortConfig || sortConfig.key !== key) {
        return <span className="opacity-50 ml-1"></span>;
    }
    return <span className="ml-1">{sortConfig.direction === 'ascending' ? '▲' : '▼'}</span>;
  };


  const handleAddCorte = (e: React.FormEvent) => {
    e.preventDefault();
    if (codigo.trim() && descricao.trim() && setor) {
      const trimmedCodigo = codigo.trim();
      
      const isDuplicate = cortes.some(c => c.codigo.toLowerCase() === trimmedCodigo.toLowerCase());

      if (isDuplicate) {
        alert('O código informado já existe na lista.');
        return; 
      }
      
      const newCorte: Corte = {
        id: `corte-${Date.now()}`,
        codigo: trimmedCodigo,
        descricao: descricao.trim(),
        setor,
      };
      setCortes(prev => [newCorte, ...prev]);
      setCodigo('');
      setDescricao('');
      setSetor('');
    }
  };

  const handleDeleteCorte = (id: string) => {
    setCortes(prev => prev.filter(c => c.id !== id));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <header className="text-center mb-8 no-print">
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Controle de Cortes</h1>
        <p className="mt-2 text-lg text-gray-400">Adicione produtos que estão em falta.</p>
      </header>

      <div className="space-y-8">
        <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 space-y-4 no-print">
            <form onSubmit={handleAddCorte} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
                    <input
                        type="text"
                        value={codigo}
                        onChange={(e) => setCodigo(e.target.value)}
                        placeholder="Código"
                        className="sm:col-span-1 w-full p-3 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 placeholder-gray-500"
                        required
                        aria-label="Código do Produto"
                    />
                    <input
                        type="text"
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                        placeholder="Descrição do Produto"
                        className="sm:col-span-3 w-full p-3 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 placeholder-gray-500"
                        required
                        aria-label="Descrição do Produto"
                    />
                     <select
                        value={setor}
                        onChange={(e) => setSetor(e.target.value as Setor)}
                        className={`sm:col-span-2 w-full p-3 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${setor ? 'text-gray-200' : 'text-gray-500'}`}
                        required
                        aria-label="Setor do Produto"
                    >
                        <option value="" disabled className="text-gray-600">Selecione o Setor</option>
                        {setores.map(s => (
                            <option key={s} value={s} className="text-gray-200 bg-gray-800">{s}</option>
                        ))}
                    </select>
                </div>
                <button
                    type="submit"
                    className="w-full px-6 py-3 text-sm font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900 transition-all duration-200"
                >
                    Adicionar Corte
                </button>
            </form>
        </div>
        
        <div className="flex justify-end no-print">
            <button
                onClick={handlePrint}
                className="px-5 py-2 text-sm font-semibold text-white bg-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 focus:ring-offset-gray-900 transition-all duration-200 flex items-center gap-2"
                >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
                </svg>
                Imprimir Lista
            </button>
        </div>

        <div className="bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700 printable-area">
          <header className="print-only p-4 text-center">
              <h2 className="text-xl font-bold">Lista de Cortes</h2>
          </header>
          <table className="w-full text-left table-auto">
            <thead className="bg-gray-900/70 text-xs font-bold text-gray-400 uppercase tracking-wider">
              <tr>
                <th className="px-3 py-2 w-12 delete-column" aria-label="Ação"></th>
                <th scope="col" className="px-3 py-3 text-center cursor-pointer select-none hover:bg-gray-800 transition-colors" onClick={() => requestSort('codigo')}>
                    <div className="flex items-center justify-center">Código {getSortIndicator('codigo')}</div>
                </th>
                <th scope="col" className="px-3 py-3 text-center cursor-pointer select-none hover:bg-gray-800 transition-colors" onClick={() => requestSort('descricao')}>
                     <div className="flex items-center justify-center">Descrição {getSortIndicator('descricao')}</div>
                </th>
                <th scope="col" className="px-3 py-3 text-center cursor-pointer select-none hover:bg-gray-800 transition-colors" onClick={() => requestSort('setor')}>
                     <div className="flex items-center justify-center">Setor {getSortIndicator('setor')}</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedCortes.length > 0 ? (
                sortedCortes.map(corte => (
                  <tr key={corte.id} className={`border-b border-gray-700 transition-all duration-200 group hover:brightness-125 ${getSetorClasses(corte.setor)}`}>
                    <td className="px-3 py-2 text-center delete-column">
                        <button
                            onClick={() => handleDeleteCorte(corte.id)}
                            className="text-gray-400 hover:text-red-400 focus:text-red-400 opacity-0 group-hover:opacity-100 transition-all duration-200 focus:outline-none"
                            aria-label={`Excluir corte ${corte.descricao}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </td>
                    <td className="px-3 py-2 font-mono text-indigo-300 text-center text-lg">{corte.codigo}</td>
                    <td className="px-3 py-2 text-gray-200 break-words text-lg">{corte.descricao}</td>
                    <td className="px-3 py-2 text-gray-200 text-center text-lg">{corte.setor}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-10 text-gray-500">
                    Nenhum corte adicionado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default CortesScreen;