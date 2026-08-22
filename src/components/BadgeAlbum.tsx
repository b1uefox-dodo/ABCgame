import React, { useState } from 'react';
import { LETTERS_DATA, NUMBERS_DATA, EASTER_EGG_WORDS } from '../data/gameData';
import { X, Award, Sparkles, BookOpen, Star, CheckCircle } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

interface BadgeAlbumProps {
  discoveredLetters: Set<string>;
  discoveredNumbers: Set<number>;
  discoveredEggs: Set<string>;
  onClose: () => void;
  onItemClick?: (type: 'letter' | 'number' | 'egg', val: string | number) => void;
}

export const BadgeAlbum: React.FC<BadgeAlbumProps> = ({
  discoveredLetters,
  discoveredNumbers,
  discoveredEggs,
  onClose,
  onItemClick
}) => {
  const [activeTab, setActiveTab] = useState<'letters' | 'numbers' | 'eggs'>('letters');

  const totalLetters = Object.keys(LETTERS_DATA).length;
  const totalNumbers = NUMBERS_DATA.length;
  const totalEggs = EASTER_EGG_WORDS.length;

  const letterCount = discoveredLetters.size;
  const numberCount = discoveredNumbers.size;
  const eggCount = discoveredEggs.size;

  const totalScore = letterCount * 5 + numberCount * 5 + eggCount * 15;

  const getExplorerRank = () => {
    if (totalScore >= 180) return { title: '👑 键盘传奇大魔法师', color: 'text-amber-500' };
    if (totalScore >= 100) return { title: '⭐ 探险奇趣大师', color: 'text-purple-500' };
    if (totalScore >= 40) return { title: '🚀 闪亮探索小先锋', color: 'text-emerald-500' };
    return { title: '🌱 萌芽探索小萌新', color: 'text-blue-500' };
  };

  const rank = getExplorerRank();

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-3 sm:p-6"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl max-h-[90vh] bg-white/95 rounded-3xl shadow-2xl border-4 border-amber-300 flex flex-col overflow-hidden animate-pop-in text-slate-800"
      >
        {/* Album Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-amber-400 via-pink-400 to-indigo-400 text-white shadow-md">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            <div>
              <h2 className="text-xl sm:text-2xl font-black flex items-center gap-2">
                🌟 探索收集纪念册
              </h2>
              <p className="text-xs font-bold opacity-90">记录宝宝每次敲击键盘发现的奇妙宝贝！</p>
            </div>
          </div>
          <button
            onClick={() => {
              soundEngine.playPop();
              onClose();
            }}
            className="p-1.5 rounded-full bg-black/20 hover:bg-black/40 active:scale-95 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Explorer Rank Status Banner */}
        <div className="flex items-center justify-between px-5 py-2.5 bg-amber-50 border-b border-amber-200">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <span className="text-xs sm:text-sm font-extrabold text-slate-700">称号:</span>
            <span className={`text-sm sm:text-base font-black ${rank.color}`}>{rank.title}</span>
          </div>
          <div className="flex items-center gap-3 text-xs sm:text-sm font-black text-slate-600">
            <span>
              ✨ 探索能量: <b className="text-pink-600">{totalScore}</b>
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-100/80 p-1.5 gap-2">
          <button
            onClick={() => {
              soundEngine.playPop();
              setActiveTab('letters');
            }}
            className={`flex-1 py-2 rounded-2xl font-black text-xs sm:text-sm transition flex items-center justify-center gap-1.5 ${
              activeTab === 'letters'
                ? 'bg-white shadow text-indigo-600 border border-indigo-200'
                : 'text-slate-600 hover:bg-white/50'
            }`}
          >
            <span>🔤 字母图鉴</span>
            <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-xs">
              {letterCount}/{totalLetters}
            </span>
          </button>

          <button
            onClick={() => {
              soundEngine.playPop();
              setActiveTab('numbers');
            }}
            className={`flex-1 py-2 rounded-2xl font-black text-xs sm:text-sm transition flex items-center justify-center gap-1.5 ${
              activeTab === 'numbers'
                ? 'bg-white shadow text-amber-600 border border-amber-200'
                : 'text-slate-600 hover:bg-white/50'
            }`}
          >
            <span>🔢 数字音阶</span>
            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs">
              {numberCount}/{totalNumbers}
            </span>
          </button>

          <button
            onClick={() => {
              soundEngine.playPop();
              setActiveTab('eggs');
            }}
            className={`flex-1 py-2 rounded-2xl font-black text-xs sm:text-sm transition flex items-center justify-center gap-1.5 ${
              activeTab === 'eggs'
                ? 'bg-white shadow text-pink-600 border border-pink-200'
                : 'text-slate-600 hover:bg-white/50'
            }`}
          >
            <span>🎁 隐藏拼词彩蛋</span>
            <span className="px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 text-xs">
              {eggCount}/{totalEggs}
            </span>
          </button>
        </div>

        {/* Tab Content List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50">
          {/* LETTERS TAB */}
          {activeTab === 'letters' && (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {Object.keys(LETTERS_DATA).map((char) => {
                const data = LETTERS_DATA[char];
                const isUnlocked = discoveredLetters.has(char);
                const primaryItem = data.items[0];

                return (
                  <div
                    key={char}
                    onClick={() => {
                      if (onItemClick) onItemClick('letter', char);
                    }}
                    className={`relative p-3 rounded-2xl border-2 flex flex-col items-center justify-center transition-all cursor-pointer ${
                      isUnlocked
                        ? 'bg-white border-indigo-200 shadow-md hover:scale-105 hover:shadow-lg'
                        : 'bg-slate-200/60 border-slate-300 opacity-60'
                    }`}
                  >
                    {isUnlocked && (
                      <div className="absolute top-1.5 right-1.5 text-emerald-500">
                        <CheckCircle className="w-4 h-4 fill-emerald-100" />
                      </div>
                    )}
                    <span
                      className="text-2xl font-black"
                      style={{ color: isUnlocked ? data.color : '#94A3B8' }}
                    >
                      {char}
                    </span>
                    <span className="text-3xl my-1">{isUnlocked ? primaryItem.emoji : '❓'}</span>
                    <span className="text-xs font-bold text-slate-700 truncate w-full text-center">
                      {isUnlocked ? primaryItem.nameCn : '未发现'}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* NUMBERS TAB */}
          {activeTab === 'numbers' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {NUMBERS_DATA.map((item) => {
                const isUnlocked = discoveredNumbers.has(item.num);

                return (
                  <div
                    key={item.num}
                    onClick={() => {
                      if (onItemClick) onItemClick('number', item.num);
                    }}
                    className={`relative p-4 rounded-2xl border-2 flex flex-col items-center justify-center transition-all cursor-pointer ${
                      isUnlocked
                        ? 'bg-white border-amber-200 shadow-md hover:scale-105 hover:shadow-lg'
                        : 'bg-slate-200/60 border-slate-300 opacity-60'
                    }`}
                  >
                    {isUnlocked && (
                      <div className="absolute top-1.5 right-1.5 text-amber-500">
                        <Star className="w-4 h-4 fill-amber-300" />
                      </div>
                    )}
                    <span
                      className="text-3xl font-black"
                      style={{ color: isUnlocked ? item.color : '#94A3B8' }}
                    >
                      {item.num}
                    </span>
                    <span className="text-3xl my-1">{isUnlocked ? item.emoji : '❓'}</span>
                    <div className="text-center">
                      <div className="text-xs font-black text-slate-800">
                        {isUnlocked ? `${item.nameCn} (${item.name})` : '未探索'}
                      </div>
                      <div className="text-[10px] text-indigo-500 font-bold">
                        {isUnlocked ? `音阶: ${item.note}` : ''}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* EASTER EGGS TAB */}
          {activeTab === 'eggs' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {EASTER_EGG_WORDS.map((egg) => {
                const isUnlocked = discoveredEggs.has(egg.word);

                return (
                  <div
                    key={egg.word}
                    onClick={() => {
                      if (onItemClick) onItemClick('egg', egg.word);
                    }}
                    className={`relative p-3 rounded-2xl border-2 flex flex-col items-center justify-center transition-all cursor-pointer ${
                      isUnlocked
                        ? 'bg-white border-pink-200 shadow-md hover:scale-105 hover:shadow-lg'
                        : 'bg-slate-200/60 border-dashed border-slate-300 opacity-60'
                    }`}
                  >
                    {isUnlocked && (
                      <div className="absolute top-1.5 right-1.5 text-pink-500 animate-spin-slow">
                        <Sparkles className="w-4 h-4" />
                      </div>
                    )}
                    <span className="text-sm font-black px-2 py-0.5 rounded-lg bg-slate-100 text-indigo-700">
                      {isUnlocked ? egg.word : '???'}
                    </span>
                    <span className="text-4xl my-1.5">{isUnlocked ? egg.emoji : '🔒'}</span>
                    <span className="text-xs font-bold text-slate-800 text-center">
                      {isUnlocked ? egg.nameCn : '神秘单词'}
                    </span>
                    {!isUnlocked && (
                      <span className="text-[10px] text-slate-500 mt-1">
                        提示: 尝试拼出 {egg.word.split('').join('-')}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
