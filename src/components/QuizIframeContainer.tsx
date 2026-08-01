import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Maximize2,
  Minimize2,
  RotateCw,
  ExternalLink,
  ShieldAlert,
  Camera,
  Mic,
  Sparkles,
  Info,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { ViewportHeight } from '../types';

interface QuizIframeContainerProps {
  embedUrl: string;
  reloadKey: number;
  onReload: () => void;
  isFocusMode: boolean;
  viewportHeight: ViewportHeight;
  setViewportHeight: (height: ViewportHeight) => void;
}

export const QuizIframeContainer: React.FC<QuizIframeContainerProps> = ({
  embedUrl,
  reloadKey,
  onReload,
  isFocusMode,
  viewportHeight,
  setViewportHeight
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Handle Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.error("Fullscreen request failed:", err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch(err => {
        console.error("Exit fullscreen failed:", err);
      });
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Compute container height classes
  const getHeightStyle = () => {
    if (isFullscreen) return 'h-screen';
    if (isFocusMode) return 'h-[calc(100vh-60px)]';
    switch (viewportHeight) {
      case 'tall':
        return 'h-[900px]';
      case 'full':
        return 'h-[calc(100vh-80px)] min-h-[700px]';
      case 'standard':
      default:
        return 'h-[750px]';
    }
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full flex flex-col transition-all duration-300 ${
        isFullscreen ? 'bg-slate-900 p-2 sm:p-4' : ''
      }`}
    >
      {/* Quiz Header Title */}
      <div className="flex items-center justify-center gap-2 mb-3 px-1">
        <h1 className="text-lg sm:text-xl font-bold text-[#4a2c11] dark:text-[#e0d0c0] sepia:text-[#4a2c11] text-center tracking-wide">
          منصة شهادات دورات أستاذ فاضل المبارك
        </h1>
      </div>

      {/* Main Iframe Card Frame */}
      <div
        className={`relative w-full rounded-2xl overflow-hidden bg-white dark:bg-slate-950 sepia:bg-[#fcf8f2] border border-slate-200 dark:border-slate-800 sepia:border-[#e6dbc3] shadow-xl shadow-slate-200/50 dark:shadow-none transition-all ${getHeightStyle()}`}
      >
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-50/95 dark:bg-slate-900/95 sepia:bg-[#f9f4ea]/95 backdrop-blur-xs">
            <div className="relative w-14 h-14">
              <div className="absolute inset-0 rounded-full border-4 border-blue-200 dark:border-blue-900 sepia:border-[#e2d5bd]"></div>
              <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
            </div>
            <p className="mt-4 text-sm font-semibold text-slate-700 dark:text-slate-300 sepia:text-[#52412e]">
              جاري تحميل نظام الاختبار المضمن...
            </p>
            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500 sepia:text-[#8a765d]">
              يرجى الانتظار لحين اكتمال الربط مع ProProfs
            </p>
          </div>
        )}

        {/* Error Fallback */}
        {hasError && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-900 text-center">
            <AlertCircle className="w-12 h-12 text-rose-500 mb-3" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">
              تعذر استجابة الإطار المضمن
            </h3>
            <p className="text-sm text-slate-500 max-w-md mb-4">
              إذا ظهرت مشكلة في التضمين من مصدر ProProfs، يمكنك إعادة التحميل أو فتح الرابط مباشرة في النافذة.
            </p>
            <div className="flex gap-3">
              <button
                onClick={onReload}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 transition-all flex items-center gap-2"
              >
                <RotateCw className="w-4 h-4" />
                إعادة المحاولة
              </button>
              <a
                href={embedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 font-medium text-sm hover:bg-slate-300 transition-all flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                فتح مباشرة
              </a>
            </div>
          </div>
        )}

        {/* The User-Provided Exact Iframe */}
        <iframe
          key={reloadKey}
          ref={iframeRef}
          name="proprofs"
          id="proprofs"
          width="100%"
          height="100%"
          frameBorder={0}
          marginWidth={0}
          marginHeight={0}
          src={embedUrl}
          allow="camera *;microphone *;fullscreen;"
          onLoad={handleIframeLoad}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
          className="w-full h-full border-0 rounded-2xl bg-white"
          title="ProProfs Quiz School Embedded Frame"
        />
      </div>

      {/* Credit Footer */}
      <div className="mt-2 text-right text-xs font-medium text-slate-500 dark:text-slate-400 sepia:text-[#7a6853] px-1">
        تصميم وتطوير أستاذ فاضل المبارك
      </div>
    </div>
  );
};
