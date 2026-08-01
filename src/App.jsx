import React, { useState } from 'react';
import ParticleBackground from './components/ParticleBackground';
import LandingPage from './components/LandingPage';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import ConfigUploadPage from './components/ConfigUploadPage';
import TopologyPage from './components/TopologyPage';
import StpSimulationPage from './components/StpSimulationPage';
import LoopRiskPage from './components/LoopRiskPage';
import AiRecommendationPage from './components/AiRecommendationPage';
import ReportsPage from './components/ReportsPage';
import SettingsPage from './components/SettingsPage';

function App() {
  const [currentTab, setCurrentTab] = useState('landing');
  const [searchQuery, setSearchQuery] = useState('');

  const handleNavigate = (tabId) => {
    setCurrentTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#050816] text-slate-100 font-sans selection:bg-[#00D4FF]/30 selection:text-[#00D4FF] relative overflow-x-hidden">
      {/* Dynamic Cyber Particle Background */}
      <ParticleBackground />

      {currentTab === 'landing' ? (
        <LandingPage onNavigate={handleNavigate} />
      ) : (
        <div className="flex min-h-screen relative z-10">
          {/* Left Navigation Sidebar */}
          <Sidebar currentTab={currentTab} onNavigate={handleNavigate} />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0">
            <Header title={currentTab.toUpperCase()} onSearch={setSearchQuery} />

            <main className="flex-1 overflow-y-auto">
              {currentTab === 'dashboard' && <DashboardView onNavigate={handleNavigate} />}
              {currentTab === 'upload' && <ConfigUploadPage onNavigate={handleNavigate} />}
              {currentTab === 'topology' && <TopologyPage onNavigate={handleNavigate} />}
              {currentTab === 'simulation' && <StpSimulationPage onNavigate={handleNavigate} />}
              {currentTab === 'risk' && <LoopRiskPage onNavigate={handleNavigate} />}
              {currentTab === 'ai' && <AiRecommendationPage onNavigate={handleNavigate} />}
              {currentTab === 'reports' && <ReportsPage onNavigate={handleNavigate} />}
              {currentTab === 'settings' && <SettingsPage onNavigate={handleNavigate} />}
            </main>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
