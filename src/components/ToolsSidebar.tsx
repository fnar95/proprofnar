import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  FileText,
  Timer,
  Calculator,
  HelpCircle,
  Settings,
  Play,
  Pause,
  RotateCcw,
  Copy,
  Check,
  Trash2,
  Plus,
  Volume2,
  VolumeX,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Camera,
  Mic
} from 'lucide-react';
import { ActiveTool, TimerState } from '../types';

interface ToolsSidebarProps {
  activeTool: ActiveTool;
  onClose: () => void;
  embedUrl: string;
  setEmbedUrl: (url: string) => void;
  onReloadEmbed: () => void;
}

export const ToolsSidebar: React.FC<ToolsSidebarProps> = ({
  activeTool,
  onClose,
  embedUrl,
  setEmbedUrl,
  onReloadEmbed
}) => {
  // Notes State
  const [notesText, setNotesText] = useState<string>(() => {
    return localStorage.getItem('quiz_notes_text') || '';
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    localStorage.setItem('quiz_notes_text', notesText);
  }, [notesText]);

  // Timer State
  const [timerState, setTimerState] = useState<TimerState>({
    seconds: 0,
    isRunning: false,
    mode: 'stopwatch',
    targetSeconds: 15 * 60 // Default 15 mins for countdown
  });
  const [audioAlertEnabled, setAudioAlertEnabled] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerState.isRunning) {
      interval = setInterval(() => {
        setTimerState(prev => {
          if (prev.mode === 'stopwatch') {
            return { ...prev, seconds: prev.seconds + 1 };
          } else {
            if (prev.seconds <= 1) {
              // Timer finished!
              if (audioAlertEnabled) {
                try {
                  const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
                  const osc = audioCtx.createOscillator();
                  osc.type = 'sine';
                  osc.frequency.setValueAtTime(880, audioCtx.currentTime);
                  osc.connect(audioCtx.destination);
                  osc.start();
                  osc.stop(audioCtx.currentTime + 1);
                } catch (e) {
                  console.log("Audio alert blocked by browser");
                }
              }
              return { ...prev, seconds: 0, isRunning: false };
            }
            return { ...prev, seconds: prev.seconds - 1 };
          }
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerState.isRunning, audioAlertEnabled]);

  // Calculator State
  const [calcDisplay, setCalcDisplay] = useState('0');
  const [calcMemory, setCalcMemory] = useState<number | null>(null);
  const [calcOp, setCalcOp] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const handleCalcDigit = (digit: string) => {
    if (waitingForOperand) {
      setCalcDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setCalcDisplay(calcDisplay === '0' ? digit : calcDisplay + digit);
    }
  };

  const handleCalcDecimal = () => {
    if (waitingForOperand) {
      setCalcDisplay('0.');
      setWaitingForOperand(false);
    } else if (!calcDisplay.includes('.')) {
      setCalcDisplay(calcDisplay + '.');
    }
  };

  const handleCalcOp = (op: string) => {
    const inputValue = parseFloat(calcDisplay);
    if (calcMemory === null) {
      setCalcMemory(inputValue);
    } else if (calcOp) {
      const currentMemory = calcMemory || 0;
      let newValue = currentMemory;
      switch (calcOp) {
        case '+': newValue = currentMemory + inputValue; break;
        case '-': newValue = currentMemory - inputValue; break;
        case '×': newValue = currentMemory * inputValue; break;
        case '÷': newValue = inputValue !== 0 ? currentMemory / inputValue : 0; break;
      }
      setCalcMemory(newValue);
      setCalcDisplay(String(newValue));
    }
    setWaitingForOperand(true);
    setCalcOp(op);
  };

  const handleCalcEquals = () => {
    const inputValue = parseFloat(calcDisplay);
    if (calcOp && calcMemory !== null) {
      let newValue = calcMemory;
      switch (calcOp) {
        case '+': newValue = calcMemory + inputValue; break;
        case '-': newValue = calcMemory - inputValue; break;
        case '×': newValue = calcMemory * inputValue; break;
        case '÷': newValue = inputValue !== 0 ? calcMemory / inputValue : 0; break;
      }
      setCalcDisplay(String(newValue));
      setCalcMemory(null);
      setCalcOp(null);
      setWaitingForOperand(true);
    }
  };

  const handleCalcClear = () => {
    setCalcDisplay('0');
    setCalcMemory(null);
    setCalcOp(null);
    setWaitingForOperand(false);
  };

  const handleCalcBackspace = () => {
    if (calcDisplay.length > 1) {
      setCalcDisplay(calcDisplay.slice(0, -1));
    } else {
      setCalcDisplay('0');
    }
  };

  // Format Timer Display
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopyNotes = () => {
    navigator.clipboard.writeText(notesText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const addTimestampNote = () => {
    const now = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setNotesText(prev => (prev ? `${prev}\n[${now}] ` : `[${now}] `));
  };

  if (activeTool === 'none') return null;

  return (
    <AnimatePresence>
      <motion.aside
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed top-20 left-4 bottom-4 z-40 w-80 sm:w-96 bg-white/95 dark:bg-slate-900/95 sepia:bg-[#fbf7ee]/95 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 sepia:border-[#e8dfc8] shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200/80 dark:border-slate-800 sepia:border-[#e8dfc8]">
          <div className="flex items-center gap-2">
            {activeTool === 'notes' && <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
            {activeTool === 'timer' && <Timer className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
            {activeTool === 'calculator' && <Calculator className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
            {activeTool === 'instructions' && <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
            {activeTool === 'settings' && <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
            <h2 className="font-bold text-slate-800 dark:text-white sepia:text-[#453625] text-base">
              {activeTool === 'notes' && 'مسودة الملاحظات والحسابات'}
              {activeTool === 'timer' && 'مؤقت التقييم والاختبار'}
              {activeTool === 'calculator' && 'الآلة الحاسبة السريعة'}
              {activeTool === 'instructions' && 'إرشادات وتعليمات الاختبار'}
              {activeTool === 'settings' && 'إعدادات الإطار المضمن'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 sepia:hover:text-[#453625] hover:bg-slate-100 dark:hover:bg-slate-800 sepia:hover:bg-[#f4ebd9] transition-all"
            title="إغلاق الأدوات"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Body */}
        <div className="flex-1 overflow-y-auto p-5">
          
          {/* TAB 1: NOTES */}
          {activeTool === 'notes' && (
            <div className="flex flex-col h-full gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400 sepia:text-[#7d6b54]">
                  تُحفظ الملاحظات تلقائياً في المتصفح
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={addTimestampNote}
                    className="p-1.5 text-xs font-medium rounded-lg text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 transition-all flex items-center gap-1"
                    title="إضافة الطابع الزمني الحالي"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    طابع زمني
                  </button>
                  <button
                    onClick={handleCopyNotes}
                    className="p-1.5 text-xs font-medium rounded-lg text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-all flex items-center gap-1"
                    title="نسخ الملاحظات"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'تم النسخ' : 'نسخ'}
                  </button>
                  <button
                    onClick={() => setNotesText('')}
                    className="p-1.5 text-xs font-medium rounded-lg text-rose-600 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 transition-all"
                    title="مسح الكل"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <textarea
                value={notesText}
                onChange={(e) => setNotesText(e.target.value)}
                placeholder="اكتب ملاحظاتك، إجاباتك الأولية، أو معادلاتك هنا أثناء حل الاختبار..."
                className="w-full flex-1 p-4 rounded-xl border border-slate-200 dark:border-slate-800 sepia:border-[#e2d5bd] bg-slate-50 dark:bg-slate-950 sepia:bg-[#fcf9f2] text-slate-800 dark:text-slate-100 sepia:text-[#3d3021] text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 resize-none font-sans leading-relaxed"
                rows={12}
              />
            </div>
          )}

          {/* TAB 2: TIMER */}
          {activeTool === 'timer' && (
            <div className="flex flex-col items-center gap-6 py-2">
              
              {/* Mode Selector */}
              <div className="flex w-full bg-slate-100 dark:bg-slate-800 sepia:bg-[#ede3ce] p-1 rounded-xl">
                <button
                  onClick={() => {
                    setTimerState(prev => ({ ...prev, mode: 'stopwatch', seconds: 0, isRunning: false }));
                  }}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                    timerState.mode === 'stopwatch'
                      ? 'bg-white dark:bg-slate-700 sepia:bg-[#fbf7ee] text-blue-600 dark:text-blue-400 sepia:text-[#4d3d2a] shadow-xs'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  عداد تصاعدي (Stopwatch)
                </button>
                <button
                  onClick={() => {
                    setTimerState(prev => ({ ...prev, mode: 'countdown', seconds: prev.targetSeconds, isRunning: false }));
                  }}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                    timerState.mode === 'countdown'
                      ? 'bg-white dark:bg-slate-700 sepia:bg-[#fbf7ee] text-blue-600 dark:text-blue-400 sepia:text-[#4d3d2a] shadow-xs'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  عداد تنازلي (Countdown)
                </button>
              </div>

              {/* Countdown Quick Presets */}
              {timerState.mode === 'countdown' && (
                <div className="grid grid-cols-4 gap-2 w-full">
                  {[5, 15, 30, 45].map((mins) => (
                    <button
                      key={mins}
                      onClick={() => {
                        const target = mins * 60;
                        setTimerState(prev => ({ ...prev, targetSeconds: target, seconds: target, isRunning: false }));
                      }}
                      className={`py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        timerState.targetSeconds === mins * 60
                          ? 'bg-blue-50 dark:bg-blue-900/40 border-blue-500 text-blue-600 dark:text-blue-300 font-bold'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {mins} دقيقة
                    </button>
                  ))}
                </div>
              )}

              {/* Big Digital Display */}
              <div className="relative w-48 h-48 rounded-full border-4 border-blue-500/20 dark:border-blue-500/10 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 sepia:bg-[#fcf9f2] shadow-inner">
                <span className="font-mono text-4xl font-extrabold text-slate-800 dark:text-white sepia:text-[#3d3021] tracking-wider">
                  {formatTime(timerState.seconds)}
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  {timerState.mode === 'stopwatch' ? 'الوقت المنقضي' : 'الوقت المتبقي'}
                </span>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setTimerState(prev => ({ ...prev, isRunning: !prev.isRunning }))}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm shadow-lg transition-all ${
                    timerState.isRunning
                      ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20'
                      : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20'
                  }`}
                >
                  {timerState.isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
                  <span>{timerState.isRunning ? 'إيقاف مؤقت' : 'بدء المؤقت'}</span>
                </button>

                <button
                  onClick={() => {
                    const resetSecs = timerState.mode === 'countdown' ? timerState.targetSeconds : 0;
                    setTimerState(prev => ({ ...prev, seconds: resetSecs, isRunning: false }));
                  }}
                  className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 sepia:bg-[#ede3ce] text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition-all"
                  title="إعادة التعيين"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>

                <button
                  onClick={() => setAudioAlertEnabled(!audioAlertEnabled)}
                  className={`p-3 rounded-xl border transition-all ${
                    audioAlertEnabled
                      ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 text-emerald-600'
                      : 'bg-slate-100 dark:bg-slate-800 border-slate-200 text-slate-400'
                  }`}
                  title={audioAlertEnabled ? "التنبيه الصوتي مفعّل" : "التنبيه الصوتي معطل"}
                >
                  {audioAlertEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                </button>
              </div>

            </div>
          )}

          {/* TAB 3: CALCULATOR */}
          {activeTool === 'calculator' && (
            <div className="flex flex-col gap-4">
              {/* Calc Display */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white font-mono text-right text-3xl font-bold tracking-wider overflow-x-auto shadow-inner border border-slate-800">
                {calcDisplay}
              </div>

              {/* Calc Grid */}
              <div className="grid grid-cols-4 gap-2">
                <button onClick={handleCalcClear} className="col-span-2 p-3.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold text-base hover:bg-rose-500/20 transition-all">
                  مسح C
                </button>
                <button onClick={handleCalcBackspace} className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition-all">
                  ⌫
                </button>
                <button onClick={() => handleCalcOp('÷')} className="p-3.5 rounded-xl bg-blue-600 text-white font-bold text-lg hover:bg-blue-700 transition-all">
                  ÷
                </button>

                {['7', '8', '9'].map(n => (
                  <button key={n} onClick={() => handleCalcDigit(n)} className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 font-semibold text-slate-800 dark:text-slate-100 hover:bg-slate-200 transition-all">
                    {n}
                  </button>
                ))}
                <button onClick={() => handleCalcOp('×')} className="p-3.5 rounded-xl bg-blue-600 text-white font-bold text-lg hover:bg-blue-700 transition-all">
                  ×
                </button>

                {['4', '5', '6'].map(n => (
                  <button key={n} onClick={() => handleCalcDigit(n)} className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 font-semibold text-slate-800 dark:text-slate-100 hover:bg-slate-200 transition-all">
                    {n}
                  </button>
                ))}
                <button onClick={() => handleCalcOp('-')} className="p-3.5 rounded-xl bg-blue-600 text-white font-bold text-lg hover:bg-blue-700 transition-all">
                  -
                </button>

                {['1', '2', '3'].map(n => (
                  <button key={n} onClick={() => handleCalcDigit(n)} className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 font-semibold text-slate-800 dark:text-slate-100 hover:bg-slate-200 transition-all">
                    {n}
                  </button>
                ))}
                <button onClick={() => handleCalcOp('+')} className="p-3.5 rounded-xl bg-blue-600 text-white font-bold text-lg hover:bg-blue-700 transition-all">
                  +
                </button>

                <button onClick={() => handleCalcDigit('0')} className="col-span-2 p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 font-semibold text-slate-800 dark:text-slate-100 hover:bg-slate-200 transition-all">
                  0
                </button>
                <button onClick={handleCalcDecimal} className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-200 transition-all">
                  .
                </button>
                <button onClick={handleCalcEquals} className="p-3.5 rounded-xl bg-emerald-600 text-white font-bold text-lg hover:bg-emerald-700 transition-all shadow-md">
                  =
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: INSTRUCTIONS */}
          {activeTool === 'instructions' && (
            <div className="flex flex-col gap-4 text-xs text-slate-600 dark:text-slate-300 sepia:text-[#524230] leading-relaxed">
              <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-blue-900 dark:text-blue-200 text-sm mb-1">تعليمات أداء الاختبار المضمن</h4>
                  <p>تضمن هذه المنصة تجربة تقييم سلسة ومحمية. يرجى قراءة الإرشادات بعناية قبل الإجابة.</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs shrink-0">1</span>
                  <div>
                    <h5 className="font-bold text-slate-800 dark:text-white mb-0.5">صلاحيات الكاميرا والمايكروفون</h5>
                    <p>إذا طلب الاختبار التوثيق بالفيديو، تأكد من الموافقة على إذن المتصفح لاستخدام الكاميرا والمايكروفون عند ظهور الرسالة المنبثقة.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs shrink-0">2</span>
                  <div>
                    <h5 className="font-bold text-slate-800 dark:text-white mb-0.5">وضع ملء الشاشة للتركيز</h5>
                    <p>يمكنك تفعيل زر "شاشة كاملة" أو "وضع التركيز" من الشريط العلوي لمنع أي تشتيت بصري أثناء الإجابة.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs shrink-0">3</span>
                  <div>
                    <h5 className="font-bold text-slate-800 dark:text-white mb-0.5">استخدام المسودة والمؤقت</h5>
                    <p>استخدم تبويب "الملاحظات" للعمليات الحسابية أو المسودات، ويمكنك تفعيل العداد التنازلي لمتابعة وقت التقييم.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SETTINGS */}
          {activeTool === 'settings' && (
            <div className="flex flex-col gap-4 text-xs text-slate-600 dark:text-slate-300">
              <label className="font-semibold text-slate-800 dark:text-white text-sm">
                رابط التضمين (Embed URL):
              </label>
              <input
                type="text"
                value={embedUrl}
                onChange={(e) => setEmbedUrl(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono text-xs focus:ring-2 focus:ring-blue-500"
              />

              <button
                onClick={onReloadEmbed}
                className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
              >
                تطبيق وإعادة تحميل الإطار
              </button>
            </div>
          )}

        </div>
      </motion.aside>
    </AnimatePresence>
  );
};
