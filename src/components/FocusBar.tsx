import React from 'react';
import { Eye, RotateCw, Maximize2, Minimize2, EyeOff } from 'lucide-react';

interface FocusBarProps {
  onExitFocus: () => void;
  onReload: () => void;
}

export const FocusBar: React.FC<FocusBarProps> = ({ onExitFocus, onReload }) => {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 text-white backdrop-blur-md px-5 py-2.5 rounded-full shadow-2xl border border-slate-700/80 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse"></span>
        <span className="text-xs font-semibold tracking-wide">وضع التركيز مفعّل</span>
      </div>

      <div className="h-4 w-px bg-slate-700"></div>

      <button
        onClick={onReload}
        className="text-xs text-slate-300 hover:text-white transition-colors flex items-center gap-1 p-1"
        title="تحديث الإطار"
      >
        <RotateCw className="w-3.5 h-3.5" />
        <span>تحديث</span>
      </button>

      <button
        onClick={onExitFocus}
        className="px-3 py-1 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
      >
        <EyeOff className="w-3.5 h-3.5" />
        <span>إلغاء التركيز</span>
      </button>
    </div>
  );
};
