import React, { useState, useEffect, useRef } from 'react';
import { LETTERS_DATA, NUMBERS_DATA } from '../data/gameData';
import { KeyPress } from '../types';
import { soundEngine } from '../utils/soundEngine';
import confetti from 'canvas-confetti';
import { Star, Sparkles, Volume2, Trophy, HelpCircle } from 'lucide-react';

interface BalloonItem {
  id: string;
  symbol: string;
  type: 'letter' | 'number';
  emoji: string;
  nameCn: string;
  nameEn: string;
  color: string;
  x: number; // percentage 10% to 90%
  y: number; // percentage
  speed: number;
  isTarget: boolean;
  isPopping?: boolean;
}

interface BalloonPopModeProps {
  latestKeyPress: KeyPress | null;
  onTargetKeyChange?: (key: string | null) => void;
  onSuccessCount?: () => void;
}

export const BalloonPopMode: React.FC<BalloonPopModeProps> = ({
  latestKeyPress,
  onTargetKeyChange,
  onSuccessCount
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
    // 70% letters, 30% numbers
    const isLetter = Math.random() > 0.3;
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

    // Voice announcement
    soundEngine.speakPrompt(`请在键盘上找到并按下：字母 ${targetSymbol}，${targetNameCn}！`);
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
      soundEngine.speak(`太棒啦！按对了 ${target}！`);

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
      soundEngine.speakPrompt(`这是 ${pressed} 哦，快按 ${target}！`);
    }
  }, [latestKeyPress]);

  const speakPromptAgain = () => {
    if (!currentTarget) return;
    soundEngine.playPop();
    soundEngine.speakPrompt(`请按键盘上的【${currentTarget.symbol}】！${currentTarget.nameCn}！`);
  };

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      {/* Top Header Mission Quest Board */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 w-11/12 max-w-xl animate-pop-in">
        <div className="flex items-center justify-between px-4 py-3 bg-white/90 backdrop-blur-xl rounded-3xl border-4 border-yellow-300 shadow-2xl">
          {/* Target Symbol Highlight */}
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-pink-500 text-white flex items-center justify-center text-3xl font-black shadow-md animate-bounce">
              {currentTarget?.symbol}
            </div>
            <div className="text-left">
              <div className="text-xs font-black text-slate-400 uppercase">
                任务目标
              </div>
              <div className="text-base sm:text-lg font-black text-slate-800 flex items-center gap-1.5">
                <span>按键:</span>
                <span className="text-pink-600 text-xl font-black">
                  【{currentTarget?.symbol}】
                </span>
                <span>{currentTarget?.emoji}</span>
                <span className="text-slate-600">{currentTarget?.nameCn}</span>
              </div>
            </div>
          </div>

          {/* Voice Repeat & Score */}
          <div className="flex items-center gap-3">
            <button
              onClick={speakPromptAgain}
              className="p-2.5 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 transition active:scale-95 shadow-sm"
              title="重复语音提示"
            >
              <Volume2 className="w-5 h-5" />
            </button>
            <div className="flex flex-col items-end">
              <span className="flex items-center gap-1 text-amber-500 font-black text-lg">
                <Star className="w-5 h-5 fill-amber-400" /> {score}
              </span>
              {streak > 1 && (
                <span className="text-[11px] font-black text-pink-600 animate-pulse">
                  🔥 {streak} 连胜!
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Balloons Playground */}
      <div className="absolute inset-0 pt-36 pb-48 pointer-events-none">
        {balloons.map(b => (
          <div
            key={b.id}
            className={`absolute transition-transform duration-300 flex flex-col items-center pointer-events-auto cursor-pointer ${
              b.isPopping ? 'scale-150 opacity-0 duration-200' : 'animate-wiggle'
            }`}
            style={{
              left: `${b.x}%`,
              top: `${b.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
            onClick={() => {
              // Clicking also validates!
              if (b.isTarget) {
                // simulate keypress
                soundEngine.playPop();
                setScore(s => s + 10);
                startNewTarget();
              }
            }}
          >
            {/* Balloon Body */}
            <div
              className="relative w-20 h-24 sm:w-24 sm:h-28 rounded-full shadow-2xl flex flex-col items-center justify-center text-white border-2 border-white/40"
              style={{
                backgroundColor: b.color,
                boxShadow: `0 15px 30px ${b.color}66`
              }}
            >
              {/* Highlight shine */}
              <div className="absolute top-3 left-4 w-4 h-6 rounded-full bg-white/40 rotate-12" />

              {/* Balloon Symbol */}
              <span className="text-3xl sm:text-4xl font-black drop-shadow-md">
                {b.symbol}
              </span>
              <span className="text-2xl sm:text-3xl mt-0.5">{b.emoji}</span>

              {/* Balloon knot */}
              <div
                className="absolute -bottom-2 w-3 h-3 rotate-45"
                style={{ backgroundColor: b.color }}
              />
            </div>

            {/* Balloon String */}
            <div className="w-0.5 h-12 bg-slate-400/60" />
          </div>
        ))}
      </div>

      {/* Feedback Toast at Bottom */}
      <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <div className="px-5 py-2 rounded-full bg-slate-900/80 backdrop-blur-md text-white font-extrabold text-xs sm:text-sm shadow-xl border border-white/20">
          {feedbackText}
        </div>
      </div>
    </div>
  );
};
