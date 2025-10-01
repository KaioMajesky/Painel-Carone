import React, { useState } from 'react';

// Interface for the results, now including the product code
interface AcougueResult {
  code: string;
  description: string;
  calculatedValue: number;
}

const AcougueScreen: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [divisor, setDivisor] = useState('18');
  const [results, setResults] = useState<AcougueResult[] | null>(null);

  const handleCalculate = () => {
    const divisorNum = parseFloat(divisor.replace(',', '.'));

    if (isNaN(divisorNum) || divisorNum === 0) {
      alert('Por favor, insira uma quantidade válida para a divisão.');
      return;
    }

    const lines = inputText.split('\n').filter(line => line.trim() !== '');
    if (lines.length === 0) {
      setResults(null);
      return;
    }
    
    const calculatedItems: AcougueResult[] = [];
    let hasError = false;

    lines.forEach(line => {
      // Split by tab or multiple spaces for flexibility
      const columns = line.trim().split(/\t|\s{2,}/);
      
      // We need at least 3 parts: a code, some description, and a value
      if (columns.length >= 3) {
        const code = columns[0];
        // The description is everything between the first and last column
        const description = columns.slice(1, -1).join(' ');
        const rawValue = columns[columns.length - 1];
        
        // Handle values like '6.000,000' by removing dots and replacing comma
        const originalValue = parseFloat(rawValue.replace(/\./g, '').replace(',', '.'));
        
        if (!isNaN(originalValue)) {
          // Calculation: ((value / divisor) / 2) + 15, then round up
          const calculatedValueRaw = ((originalValue / divisorNum) / 2) + 15;
          const calculatedValue = Math.ceil(calculatedValueRaw);

          calculatedItems.push({
            code,
            description,
            calculatedValue,
          });
        } else {
          hasError = true;
        }
      } else {
        hasError = true;
      }
    });

    if (hasError && calculatedItems.length === 0) {
      alert('Nenhuma linha pôde ser processada. Verifique o formato dos dados. Ex: CÓDIGO DESCRIÇÃO ... VALOR');
    } else if (hasError) {
      alert('Algumas linhas podem não ter sido processadas. Verifique o formato dos dados.');
    }

    if(calculatedItems.length === 0 && !hasError) {
        alert('Nenhum dado válido encontrado para calcular. O formato esperado é: CÓDIGO DESCRIÇÃO ... VALOR');
    }

    setResults(calculatedItems.length > 0 ? calculatedItems : null);
  };

  const handleClear = () => {
    setInputText('');
    setDivisor('18');
    setResults(null);
  };

  return (
    <>
      <header className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Calculadora Açougue</h1>
        <p className="mt-2 text-lg text-gray-400">Cole os dados dos produtos e informe a quantidade para divisão.</p>
      </header>

      <div className="space-y-8">
        <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 space-y-4">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Cole os dados aqui. Exemplos:&#10;8158 COSTELA SUINA SERRADA KG-20354 KG 1 6.000,000&#10;215020 LING SUINA CHURRAS COFRIL 5KG- ... 600,000"
            rows={8}
            className="w-full p-3 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 placeholder-gray-500 font-mono"
            aria-label="Dados para cálculo"
          />
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <label htmlFor="divisor" className="font-medium text-gray-300 flex-shrink-0">
              Quantidade para Divisão:
            </label>
            <input
              id="divisor"
              type="number"
              value={divisor}
              onChange={(e) => setDivisor(e.target.value)}
              className="sm:w-32 p-3 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 placeholder-gray-500"
              aria-label="Quantidade para divisão"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleCalculate}
              className="w-full sm:w-auto flex-1 px-6 py-3 text-sm font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900 transition-all duration-200"
            >
              Calcular
            </button>
            <button
              onClick={handleClear}
              className="w-full sm:w-auto flex-1 px-6 py-3 text-sm font-semibold text-white bg-gray-600 rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 focus:ring-offset-gray-900 transition-all duration-200"
            >
              Limpar
            </button>
          </div>
        </div>

        {results && results.length > 0 && (
          <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 space-y-6">
            <h2 className="text-2xl font-bold text-white text-center">Resultados</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left table-auto">
                <thead className="bg-gray-900/70 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <tr>
                    <th scope="col" className="px-4 py-3">Código</th>
                    <th scope="col" className="px-4 py-3">Produto</th>
                    <th scope="col" className="px-4 py-3 text-right">Resultado do Cálculo</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((item, index) => (
                    <tr key={index} className="border-b border-gray-700 hover:bg-gray-700/50">
                      <td className="px-4 py-3 font-mono text-indigo-300">{item.code}</td>
                      <td className="px-4 py-3 font-medium text-gray-200">{item.description}</td>
                      <td className="px-4 py-3 text-right font-mono text-indigo-400 font-bold text-lg">{item.calculatedValue.toLocaleString('pt-BR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AcougueScreen;