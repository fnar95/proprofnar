import React from 'react';
import { motion } from 'motion/react';
import {
  GraduationCap,
  Maximize2,
  Minimize2,
  Moon,
  Sun,
  Coffee,
  RotateCw,
  Eye,
  FileText,
  Timer,
  Calculator,
  HelpCircle,
  ExternalLink,
  Settings,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { ThemeMode, ActiveTool } from '../types';

interface HeaderProps {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  isFocusMode: boolean;
  setIsFocusMode: (focus: boolean) => void;
  activeTool: ActiveTool;
  setActiveTool: (tool: ActiveTool) => void;
  onReloadEmbed: () => void;
  embedUrl: string;
  isIframeLoaded: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  setTheme,
  isFocusMode,
  setIsFocusMode,
  activeTool,
  setActiveTool,
  onReloadEmbed,
  embedUrl,
  isIframeLoaded
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 sepia:bg-[#fbf7ee]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 sepia:border-[#e8dfc8] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Right Section (Logo & Title - RTL) */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 ring-4 ring-blue-500/10">
              <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white sepia:text-[#433422]">
                  منصة التقييم والاختبارات
                </h1>
                <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  ProProfs Live
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 sepia:text-[#7c6950] flex items-center gap-1.5 mt-0.5">
                <span>الكود: 85-118w3</span>
                <span className="text-slate-300 dark:text-slate-700 sepia:text-[#c4b69c]">|</span>
                <span>المُعَرِّف: 4777209</span>
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-1"></span>
              </p>
            </div>
          </div>

          {/* Center / Left Section - Action Tools */}
          <div className="flex items-center gap-1.5 sm:gap-2">

            {/* Tool Toggles */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 sepia:bg-[#ede3ce] p-1 rounded-xl border border-slate-200/60 dark:border-slate-700/60 sepia:border-[#dfd3b8]">
              <button
                id="btn-tool-notes"
                onClick={() => setActiveTool(activeTool === 'notes' ? 'none' : 'notes')}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  activeTool === 'notes'
                    ? 'bg-white dark:bg-slate-700 sepia:bg-[#fbf7ee] text-blue-600 dark:text-blue-400 sepia:text-[#5c472d] shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 sepia:text-[#6e5a42] hover:text-slate-900 dark:hover:text-white'
                }`}
                title="الملاحظات والمسودة"
              >
                <FileText className="w-4 h-4" />
                <span className="hidden md:inline">الملاحظات</span>
              </button>

              <button
                id="btn-tool-timer"
                onClick={() => setActiveTool(activeTool === 'timer' ? 'none' : 'timer')}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  activeTool === 'timer'
                    ? 'bg-white dark:bg-slate-700 sepia:bg-[#fbf7ee] text-blue-600 dark:text-blue-400 sepia:text-[#5c472d] shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 sepia:text-[#6e5a42] hover:text-slate-900 dark:hover:text-white'
                }`}
                title="مؤقت الاختبار"
              >
                <Timer className="w-4 h-4" />
                <span className="hidden md:inline">المؤقت</span>
              </button>

              <button
                id="btn-tool-calc"
                onClick={() => setActiveTool(activeTool === 'calculator' ? 'none' : 'calculator')}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  activeTool === 'calculator'
                    ? 'bg-white dark:bg-slate-700 sepia:bg-[#fbf7ee] text-blue-600 dark:text-blue-400 sepia:text-[#5c472d] shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 sepia:text-[#6e5a42] hover:text-slate-900 dark:hover:text-white'
                }`}
                title="الآلة الحاسبة"
              >
                <Calculator className="w-4 h-4" />
                <span className="hidden lg:inline">حاسبة</span>
              </button>

              <button
                id="btn-tool-help"
                onClick={() => setActiveTool(activeTool === 'instructions' ? 'none' : 'instructions')}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  activeTool === 'instructions'
                    ? 'bg-white dark:bg-slate-700 sepia:bg-[#fbf7ee] text-blue-600 dark:text-blue-400 sepia:text-[#5c472d] shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 sepia:text-[#6e5a42] hover:text-slate-900 dark:hover:text-white'
                }`}
                title="التعليمات والإرشادات"
              >
                <HelpCircle className="w-4 h-4" />
                <span className="hidden lg:inline">التعليمات</span>
              </button>
            </div>

            {/* Divider */}
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 sepia:bg-[#e2d5bd] mx-0.5 hidden sm:block"></div>

            {/* Focus Mode Toggle */}
            <button
              id="btn-toggle-focus"
              onClick={() => setIsFocusMode(!isFocusMode)}
              className={`p-2 rounded-xl text-slate-700 dark:text-slate-200 sepia:text-[#4a3b29] border transition-all ${
                isFocusMode
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                  : 'bg-white dark:bg-slate-800 sepia:bg-[#f4ebd9] border-slate-200 dark:border-slate-700 sepia:border-[#e2d5bd] hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
              title={isFocusMode ? "إنهاء وضع التركيز" : "وضع التركيز (إخفاء العناصر)"}
            >
              <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Reload Embed */}
            <button
              id="btn-reload-embed"
              onClick={onReloadEmbed}
              className="p-2 rounded-xl bg-white dark:bg-slate-800 sepia:bg-[#f4ebd9] border border-slate-200 dark:border-slate-700 sepia:border-[#e2d5bd] text-slate-700 dark:text-slate-200 sepia:text-[#4a3b29] hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-95"
              title="إعادة تحميل الاختبار"
            >
              <RotateCw className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Theme Selector */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 sepia:bg-[#ede3ce] p-1 rounded-xl border border-slate-200/60 dark:border-slate-700/60 sepia:border-[#dfd3b8]">
              <button
                id="btn-theme-light"
                onClick={() => setTheme('light')}
                className={`p-1.5 rounded-lg transition-all ${
                  theme === 'light'
                    ? 'bg-white text-amber-500 shadow-sm'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                }`}
                title="وضع نهاري"
              >
                <Sun className="w-4 h-4" />
              </button>
              <button
                id="btn-theme-dark"
                onClick={() => setTheme('dark')}
                className={`p-1.5 rounded-lg transition-all ${
                  theme === 'dark'
                    ? 'bg-slate-700 text-blue-400 shadow-sm'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                }`}
                title="وضع ليلي"
              >
                <Moon className="w-4 h-4" />
              </button>
              <button
                id="btn-theme-sepia"
                onClick={() => setTheme('sepia')}
                className={`p-1.5 rounded-lg transition-all ${
                  theme === 'sepia'
                    ? 'bg-[#fbf7ee] text-amber-800 shadow-sm'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                }`}
                title="وضع مريح للعين (دافئ)"
              >
                <Coffee className="w-4 h-4" />
              </button>
            </div>

            {/* External Link */}
            <a
              id="link-external-proprofs"
              href={embedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center justify-center p-2 rounded-xl bg-white dark:bg-slate-800 sepia:bg-[#f4ebd9] border border-slate-200 dark:border-slate-700 sepia:border-[#e2d5bd] text-slate-700 dark:text-slate-200 sepia:text-[#4a3b29] hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
              title="فتح في نافذة خارجية"
            >
              <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
            </a>

          </div>
        </div>
      </div>
    </header>
  );
};
