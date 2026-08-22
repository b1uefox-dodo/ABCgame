import React, { useState } from 'react';
import { LETTERS_DATA, NUMBERS_DATA } from '../data/gameData';
import { Volume2, Sparkles, ChevronDown, ChevronUp, Shuffle } from 'lucide-react';

interface VirtualKeyboardProps {
  activeKey: string | null;
  onKeyPress: (key: string) => void;
  targetKey?: string | null; // For challenge modes where we hint the next key
}

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  activeKey,
  onKeyPress,
  targetKey
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [layoutMode, setLayoutMode] = useState<'qwerty' | 'alphabetical'>('qwerty');

  const numberRow = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

  const qwertyRows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
  ];

  const alphaRows = [
    ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'],
    ['J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R'],
    ['S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
  ];

  const currentLetterRows = layoutMode === 'qwerty' ? qwertyRows : alphaRows;

  const getKeyEmoji = (key: string): string => {
    const upper = key.toUpperCase();
    if (LETTERS_DATA[upper]) {
      return LETTERS_DATA[upper].items[0].emoji;
    }
    const num = parseInt(key, 10);
    if (!isNaN(num) && NUMBERS_DATA[num]) {
      return NUMBERS_DATA[num].emoji;
    }
    return '';
  };

  const isHighlighted = (key: string) => {
    return (
      activeKey?.toUpperCase() === key.toUpperCase() ||
      (key === ' ' && activeKey === 'Space')
    );
  };

  const isTarget = (key: string) => {
    return targetKey && targetKey.toUpperCase() === key.toUpperCase();
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-2 select-none pointer-events-auto">
      {/* Keyboard Controls Bar */}
      <div className="flex items-center justify-between px-3 py-1 bg-white/40 backdrop-blur-md rounded-t-2xl border-t border-x border-white/60 text-xs text-slate-700 font-bold">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-indigo-700">
            <Sparkles className="w-3.5 h-3.5" /> 萌趣键盘
          </span>
          <button
            onClick={() => setLayoutMode(m => (m === 'qwerty' ? 'alphabetical' : 'qwerty'))}
            className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/80 hover:bg-white text-indigo-600 shadow-sm transition active:scale-95"
            title="切换按键排列方式"
          >
            <Shuffle className="w-3 h-3" />
            {layoutMode === 'qwerty' ? '标准 QWERTY 键盘' : '字母顺 A-Z 键盘'}
          </button>
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/80 hover:bg-white text-slate-600 shadow-sm transition active:scale-95"
        >
          {isCollapsed ? (
            <>
              展开键盘 <ChevronUp className="w-3.5 h-3.5" />
            </>
          ) : (
            <>
              收起 <ChevronDown className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>

      {!isCollapsed && (
        <div className="bg-slate-900/40 backdrop-blur-xl p-2.5 sm:p-3 rounded-b-3xl border-b border-x border-white/40 shadow-2xl flex flex-col gap-1.5 sm:gap-2">
          {/* Numbers Row */}
          <div className="flex justify-center gap-1 sm:gap-1.5">
            {numberRow.map(numStr => {
              const active = isHighlighted(numStr);
              const target = isTarget(numStr);
              const emoji = getKeyEmoji(numStr);
              return (
                <button
                  key={numStr}
                  onClick={() => onKeyPress(numStr)}
                  className={`key-cap relative flex-1 h-10 sm:h-12 max-w-[56px] rounded-xl flex flex-col items-center justify-center font-extrabold text-sm sm:text-base transition-all duration-75 shadow-[0_4px_0_rgba(0,0,0,0.25)] ${
                    active
                      ? 'bg-amber-300 text-amber-950 scale-95 translate-y-1 shadow-[0_1px_0_rgba(0,0,0,0.2)]'
                      : target
                      ? 'bg-amber-400 text-amber-950 animate-bounce ring-4 ring-yellow-300 shadow-amber-600'
                      : 'bg-gradient-to-b from-amber-400 to-amber-500 text-white hover:brightness-105'
                  }`}
                >
                  <span className="text-xs leading-none">{emoji}</span>
                  <span className="leading-tight">{numStr}</span>
                </button>
              );
            })}
            {/* Backspace Button */}
            <button
              onClick={() => onKeyPress('Backspace')}
              className={`key-cap relative flex-[1.4] h-10 sm:h-12 max-w-[80px] rounded-xl flex flex-col items-center justify-center font-bold text-xs sm:text-sm transition-all duration-75 shadow-[0_4px_0_rgba(0,0,0,0.25)] ${
                isHighlighted('Backspace')
                  ? 'bg-rose-400 text-white scale-95 translate-y-1'
                  : 'bg-gradient-to-b from-rose-500 to-rose-600 text-white hover:brightness-105'
              }`}
              title="退格清屏：咕噜吸尘怪兽！"
            >
              <span>🌪️</span>
              <span>清屏</span>
            </button>
          </div>

          {/* Letter Rows */}
          {currentLetterRows.map((row, rIdx) => (
            <div key={rIdx} className="flex justify-center gap-1 sm:gap-1.5">
              {row.map(char => {
                const active = isHighlighted(char);
                const target = isTarget(char);
                const emoji = getKeyEmoji(char);
                const letterColor = LETTERS_DATA[char]?.color || '#3B82F6';

                return (
                  <button
                    key={char}
                    onClick={() => onKeyPress(char)}
                    style={{
                      backgroundColor: active ? '#FDE047' : undefined
                    }}
                    className={`key-cap relative flex-1 h-11 sm:h-13 max-w-[62px] rounded-xl sm:rounded-2xl flex flex-col items-center justify-center font-extrabold text-sm sm:text-lg transition-all duration-75 shadow-[0_4px_0_rgba(0,0,0,0.28)] ${
                      active
                        ? 'text-slate-900 scale-95 translate-y-1 shadow-[0_1px_0_rgba(0,0,0,0.2)] ring-4 ring-yellow-400'
                        : target
                        ? 'bg-emerald-400 text-emerald-950 animate-bounce ring-4 ring-emerald-300'
                        : 'bg-gradient-to-b from-white to-slate-100 text-slate-800 hover:brightness-105'
                    }`}
                  >
                    <span className="text-[10px] sm:text-xs leading-none opacity-90">{emoji}</span>
                    <span className="leading-tight drop-shadow-sm font-black" style={{ color: active ? '#000' : letterColor }}>
                      {char}
                    </span>
                  </button>
                );
              })}
            </div>
          ))}

          {/* Bottom Special Function Row */}
          <div className="flex justify-center gap-1 sm:gap-2 pt-0.5">
            {/* Surprise Gift Button (Enter) */}
            <button
              onClick={() => onKeyPress('Enter')}
              className={`key-cap flex-[1.2] max-w-[130px] h-10 sm:h-12 rounded-xl flex items-center justify-center gap-1 text-xs sm:text-sm font-extrabold shadow-[0_4px_0_rgba(0,0,0,0.25)] ${
                isHighlighted('Enter')
                  ? 'bg-purple-300 text-purple-950 scale-95 translate-y-1'
                  : 'bg-gradient-to-b from-purple-500 to-purple-600 text-white hover:brightness-105'
              }`}
              title="回车键：神秘开箱惊喜！"
            >
              <span className="text-base">🎁</span>
              <span>回车惊喜</span>
            </button>

            {/* Spacebar (Confetti Party Cannon) */}
            <button
              onClick={() => onKeyPress(' ')}
              className={`key-cap flex-[3] max-w-[360px] h-10 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 text-xs sm:text-sm font-black shadow-[0_4px_0_rgba(0,0,0,0.25)] ${
                isHighlighted(' ')
                  ? 'bg-gradient-to-r from-pink-400 via-yellow-300 to-cyan-400 text-slate-900 scale-95 translate-y-1'
                  : 'bg-gradient-to-r from-pink-500 via-amber-400 to-sky-500 text-white hover:brightness-105'
              }`}
              title="空格键：彩虹礼炮狂欢！"
            >
              <span className="text-base animate-spin-slow">🎉</span>
              <span>空格键 • 彩虹礼炮 PARTY</span>
              <span className="text-base animate-spin-slow">✨</span>
            </button>

            {/* Mascot Jump Button (ArrowUp) */}
            <button
              onClick={() => onKeyPress('ArrowUp')}
              className={`key-cap flex-1 max-w-[100px] h-10 sm:h-12 rounded-xl flex items-center justify-center gap-1 text-xs sm:text-sm font-extrabold shadow-[0_4px_0_rgba(0,0,0,0.25)] ${
                isHighlighted('ArrowUp')
                  ? 'bg-emerald-300 text-emerald-950 scale-95 translate-y-1'
                  : 'bg-gradient-to-b from-emerald-500 to-teal-600 text-white hover:brightness-105'
              }`}
              title="方向键：跳跃探险！"
            >
              <span className="text-base">🚀</span>
              <span>跳跃 ↑</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
