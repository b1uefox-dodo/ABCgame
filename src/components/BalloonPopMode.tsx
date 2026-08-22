import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { LETTERS_DATA, NUMBERS_DATA } from '../data/gameData';
import { KeyPress } from '../types';
import { soundEngine } from '../utils/soundEngine';
import { Volume2, Trophy, Flame, CheckCircle2, XCircle, Sparkles, HelpCircle } from 'lucide-react';

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

  // Status feedback: 'idle' | 'correct' | 'wrong' | 'next_round'
  const [feedbackState, setFeedbackState] = useState<'idle' | 'correct' | 'wrong' | 'next_round'>('idle');
  const [feedbackMsg, setFeedbackMsg] = useState<string>('准备好了吗？开始打气球啦！🎈');
  const [lastWrongKey, setLastWrongKey] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  const balloonColors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'];
  const transitionTimerRef = useRef<number | null>(null);
  const wrongTimerRef = useRef<number | null>(null);

  // Start new round / target
  const startNewTarget = () => {
    setIsTransitioning(false);
    setFeedbackState('idle');
    setLastWrongKey(null);

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

    // Create balloons
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
    setFeedbackMsg(`寻找目标：【${targetSymbol}】${targetNameCn} ${targetEmoji}`);

    // Voice announcement (Number vs Letter)
    if (targetObj.type === 'number') {
      soundEngine.speakNumberFeedback(parseInt(targetSymbol, 10));
    } else {
      soundEngine.speakLetterFeedback(targetSymbol, targetNameEn, targetNameCn, 0);
    }
  };

  // Initial round
  useEffect(() => {
    startNewTarget();
    return () => {
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
      if (wrongTimerRef.current) clearTimeout(wrongTimerRef.current);
    };
  }, []);

  // Ascend balloons animation frame
  useEffect(() => {
    if (isTransitioning) return;

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
  }, [isTransitioning]);

  // Handle Correct Pop
  const handleCorrectHit = (target: string) => {
    if (isTransitioning || !currentTarget) return;

    setIsTransitioning(true);
    setFeedbackState('correct');
    setFeedbackMsg(`🎉 答对啦！击破【${target}】！`);

    soundEngine.playPop();
    soundEngine.playSparkle();
    soundEngine.playVoiceFile('/audio/prompts/correct.m4a');

    confetti({
      particleCount: 65,
      spread: 70,
      origin: { y: 0.5 }
    });

    setScore(s => s + 10);
    setStreak(st => st + 1);
    if (onSuccessCount) onSuccessCount();

    // Trigger pop explosion animation on target balloon
    setBalloons(prev =>
      prev.map(b => (b.isTarget ? { ...b, isPopping: true } : b))
    );

    // Transition pacing:
    // 1. Let explosion and success sound play (600ms)
    // 2. Show brief "下一题准备中..." intermission (600ms)
    // Total clear delay before next question ~1200ms with distinct 600ms gap
    transitionTimerRef.current = window.setTimeout(() => {
      setFeedbackState('next_round');
      setFeedbackMsg('✨ 太棒啦！下一题准备中... 🎈');
      setBalloons([]); // Clear old round balloons for fresh calm moment

      transitionTimerRef.current = window.setTimeout(() => {
        startNewTarget();
      }, 650);
    }, 600);
  };

  // Handle Incorrect Press
  const handleWrongHit = (pressed: string, target: string) => {
    if (isTransitioning) return;

    setFeedbackState('wrong');
    setLastWrongKey(pressed);
    setStreak(0);
    setFeedbackMsg(`💡 不对哦，刚刚按了【${pressed}】，快找找【${target}】吧！`);

    soundEngine.playBoing();
    soundEngine.playWrongPrompt();

    if (wrongTimerRef.current) clearTimeout(wrongTimerRef.current);
    wrongTimerRef.current = window.setTimeout(() => {
      setFeedbackState('idle');
      if (currentTarget) {
        setFeedbackMsg(`寻找目标：【${currentTarget.symbol}】${currentTarget.nameCn} ${currentTarget.emoji}`);
      }
    }, 1800);
  };

  // Handle incoming keyboard press
  useEffect(() => {
    if (!latestKeyPress || !currentTarget || isTransitioning) return;

    const pressed = latestKeyPress.key.toUpperCase();
    const target = currentTarget.symbol.toUpperCase();

    if (pressed === target) {
      handleCorrectHit(target);
    } else {
      handleWrongHit(pressed, target);
    }
  }, [latestKeyPress]);

  const speakPromptAgain = () => {
    if (!currentTarget || isTransitioning) return;
    soundEngine.playPop();
    if (currentTarget.type === 'number') {
      soundEngine.speakNumberFeedback(parseInt(currentTarget.symbol, 10));
    } else {
      soundEngine.speakLetterFeedback(currentTarget.symbol, currentTarget.nameEn, currentTarget.nameCn, 0);
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      {/* Top Banner Info & Dynamic Feedback HUD */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 w-11/12 max-w-xl">
        <div className="flex items-center justify-between px-4 py-2.5 bg-white/95 backdrop-blur-xl rounded-3xl border-4 border-yellow-300 shadow-xl gap-2">
          
          {/* Target Display */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-slate-500">目标:</span>
            <div className="px-3 py-1 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black text-xl shadow-md animate-pulse">
              {currentTarget?.symbol}
            </div>
            <span className="text-2xl animate-bounce-soft">{currentTarget?.emoji}</span>
            <span className="text-sm font-black text-slate-700 hidden sm:inline">{currentTarget?.nameCn}</span>
          </div>

          {/* Dynamic Interactive Feedback / Action Badge */}
          <div className="flex-1 flex justify-center">
            {feedbackState === 'correct' && (
              <div className="px-3 py-1.5 rounded-2xl bg-emerald-500 text-white font-black text-xs sm:text-sm shadow-md animate-bounce flex items-center gap-1.5 ring-2 ring-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-100" />
                <span>答对啦！太棒了 🎉</span>
              </div>
            )}

            {feedbackState === 'wrong' && (
              <div className="px-3 py-1.5 rounded-2xl bg-rose-500 text-white font-black text-xs sm:text-sm shadow-md animate-wiggle flex items-center gap-1.5 ring-2 ring-rose-300">
                <XCircle className="w-4 h-4 text-rose-100" />
                <span>按了【{lastWrongKey}】❌ 再试试！</span>
              </div>
            )}

            {feedbackState === 'next_round' && (
              <div className="px-3 py-1.5 rounded-2xl bg-indigo-500 text-white font-black text-xs sm:text-sm shadow-md animate-pulse flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-yellow-300 animate-spin-slow" />
                <span>下一题准备中... 🎈</span>
              </div>
            )}

            {feedbackState === 'idle' && (
              <button
                onClick={speakPromptAgain}
                className="px-3 py-1.5 rounded-2xl bg-yellow-100 hover:bg-yellow-200 text-yellow-900 transition active:scale-95 shadow-sm flex items-center gap-1 border border-yellow-300"
                title="点击再听一遍"
              >
                <Volume2 className="w-4 h-4 text-amber-600 animate-pulse" />
                <span className="text-xs font-black">听音提示 🔊</span>
              </button>
            )}
          </div>

          {/* Stats & Streak */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-amber-500 font-black text-sm bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200">
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
      <div className="absolute top-36 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <span
          className={`px-4 py-1.5 rounded-full backdrop-blur-md font-black text-xs sm:text-sm shadow-lg transition-all ${
            feedbackState === 'correct'
              ? 'bg-emerald-600 text-white scale-110'
              : feedbackState === 'wrong'
              ? 'bg-rose-600 text-white animate-wiggle'
              : feedbackState === 'next_round'
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-900/65 text-white'
          }`}
        >
          {feedbackMsg}
        </span>
      </div>

      {/* Balloon Canvas Playground Area */}
      <div className="relative w-full h-full">
        {balloons.map(b => (
          <div
            key={b.id}
            onClick={() => {
              if (isTransitioning) return;
              if (currentTarget && b.symbol === currentTarget.symbol) {
                handleCorrectHit(currentTarget.symbol);
              } else if (currentTarget) {
                handleWrongHit(b.symbol, currentTarget.symbol);
              }
            }}
            className={`absolute -translate-x-1/2 transition-transform cursor-pointer ${
              b.isPopping
                ? 'animate-pop-out scale-150 opacity-0 pointer-events-none'
                : 'hover:scale-110 active:scale-95'
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
