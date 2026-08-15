import React, { useState, useEffect } from 'react';
import { Sparkles, BrainCircuit } from '../Icons';

const loadingTips = [
  "SheWrites! AI sedang menyusun ayat pikat...",
  "Menyesuaikan gaya bahasa dengan trend Threads Malaysia...",
  "Menambah sentuhan estetik & profesional...",
  "Menyediakan tag pagar (hashtags) tular...",
];

export const ContentSkeleton: React.FC = () => {
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % loadingTips.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4 animate-pulse">
      {/* Loading header indicator */}
      <div className="flex items-center gap-3 bg-white dark:bg-slate-800 p-3 rounded-xl border border-pink-200 dark:border-pink-900/30 shadow-sm">
        <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg text-brand-pink-600 dark:text-brand-pink-400 animate-spin" style={{ animationDuration: '3s' }}>
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-brand-pink-500 animate-ping" />
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-pink-700 dark:text-brand-pink-300">Sedang Menjana Kandungan...</p>
          </div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-all duration-300">{loadingTips[tipIndex]}</p>
        </div>
      </div>

      {/* Skeleton Card 1: Hook */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-pink-100 dark:border-slate-700 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <div className="h-3 w-28 bg-pink-200 dark:bg-pink-900/50 rounded" />
          <div className="h-3 w-12 bg-pink-100 dark:bg-slate-700 rounded" />
        </div>
        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-11/12" />
        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4" />
      </div>

      {/* Skeleton Card 2: Thread Post */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-pink-100 dark:border-slate-700 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-3 w-36 bg-pink-200 dark:bg-pink-900/50 rounded" />
          <div className="h-3 w-16 bg-pink-100 dark:bg-slate-700 rounded" />
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-full" />
          <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-11/12" />
          <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-4/5" />
          <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/5" />
        </div>
      </div>

      {/* Skeleton Card 3: CTA */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-pink-100 dark:border-slate-700 shadow-sm space-y-2">
        <div className="h-3 w-32 bg-pink-200 dark:bg-pink-900/50 rounded" />
        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-5/6" />
      </div>

      {/* Skeleton Card 4: Hashtag Block */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-pink-100 dark:border-slate-700 shadow-sm space-y-2">
        <div className="h-3 w-24 bg-pink-200 dark:bg-pink-900/50 rounded" />
        <div className="h-3 bg-pink-100 dark:bg-slate-700 rounded w-4/5" />
      </div>
    </div>
  );
};

export const ImageSkeleton: React.FC<{ message?: string }> = ({ message = "AI sedang mereka bentuk visual anda..." }) => {
  return (
    <div className="w-full h-full min-h-[320px] flex flex-col items-center justify-center p-6 bg-white/80 dark:bg-slate-800/80 rounded-xl border-2 border-dashed border-pink-200 dark:border-pink-900/50 animate-pulse text-center">
      <div className="p-4 bg-pink-100 dark:bg-pink-900/30 rounded-full text-brand-pink-600 dark:text-brand-pink-400 mb-4 animate-bounce">
        <BrainCircuit className="w-8 h-8" />
      </div>
      <div className="flex items-center gap-2 mb-2">
        <span className="w-2 h-2 rounded-full bg-brand-pink-500 animate-ping" />
        <h4 className="font-serif font-bold text-gray-800 dark:text-gray-100 text-lg">Mereka Visual AI...</h4>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">{message}</p>
      
      <div className="mt-6 w-48 h-1.5 bg-pink-100 dark:bg-slate-700 rounded-full overflow-hidden">
        <div className="h-full bg-brand-pink-500 rounded-full animate-pulse w-2/3" />
      </div>
    </div>
  );
};
