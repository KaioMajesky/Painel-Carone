import React, { useState } from 'react';
import Sidebar, { Screen } from './components/Sidebar';
import SeparacaoScreen from './SeparacaoScreen';
import CortesScreen from './CortesScreen';
import ImpressoesScreen from './ImpressoesScreen';
import AcougueScreen from './AcougueScreen';

function App() {
  const [activeScreen, setActiveScreen] = useState<Screen>('separacao');

  return (
    <div className="flex h-screen bg-gray-900 text-gray-200 font-sans">
      <Sidebar activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {/* 
            Each screen is now rendered permanently but hidden via CSS.
            This preserves the component's state when switching tabs.
          */}
          <div className={activeScreen === 'separacao' ? 'block' : 'hidden'}>
            <SeparacaoScreen />
          </div>
          <div className={activeScreen === 'cortes' ? 'block' : 'hidden'}>
            <CortesScreen />
          </div>
          <div className={activeScreen === 'impressoes' ? 'block' : 'hidden'}>
            <ImpressoesScreen />
          </div>
          <div className={activeScreen === 'acougue' ? 'block' : 'hidden'}>
            <AcougueScreen />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
