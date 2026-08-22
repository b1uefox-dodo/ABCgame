import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { EasterEggWord } from '../data/gameData';
import { soundEngine } from '../utils/soundEngine';
import { Sparkles } from 'lucide-react';

interface EasterEggModalProps {
  egg: EasterEggWord | null;
  onClose: () => void;
}

export const EasterEggModal: React.FC<EasterEggModalProps> = ({ egg, onClose }) => {
  useEffect(() => {
    if (!egg) return;

    // Confetti burst
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.6 }
    });

    const timer2 = setTimeout(() => {
      confetti({
        particleCount: 80,
        angle: 60,
        spread: 70,
        origin: { x: 0 }
      });
      confetti({
        particleCount: 80,
        angle: 120,
        spread: 70,
        origin: { x: 1 }
      });
    }, 400);

    // Audio announcement
    soundEngine.playFanfare();
    soundEngine.playEggVoice(egg.word);

    const autoCloseTimer = setTimeout(() => {
      onClose();
    }, 4500);

    return () => {
      clearTimeout(timer2);
      clearTimeout(autoCloseTimer);
    };
  }, [egg, onClose]);

  if (!egg) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-lg animate-pop-in cursor-pointer"
    >
      {/* Background Rotating Sunburst Beam */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40 overflow-hidden">
        <div
          className="w-[800px] h-[800px] rounded-full animate-spin-slow"
          style={{
            background: `radial-gradient(circle, ${egg.themeColor} 0%, transparent 70%)`
          }}
        />
      </div>

      {/* Main Celebration Card */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-lg w-11/12 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-white/95 to-white/90 border-4 border-yellow-300 shadow-[0_20px_50px_rgba(0,0,0,0.5)] text-center flex flex-col items-center gap-4 animate-bounce-soft"
      >
        {/* Floating Stars */}
        <div className="absolute -top-6 -left-6 text-4xl animate-wiggle">⭐</div>
        <div
          className="absolute -top-6 -right-6 text-4xl animate-wiggle"
          style={{ animationDelay: '0.2s' }}
        >
          ✨
        </div>
        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
          <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-pink-500 text-white font-extrabold text-xs shadow-lg flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> 发现隐藏拼词彩蛋！
          </span>
        </div>

        {/* Word Badge */}
        <div className="px-6 py-2 rounded-2xl bg-indigo-900 text-yellow-300 font-black text-2xl sm:text-3xl tracking-widest shadow-inner border-2 border-yellow-400">
          {egg.word}
        </div>

        {/* Giant Mascot Animated Emoji */}
        <div className="relative my-2">
          <div className="text-8xl sm:text-9xl animate-wiggle filter drop-shadow-2xl">
            {egg.emoji}
          </div>
          <div className="absolute inset-0 flex items-center justify-center animate-ping opacity-25">
            <div className="w-32 h-32 rounded-full" style={{ backgroundColor: egg.themeColor }} />
          </div>
        </div>

        {/* Title & Desc */}
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-wide">
            {egg.title}
          </h2>
          <p className="text-sm sm:text-base font-bold text-slate-600">{egg.desc}</p>
        </div>

        {/* Close hint button */}
        <button
          onClick={onClose}
          className="mt-3 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-sm sm:text-base shadow-lg hover:brightness-110 active:scale-95 transition"
        >
          太棒啦！继续探索 🚀
        </button>
      </div>
    </div>
  );
};
