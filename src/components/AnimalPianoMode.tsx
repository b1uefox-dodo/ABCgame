import React, { useState, useEffect } from 'react';
import { PIANO_INSTRUMENTS, NUMBERS_DATA } from '../data/gameData';
import { KeyPress } from '../types';
import { soundEngine } from '../utils/soundEngine';
import { Music, Sparkles, Volume2, BookOpen } from 'lucide-react';

interface PianoKey {
  num: number;
  note: string;
  solfege: string;
  freq: number;
  color: string;
  heightClass: string;
}

const PIANO_KEYS: PianoKey[] = [
  { num: 1, note: 'C4', solfege: 'Do 哆', freq: 261.63, color: '#EF4444', heightClass: 'h-48' },
  { num: 2, note: 'D4', solfege: 'Re 来', freq: 293.66, color: '#F97316', heightClass: 'h-44' },
  { num: 3, note: 'E4', solfege: 'Mi 咪', freq: 329.63, color: '#EAB308', heightClass: 'h-40' },
  { num: 4, note: 'F4', solfege: 'Fa 发', freq: 349.23, color: '#10B981', heightClass: 'h-36' },
  { num: 5, note: 'G4', solfege: 'Sol 索', freq: 392.00, color: '#06B6D4', heightClass: 'h-32' },
  { num: 6, note: 'A4', solfege: 'La 拉', freq: 440.00, color: '#3B82F6', heightClass: 'h-28' },
  { num: 7, note: 'B4', solfege: 'Ti 西', freq: 493.88, color: '#8B5CF6', heightClass: 'h-24' },
  { num: 8, note: 'C5', solfege: '高音Do', freq: 523.25, color: '#EC4899', heightClass: 'h-20' }
];

const SONG_GUIDES = [
  { title: '⭐ 小星星', notes: ['1', '1', '5', '5', '6', '6', '5'], lyric: '一闪一闪亮晶晶' },
  { title: '🐯 两只老虎', notes: ['1', '2', '3', '1', '1', '2', '3', '1'], lyric: '两只老虎跑得快' },
  { title: '🔔 新年好', notes: ['1', '1', '1', '5', '3', '3', '3', '1'], lyric: '新年好呀新年好呀' }
];

interface AnimalPianoModeProps {
  latestKeyPress: KeyPress | null;
}

export const AnimalPianoMode: React.FC<AnimalPianoModeProps> = ({ latestKeyPress }) => {
  const [selectedInstrument, setSelectedInstrument] = useState<string>('xylophone');
  const [activeNoteKey, setActiveNoteKey] = useState<number | null>(null);
  const [activeSongIndex, setActiveSongIndex] = useState(0);

  const currentSong = SONG_GUIDES[activeSongIndex];

  // Handle incoming keyboard press
  useEffect(() => {
    if (!latestKeyPress) return;

    const num = parseInt(latestKeyPress.key, 10);
    if (!isNaN(num) && num >= 1 && num <= 8) {
      const keyObj = PIANO_KEYS[num - 1];
      if (keyObj) {
        triggerKeyNote(keyObj);
      }
    }
  }, [latestKeyPress]);

  const triggerKeyNote = (keyObj: PianoKey) => {
    setActiveNoteKey(keyObj.num);
    soundEngine.playNote(keyObj.freq, selectedInstrument);
    setTimeout(() => setActiveNoteKey(null), 300);
  };

  return (
    <div className="relative w-full h-full overflow-hidden select-none flex flex-col justify-between items-center pb-32 pt-16">
      {/* Instrument Switcher Top Bar */}
      <div className="z-20 w-11/12 max-w-2xl animate-pop-in">
        <div className="bg-white/90 backdrop-blur-xl p-3 rounded-3xl border-4 border-indigo-300 shadow-xl flex flex-col gap-2">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs sm:text-sm font-black text-indigo-900 flex items-center gap-1.5">
              <Music className="w-4 h-4 text-pink-500" /> 选择好玩的乐器合唱团：
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {PIANO_INSTRUMENTS.map(inst => (
              <button
                key={inst.id}
                onClick={() => {
                  soundEngine.playPop();
                  setSelectedInstrument(inst.id);
                }}
                className={`flex-1 py-1.5 px-2 rounded-2xl text-xs sm:text-sm font-black transition whitespace-nowrap flex items-center justify-center gap-1 shadow-sm ${
                  selectedInstrument === inst.id
                    ? 'bg-gradient-to-r from-pink-500 to-indigo-500 text-white shadow-md scale-105 ring-2 ring-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{inst.nameCn}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Song Guide Bar */}
      <div className="z-20 w-11/12 max-w-xl bg-white/85 backdrop-blur-md px-4 py-2 rounded-2xl border-2 border-yellow-300 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-slate-500">曲谱跟弹:</span>
          <span className="text-sm font-black text-slate-800">{currentSong.title}</span>
          <div className="flex gap-1 bg-amber-100 px-2 py-0.5 rounded-lg text-xs font-mono font-bold text-amber-900">
            {currentSong.notes.map((n, i) => (
              <span key={i} className="px-0.5">{n}</span>
            ))}
          </div>
        </div>
        <button
          onClick={() => {
            soundEngine.playPop();
            setActiveSongIndex(idx => (idx + 1) % SONG_GUIDES.length);
          }}
          className="text-xs font-bold text-indigo-600 hover:underline"
        >
          换一首 🎵
        </button>
      </div>

      {/* Xylophone / Piano Keys Visualization */}
      <div className="z-10 w-full max-w-3xl px-4 flex justify-center items-end gap-1.5 sm:gap-3">
        {PIANO_KEYS.map(pk => {
          const isActive = activeNoteKey === pk.num;

          return (
            <button
              key={pk.num}
              onClick={() => triggerKeyNote(pk)}
              style={{
                backgroundColor: pk.color,
                height: `${220 - (pk.num - 1) * 12}px`
              }}
              className={`flex-1 max-w-[80px] rounded-3xl p-2 sm:p-3 flex flex-col justify-between items-center text-white font-black shadow-2xl transition-all duration-100 border-4 border-white/60 active:scale-95 ${
                isActive
                  ? 'scale-105 brightness-125 -translate-y-4 ring-4 ring-yellow-300 shadow-yellow-300'
                  : 'hover:brightness-105'
              }`}
            >
              {/* Note Solfege Top */}
              <span className="text-xs sm:text-sm font-extrabold opacity-95">
                {pk.solfege}
              </span>

              {/* Dancing Note Emoji */}
              <span className="text-2xl sm:text-3xl animate-bounce-soft">
                {isActive ? '✨' : '🎵'}
              </span>

              {/* Number Key Hint */}
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white text-slate-900 flex items-center justify-center text-base sm:text-xl font-black shadow">
                {pk.num}
              </div>
            </button>
          );
        })}
      </div>

      <div className="text-xs font-bold text-white/90 drop-shadow">
        按数字键 1～8 或直接点击彩虹琴键弹奏美妙音乐 🌈
      </div>
    </div>
  );
};
