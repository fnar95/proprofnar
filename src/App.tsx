import React, { useState, useEffect } from 'react';
import { QuizIframeContainer } from './components/QuizIframeContainer';
import { ToolsSidebar } from './components/ToolsSidebar';
import { FocusBar } from './components/FocusBar';
import { ThemeMode, ActiveTool, ViewportHeight } from './types';

export default function App() {
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);
  const [activeTool, setActiveTool] = useState<ActiveTool>('none');
  const [viewportHeight, setViewportHeight] = useState<ViewportHeight>('full');
  const [embedUrl, setEmbedUrl] = useState<string>(
    'https://www.proprofs.com/quiz-school/ugc/story.php?title=85-118w3&id=4777209&ew=430'
  );
  const [reloadKey, setReloadKey] = useState<number>(0);

  // Sync theme class to document html tag
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'sepia');
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'sepia') {
      root.classList.add('sepia');
    }
  }, [theme]);

  const handleReloadEmbed = () => {
    setReloadKey(prev => prev + 1);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 flex flex-col ${
      theme === 'dark'
        ? 'bg-slate-950 text-slate-100'
        : theme === 'sepia'
        ? 'bg-[#f7f2e7] text-[#3b2f20]'
        : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* Main Content Workspace */}
      <main className="flex-1 w-full mx-auto p-2 sm:p-4 transition-all duration-300 flex flex-col">
        {/* The Primary Embedded Quiz Container */}
        <QuizIframeContainer
          embedUrl={embedUrl}
          reloadKey={reloadKey}
          onReload={handleReloadEmbed}
          isFocusMode={isFocusMode}
          viewportHeight={viewportHeight}
          setViewportHeight={setViewportHeight}
        />
      </main>

      {/* Side Utilities Drawer / Popup */}
      <ToolsSidebar
        activeTool={activeTool}
        onClose={() => setActiveTool('none')}
        embedUrl={embedUrl}
        setEmbedUrl={setEmbedUrl}
        onReloadEmbed={handleReloadEmbed}
      />

      {/* Floating Focus Mode Bar */}
      {isFocusMode && (
        <FocusBar
          onExitFocus={() => setIsFocusMode(false)}
          onReload={handleReloadEmbed}
        />
      )}
    </div>
  );
}
