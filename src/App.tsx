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
    // Ensure dark class is persistently applied to root HTML
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans selection:bg-emerald-500/30 selection:text-emerald-300 antialiased overflow-hidden">
      {/* Sticky Navigation Bar */}
      <TopNavBar />

      {/* Main View Router */}
      <main className="flex-1 w-full overflow-hidden flex flex-col">
        {currentView === 'split' && (
          <SplitLayout
            leftPanel={<MerchantApp />}
            rightPanel={<BankDashboard />}
          />
        )}

        {currentView === 'merchant' && (
          <div className="h-[calc(100vh-4rem)] w-full overflow-y-auto flex items-center justify-center p-3 sm:p-6 bg-[#04070d]">
            <MerchantApp />
          </div>
        )}

        {currentView === 'bank' && (
          <div className="h-[calc(100vh-4rem)] w-full overflow-y-auto p-3 sm:p-6 bg-[#04070d]">
            <div className="w-full max-w-7xl mx-auto h-full rounded-2xl bg-[#090e1a]/95 border border-slate-800/90 shadow-2xl overflow-y-auto p-2 sm:p-5 custom-scrollbar">
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
