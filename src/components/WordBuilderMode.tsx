import React, { useState, useEffect } from 'react';
import { soundEngine } from '../utils/soundEngine';
import { KeyPress } from '../types';
import confetti from 'canvas-confetti';
import { Sparkles, Star, Volume2, HelpCircle } from 'lucide-react';

interface WordPuzzle {
  word: string;
  nameCn: string;
  emoji: string;
  missingIndex: number; // index of the blank letter (e.g. 1 for 'C _ T')
  themeColor: string;
  soundType: 'meow' | 'boing' | 'sparkle' | 'swoosh' | 'quack';
}

const PUZZLES: WordPuzzle[] = [
  { word: 'CAT', nameCn: '小猫', emoji: '🐱', missingIndex: 1, themeColor: '#F97316', soundType: 'meow' },
  { word: 'DOG', nameCn: '小狗', emoji: '🐶', missingIndex: 2, themeColor: '#EAB308', soundType: 'boing' },
  { word: 'SUN', nameCn: '太阳', emoji: '☀️', missingIndex: 1, themeColor: '#F59E0B', soundType: 'sparkle' },
  { word: 'CAR', nameCn: '汽车', emoji: '🚗', missingIndex: 0, themeColor: '#EF4444', soundType: 'swoosh' },
  { word: 'PIG', nameCn: '小猪', emoji: '🐷', missingIndex: 1, themeColor: '#EC4899', soundType: 'boing' },
  { word: 'FOX', nameCn: '狐狸', emoji: '🦊', missingIndex: 2, themeColor: '#EA580C', soundType: 'sparkle' },
  { word: 'BEE', nameCn: '蜜蜂', emoji: '🐝', missingIndex: 1, themeColor: '#FACC15', soundType: 'sparkle' },
  { word: 'BUS', nameCn: '巴士', emoji: '🚌', missingIndex: 1, themeColor: '#3B82F6', soundType: 'swoosh' },
  { word: 'EGG', nameCn: '鸡蛋', emoji: '🥚', missingIndex: 0, themeColor: '#F59E0B', soundType: 'boing' },
  { word: 'ICE', nameCn: '冰块', emoji: '🧊', missingIndex: 1, themeColor: '#38BDF8', soundType: 'sparkle' }
];

interface WordBuilderModeProps {
  latestKeyPress: KeyPress | null;
  onTargetKeyChange?: (key: string | null) => void;
  onSuccessCount?: () => void;
}

export const WordBuilderMode: React.FC<WordBuilderModeProps> = ({
  latestKeyPress,
  onTargetKeyChange,
  onSuccessCount
}) => {
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const currentPuzzle = PUZZLES[puzzleIndex % PUZZLES.length];
  const targetChar = currentPuzzle.word[currentPuzzle.missingIndex];

  useEffect(() => {
    setIsCompleted(false);
    if (onTargetKeyChange) onTargetKeyChange(targetChar);

    soundEngine.speakLetterFeedback(targetChar, currentPuzzle.word, currentPuzzle.nameCn, 0);
  }, [puzzleIndex]);

  // Handle incoming keyboard press
  useEffect(() => {
    if (!latestKeyPress || isCompleted) return;

    const pressed = latestKeyPress.key.toUpperCase();

    if (pressed === targetChar) {
      // SUCCESS!
      setIsCompleted(true);
      soundEngine.playSoundByType(currentPuzzle.soundType);
      soundEngine.playSparkle();
      soundEngine.playEggVoice(currentPuzzle.word);

      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.55 }
      });

      setScore(s => s + 10);
      if (onSuccessCount) onSuccessCount();

      setTimeout(() => {
        setPuzzleIndex(p => p + 1);
      }, 2500);
    } else if (pressed.length === 1 && pressed >= 'A' && pressed <= 'Z') {
      soundEngine.playBoing();
      soundEngine.playWrongPrompt();
    }
  }, [latestKeyPress]);

  const speakClue = () => {
    soundEngine.playPop();
    soundEngine.speakLetterFeedback(targetChar, currentPuzzle.word, currentPuzzle.nameCn, 0);
  };

  return (
    <div className="relative w-full h-full overflow-hidden select-none flex flex-col items-center justify-center pb-32 pt-16">
      {/* Top Header info */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 w-11/12 max-w-lg">
        <div className="flex items-center justify-between px-4 py-2.5 bg-white/90 backdrop-blur-xl rounded-3xl border-4 border-pink-300 shadow-xl">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧩</span>
            <span className="text-sm sm:text-base font-black text-slate-800">
              魔法单词拼图
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={speakClue}
              className="p-2 rounded-2xl bg-pink-100 hover:bg-pink-200 text-pink-900 transition active:scale-95 shadow-sm"
              title="听语音提示"
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1 text-amber-500 font-black text-base">
              <Star className="w-4 h-4 fill-amber-400" /> {score}
            </div>
          </div>
        </div>
      </div>

      {/* Main Puzzle Card */}
      <div className="relative w-11/12 max-w-md bg-white/95 rounded-3xl border-4 border-yellow-300 shadow-2xl p-6 sm:p-8 flex flex-col items-center gap-4 animate-pop-in">
        {/* Floating Stars */}
        <div className="absolute -top-5 -right-5 text-4xl animate-wiggle">⭐</div>
        <div className="absolute -bottom-4 -left-4 text-3xl animate-bounce">✨</div>

        {/* Big Animated Emoji */}
        <div
          className={`text-8xl sm:text-9xl transition-transform duration-300 ${
            isCompleted ? 'scale-125 animate-bounce' : 'animate-bounce-soft'
          }`}
        >
          {currentPuzzle.emoji}
        </div>

        {/* Chinese Name */}
        <div className="text-lg sm:text-xl font-black text-slate-700">
          {currentPuzzle.nameCn}
        </div>

        {/* Word Tiles with Missing Blank */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 my-2">
          {currentPuzzle.word.split('').map((char, idx) => {
            const isBlank = idx === currentPuzzle.missingIndex;
            const showChar = !isBlank || isCompleted;

            return (
              <div
                key={idx}
                className={`w-14 h-16 sm:w-18 sm:h-20 rounded-2xl sm:rounded-3xl border-4 flex items-center justify-center text-3xl sm:text-4xl font-black shadow-lg transition-all duration-300 ${
                  showChar
                    ? isCompleted
                      ? 'bg-gradient-to-tr from-emerald-400 to-teal-400 text-white border-emerald-300 scale-105 animate-pop-in'
                      : 'bg-white text-slate-800 border-indigo-200'
                    : 'bg-amber-100/90 text-amber-900 border-dashed border-amber-400 animate-pulse ring-4 ring-yellow-300'
                }`}
              >
                {showChar ? char : '?'}
              </div>
            );
          })}
        </div>

        {/* Clue Prompt */}
        <div className="text-xs sm:text-sm font-bold text-slate-600 bg-slate-100 px-4 py-2 rounded-2xl">
          {isCompleted ? (
            <span className="text-emerald-600 font-black">
              🎉 拼词成功！{currentPuzzle.word} - {currentPuzzle.nameCn}！
            </span>
          ) : (
            <span>
              💡 提示：在键盘上按下缺少的字母{' '}
              <b className="text-pink-600 text-base">【{targetChar}】</b>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
