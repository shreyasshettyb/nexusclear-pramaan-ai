import React, { useEffect } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import { TopNavBar } from './components/TopNavBar';
import { ApiKeyModal } from './components/ApiKeyModal';
import { SplitLayout } from './components/layout/SplitLayout';
import MerchantApp from './components/merchant/MerchantApp';
import BankDashboard from './components/bank/BankDashboard';

const AppContent: React.FC = () => {
  const { currentView, showApiKeyModal } = useAppContext();

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#131314] text-[#e3e3e3] font-sans antialiased overflow-hidden selection:bg-[#8ab4f8]/25 selection:text-[#d3e3fd]">
      {/* Google-Style Top Navigation (56px) */}
      <TopNavBar />

      {/* Main Content Router */}
      <main className="flex-1 w-full overflow-hidden flex flex-col">
        {currentView === 'split' && (
          <SplitLayout
            leftPanel={<MerchantApp />}
            rightPanel={<BankDashboard />}
          />
        )}

        {currentView === 'merchant' && (
          <div className="h-[calc(100dvh-3.5rem)] w-full overflow-y-auto flex items-start justify-center p-2 sm:p-6 custom-scrollbar">
            <MerchantApp className="max-w-lg w-full" />
          </div>
        )}

        {currentView === 'bank' && (
          <div className="h-[calc(100dvh-3.5rem)] w-full overflow-y-auto p-2 sm:p-6 custom-scrollbar">
            <div className="w-full max-w-7xl mx-auto">
              <BankDashboard />
            </div>
          </div>
        )}
      </main>

      {/* API Key Modal Overlay */}
      {showApiKeyModal && <ApiKeyModal />}
    </div>
  );
};

export const App: React.FC = () => {
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
