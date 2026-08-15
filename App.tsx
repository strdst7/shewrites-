import React, { useState } from 'react';
import Header from './components/Header';
import ContentGenerator from './components/content/ContentGenerator';
import ImageGenerator from './components/image/ImageGenerator';
import ImageEditor from './components/image/ImageEditor';
import ImageAnalyzer from './components/image/ImageAnalyzer';
import ChatBot from './components/chatbot/ChatBot';
import AudioTools from './components/audio/AudioTools';
import { AppView } from './types';
import TabButton from './components/TabButton';
import { BrainCircuit, Image, Bot, Wand, Mic, ImageUp } from './components/Icons';
import { useLanguage } from './LanguageContext';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<AppView>(AppView.CONTENT_GENERATOR);
  const { t } = useLanguage();

  const renderView = () => {
    switch (activeView) {
      case AppView.CONTENT_GENERATOR:
        return <ContentGenerator />;
      case AppView.IMAGE_GENERATOR:
        return <ImageGenerator />;
      case AppView.IMAGE_EDITOR:
        return <ImageEditor />;
      case AppView.IMAGE_ANALYZER:
        return <ImageAnalyzer />;
      case AppView.CHAT:
        return <ChatBot />;
      case AppView.AUDIO_TOOLS:
        return <AudioTools />;
      default:
        return <ContentGenerator />;
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream/40 dark:bg-slate-950 backdrop-blur-sm text-gray-800 dark:text-gray-200 font-sans relative transition-colors duration-300">
      <div style={{ position: 'fixed', inset: 0, zIndex: -1, overflow: 'hidden', pointerEvents: 'none' }}>
        <iframe 
          src="https://fluid.krackeddevs.com/#p=2.35,1.65,5.2,0.155,1,16,0,8,17.87,0.35,0.95,1,0,1,12,0,0,0,9,0,16777215,15368400,16230289,15060116,0.04,0,0,0,4" 
          title="Fluid background" 
          style={{ width: '100%', height: '100%', border: 0, display: 'block', opacity: 0.6 }}
          className="dark:opacity-30"
        />
      </div>
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl dark:shadow-2xl dark:shadow-brand-pink-900/10 p-4 md:p-6 lg:p-8 min-h-[80vh] transition-colors duration-300">
          <div className="flex flex-wrap gap-2 md:gap-4 border-b border-gray-200 dark:border-slate-700 pb-4 mb-6">
            <TabButton onClick={() => setActiveView(AppView.CONTENT_GENERATOR)} active={activeView === AppView.CONTENT_GENERATOR}><BrainCircuit className="w-5 h-5 mr-2" /> {t.tabs.content}</TabButton>
            <TabButton onClick={() => setActiveView(AppView.IMAGE_GENERATOR)} active={activeView === AppView.IMAGE_GENERATOR}><Image className="w-5 h-5 mr-2" /> {t.tabs.imageGen}</TabButton>
            <TabButton onClick={() => setActiveView(AppView.IMAGE_EDITOR)} active={activeView === AppView.IMAGE_EDITOR}><Wand className="w-5 h-5 mr-2" /> {t.tabs.imageEditor}</TabButton>
            <TabButton onClick={() => setActiveView(AppView.IMAGE_ANALYZER)} active={activeView === AppView.IMAGE_ANALYZER}><ImageUp className="w-5 h-5 mr-2" /> {t.tabs.analyzer}</TabButton>
            <TabButton onClick={() => setActiveView(AppView.CHAT)} active={activeView === AppView.CHAT}><Bot className="w-5 h-5 mr-2" /> {t.tabs.chat}</TabButton>
            <TabButton onClick={() => setActiveView(AppView.AUDIO_TOOLS)} active={activeView === AppView.AUDIO_TOOLS}><Mic className="w-5 h-5 mr-2" /> {t.tabs.audio}</TabButton>
          </div>
          {renderView()}
        </div>
      </main>
      <footer className="py-12 text-center text-gray-500 dark:text-gray-400">
        <p className="text-[10px] uppercase tracking-[0.3em] font-medium opacity-60">
          nur amirah mohd kamil &bull; 2026 &bull; aimirah.com
        </p>
      </footer>
    </div>
  );
};

export default App;