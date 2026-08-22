import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { LETTERS_DATA, NUMBERS_DATA } from '../data/gameData';
import { KeyPress } from '../types';
import { soundEngine } from '../utils/soundEngine';
import { Volume2, Trophy, Flame, Sparkles } from 'lucide-react';

interface BalloonItem {
  id: string;
  symbol: string;
  type: 'letter' | 'number';
  emoji: string;
  nameCn: string;
  nameEn: string;
  color: string;
  x: number; // percentage 10% to 90%
  y: number; // percentage 10% to 100%
  speed: number;
  isTarget: boolean;
  isPopping?: boolean;
}

interface BalloonPopModeProps {
  latestKeyPress: KeyPress | null;
  onSuccessCount?: () => void;
  onTargetKeyChange?: (key: string) => void;
}

export const BalloonPopMode: React.FC<BalloonPopModeProps> = ({
  latestKeyPress,
  onSuccessCount,
  onTargetKeyChange
}) => {
  const [balloons, setBalloons] = useState<BalloonItem[]>([]);
  const [currentTarget, setCurrentTarget] = useState<{
    symbol: string;
    type: 'letter' | 'number';
    emoji: string;
    nameCn: string;
    nameEn: string;
  } | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedbackText, setFeedbackText] = useState<string>('准备好了吗？开始打气球啦！🎈');

  const balloonColors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'];

  // Start new round / target
  const startNewTarget = () => {
    // 60% letters, 40% numbers
    const isLetter = Math.random() > 0.4;
    let targetSymbol = '';
    let targetEmoji = '';
    let targetNameCn = '';
    let targetNameEn = '';

    if (isLetter) {
      const letters = Object.keys(LETTERS_DATA);
      targetSymbol = letters[Math.floor(Math.random() * letters.length)];
      const data = LETTERS_DATA[targetSymbol];
      targetEmoji = data.items[0].emoji;
      targetNameCn = data.items[0].nameCn;
      targetNameEn = data.items[0].name;
    } else {
      const num = Math.floor(Math.random() * 10);
      targetSymbol = `${num}`;
      const data = NUMBERS_DATA[num];
      targetEmoji = data.emoji;
      targetNameCn = data.nameCn;
      targetNameEn = data.name;
    }

    const targetObj = {
      symbol: targetSymbol,
      type: isLetter ? ('letter' as const) : ('number' as const),
      emoji: targetEmoji,
      nameCn: targetNameCn,
      nameEn: targetNameEn
    };

    setCurrentTarget(targetObj);
    if (onTargetKeyChange) onTargetKeyChange(targetSymbol);

    // Create 4-5 balloons including the target balloon
    const newBalloons: BalloonItem[] = [];
    // 1. Target balloon
    newBalloons.push({
      id: `target-${Date.now()}`,
      symbol: targetSymbol,
      type: targetObj.type,
      emoji: targetEmoji,
      nameCn: targetNameCn,
      nameEn: targetNameEn,
      color: balloonColors[Math.floor(Math.random() * balloonColors.length)],
      x: Math.random() * 60 + 20,
      y: 85,
      speed: Math.random() * 0.15 + 0.1,
      isTarget: true
    });

    // 2. Distractor balloons
    const letters = Object.keys(LETTERS_DATA);
    for (let i = 0; i < 3; i++) {
      const otherChar = letters[Math.floor(Math.random() * letters.length)];
      if (otherChar !== targetSymbol) {
        const item = LETTERS_DATA[otherChar].items[0];
        newBalloons.push({
          id: `distract-${i}-${Date.now()}`,
          symbol: otherChar,
          type: 'letter',
          emoji: item.emoji,
          nameCn: item.nameCn,
          nameEn: item.name,
          color: balloonColors[(i + 1) % balloonColors.length],
          x: Math.random() * 70 + 15,
          y: 90 + i * 8,
          speed: Math.random() * 0.15 + 0.1,
          isTarget: false
        });
      }
    }

    setBalloons(newBalloons);

    // Voice announcement (Number vs Letter)
    if (targetObj.type === 'number') {
      soundEngine.speakNumberFeedback(parseInt(targetSymbol, 10));
    } else {
      soundEngine.speakLetterFeedback(targetSymbol, targetNameEn, targetNameCn, 0);
    }
    setFeedbackText(`寻找目标：【${targetSymbol}】${targetNameCn} ${targetEmoji}`);
  };

  // Initial round
  useEffect(() => {
    startNewTarget();
  }, []);

  // Ascend balloons animation frame
  useEffect(() => {
    const interval = setInterval(() => {
      setBalloons(prev => {
        return prev.map(b => {
          let nextY = b.y - b.speed;
          if (nextY < 15) {
            nextY = 95; // loop back down
          }
          return { ...b, y: nextY };
        });
      });
    }, 40);

    return () => clearInterval(interval);
  }, []);

  // Handle incoming keyboard press
  useEffect(() => {
    if (!latestKeyPress || !currentTarget) return;

    const pressed = latestKeyPress.key.toUpperCase();
    const target = currentTarget.symbol.toUpperCase();

    if (pressed === target) {
      // MATCH! POP BALLOON!
      soundEngine.playPop();
      soundEngine.playSparkle();
      
      // Target voice confirmation
      if (currentTarget.type === 'number') {
        soundEngine.speakNumberFeedback(parseInt(target, 10));
      } else {
        soundEngine.speakLetterFeedback(target, currentTarget.nameEn, currentTarget.nameCn, 0);
      }

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.5 }
      });

      setScore(s => s + 10);
      setStreak(st => st + 1);
      setFeedbackText(`🎉 太棒啦！成功击破【${target}】！`);
      if (onSuccessCount) onSuccessCount();

      // Trigger pop animation on target balloon
      setBalloons(prev =>
        prev.map(b => (b.isTarget ? { ...b, isPopping: true } : b))
      );

      setTimeout(() => {
        startNewTarget();
      }, 1200);
    } else {
      // Friendly miss
      soundEngine.playBoing();
      setStreak(0);
      setFeedbackText(`你按下了【${pressed}】，再找找看【${target}】在哪里吧！💡`);
      
      const numVal = parseInt(pressed, 10);
      if (!isNaN(numVal)) {
        soundEngine.speakNumberFeedback(numVal);
      } else if (pressed.length === 1 && pressed >= 'A' && pressed <= 'Z') {
        soundEngine.speakLetterFeedback(pressed, '', '', 0);
      }
    }
  }, [latestKeyPress]);

  const speakPromptAgain = () => {
    if (!currentTarget) return;
    soundEngine.playPop();
    if (currentTarget.type === 'number') {
      soundEngine.speakNumberFeedback(parseInt(currentTarget.symbol, 10));
    } else {
      soundEngine.speakLetterFeedback(currentTarget.symbol, currentTarget.nameEn, currentTarget.nameCn, 0);
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      {/* Top Banner Info */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 w-11/12 max-w-xl">
        <div className="flex items-center justify-between px-4 py-2.5 bg-white/90 backdrop-blur-xl rounded-3xl border-4 border-yellow-300 shadow-xl">
          {/* Target Display */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-slate-500">寻找目标:</span>
            <div className="px-3 py-1 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black text-xl shadow-md animate-pulse">
              {currentTarget?.symbol}
            </div>
            <span className="text-2xl animate-bounce-soft">{currentTarget?.emoji}</span>
            <span className="text-sm font-black text-slate-700">{currentTarget?.nameCn}</span>
          </div>

          {/* Repeat Voice Button */}
          <button
            onClick={speakPromptAgain}
            className="p-2 rounded-2xl bg-yellow-100 hover:bg-yellow-200 text-yellow-900 transition active:scale-95 shadow-sm flex items-center gap-1"
            title="再听一遍"
          >
            <Volume2 className="w-5 h-5 text-amber-600" />
            <span className="text-xs font-black">再听一遍</span>
          </button>

          {/* Stats */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-amber-500 font-black text-sm">
              <Trophy className="w-4 h-4" /> {score}
            </div>
            {streak > 1 && (
              <div className="flex items-center gap-0.5 text-rose-500 font-black text-xs bg-rose-100 px-2 py-0.5 rounded-full animate-bounce">
                <Flame className="w-3.5 h-3.5" /> {streak}连击
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Prompt Bar */}
      <div className="absolute top-36 left-1/2 -translate-x-1/2 z-10">
        <span className="px-4 py-1.5 rounded-full bg-slate-900/60 backdrop-blur-md text-white font-black text-xs sm:text-sm shadow-lg animate-pop-in">
          {feedbackText}
        </span>
      </div>

      {/* Balloon Canvas Playground Area */}
      <div className="relative w-full h-full">
        {balloons.map(b => (
          <div
            key={b.id}
            onClick={() => {
              // Clicking also triggers press
              if (currentTarget && b.symbol === currentTarget.symbol) {
                soundEngine.playPop();
                if (currentTarget.type === 'number') {
                  soundEngine.speakNumberFeedback(parseInt(currentTarget.symbol, 10));
                } else {
                  soundEngine.speakLetterFeedback(currentTarget.symbol, currentTarget.nameEn, currentTarget.nameCn, 0);
                }
                setScore(s => s + 10);
                setStreak(st => st + 1);
                if (onSuccessCount) onSuccessCount();
                setBalloons(prev =>
                  prev.map(item => (item.id === b.id ? { ...item, isPopping: true } : item))
                );
                setTimeout(startNewTarget, 1000);
              }
            }}
            className={`absolute -translate-x-1/2 transition-transform cursor-pointer ${
              b.isPopping ? 'animate-pop-out scale-150 opacity-0 pointer-events-none' : 'hover:scale-110 active:scale-95'
            }`}
            style={{
              left: `${b.x}%`,
              top: `${b.y}%`
            }}
          >
            {/* Balloon Body */}
            <div
              className="relative w-20 h-24 sm:w-24 sm:h-28 rounded-[50%_50%_50%_50%_/_40%_40%_60%_60%] shadow-2xl flex flex-col items-center justify-center p-2 text-white border-2 border-white/40"
              style={{
                backgroundColor: b.color,
                boxShadow: `0 15px 35px ${b.color}77, inset 0 6px 12px rgba(255,255,255,0.4)`
              }}
            >
              {/* Highlight gleam */}
              <div className="absolute top-3 left-4 w-4 h-6 rounded-full bg-white/40 rotate-[-25deg] blur-[1px]" />

              {/* Symbol */}
              <span className="text-3xl sm:text-4xl font-black drop-shadow-md tracking-wider">
                {b.symbol}
              </span>
              <span className="text-xl sm:text-2xl mt-0.5 filter drop-shadow">
                {b.emoji}
              </span>

              {/* Knot at bottom */}
              <div
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border border-white/20"
                style={{ backgroundColor: b.color }}
              />
              {/* String */}
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-white/60" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
