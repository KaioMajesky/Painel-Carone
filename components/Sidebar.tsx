import React from 'react';

export type Screen = 'separacao' | 'cortes' | 'impressoes' | 'acougue';

interface SidebarProps {
  activeScreen: Screen;
  setActiveScreen: (screen: Screen) => void;
}


const Sidebar: React.FC<SidebarProps> = ({ activeScreen, setActiveScreen }) => {
    const navItemClasses = "flex items-center px-4 py-3 rounded-lg font-semibold cursor-pointer transition-colors duration-200";
    const activeClasses = "text-white bg-indigo-600/40";
    const inactiveClasses = "text-gray-400 hover:bg-gray-800 hover:text-white";

  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 p-5 flex flex-col flex-shrink-0 no-print">
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-white text-center tracking-wider">
          Logística
        </h2>
      </div>
      <nav>
        <ul>
          <li>
            <a
              onClick={() => setActiveScreen('separacao')}
              className={`${navItemClasses} ${activeScreen === 'separacao' ? activeClasses : inactiveClasses}`}
              aria-current={activeScreen === 'separacao' ? "page" : undefined}
            >
              <svg
                className="w-6 h-6 mr-3"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 18H3c-1.1 0-2-.9-2-2V8c0-1.1.9-2 2-2h10l4 4" />
                <path d="M5 18h1" />
                <path d="M13 18h1" />
                <path d="M19 15.5V13H6" />
                <path d="M19 18h-2" />
                <circle cx="7" cy="18" r="2" />
                <circle cx="17" cy="18" r="2" />
              </svg>
              <span>Separação</span>
            </a>
          </li>
          <li className="mt-2">
            <a
              onClick={() => setActiveScreen('cortes')}
              className={`${navItemClasses} ${activeScreen === 'cortes' ? activeClasses : inactiveClasses}`}
              aria-current={activeScreen === 'cortes' ? "page" : undefined}
            >
                <svg
                    className="w-6 h-6 mr-3"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M8 6h13M8 12h13M8 18h13M3 6h1v1H3zM3 12h1v1H3zM3 18h1v1H3z"/>
                </svg>
              <span>Cortes</span>
            </a>
          </li>
           <li className="mt-2">
            <a
              onClick={() => setActiveScreen('impressoes')}
              className={`${navItemClasses} ${activeScreen === 'impressoes' ? activeClasses : inactiveClasses}`}
              aria-current={activeScreen === 'impressoes' ? "page" : undefined}
            >
                <svg
                    className="w-6 h-6 mr-3"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6z"/>
                </svg>
              <span>Impressões</span>
            </a>
          </li>
          <li className="mt-2">
            <a
              onClick={() => setActiveScreen('acougue')}
              className={`${navItemClasses} ${activeScreen === 'acougue' ? activeClasses : inactiveClasses}`}
              aria-current={activeScreen === 'acougue' ? "page" : undefined}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              <span>Calculadora Açougue</span>
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
