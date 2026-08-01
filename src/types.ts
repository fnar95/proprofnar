export type ThemeMode = 'light' | 'dark' | 'sepia';

export type ViewportHeight = 'standard' | 'tall' | 'full' | 'auto';

export type ActiveTool = 'none' | 'notes' | 'timer' | 'calculator' | 'instructions' | 'settings';

export interface QuizMetadata {
  id: string;
  titleCode: string;
  url: string;
  provider: string;
}

export interface TimerState {
  seconds: number;
  isRunning: boolean;
  mode: 'stopwatch' | 'countdown';
  targetSeconds: number;
}
