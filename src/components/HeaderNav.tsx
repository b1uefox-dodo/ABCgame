import React, { useState } from 'react';
import { WORLD_THEMES, WorldTheme } from '../data/gameData';
import { soundEngine } from '../utils/soundEngine';
import {
  Volume2,
  VolumeX,
  Music,
  BookOpen,
  Maximize,
  Minimize,
  Sparkles,
  Globe,
  Palette,
  LogOut
} from 'lucide-react';

export type GameMode = 'free' | 'balloon' | 'train' | 'word' | 'piano';

interface HeaderNavProps {
  currentMode: GameMode;
  onModeChange: (mode: GameMode) => void;
  currentTheme: WorldTheme;
  onThemeChange: (theme: WorldTheme) => void;
  onOpenAlbum: () => void;
  discoveredCount: number;
  onExitClick: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  currentMode,
  onModeChange,
  currentTheme,
  onThemeChange,
  onOpenAlbum,
  discoveredCount,
  onExitClick
}) => {
  const [isMuted, setIsMuted] = useState(soundEngine.getMuted());
  const [isBgm, setIsBgm] = useState(soundEngine.isBgmActive());
  const [voiceLang, setVoiceLang] = useState<'bilingual' | 'en' | 'zh'>(soundEngine.getVoiceLanguage());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);

  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundEngine.setMuted(next);
    if (!next) soundEngine.playPop();
  };

  const toggleBgm = () => {
    const active = soundEngine.toggleBgm();
    setIsBgm(active);
  };

  const cycleVoiceLang = () => {
    const order: Array<'bilingual' | 'en' | 'zh'> = ['bilingual', 'en', 'zh'];
    const nextIdx = (order.indexOf(voiceLang) + 1) % order.length;
    const next = order[nextIdx];
    setVoiceLang(next);
    soundEngine.setVoiceLanguage(next);
    soundEngine.playPop();
    if (next === 'bilingual') soundEngine.speak('已开启中英双语发音！');
    if (next === 'en') soundEngine.speak('English voice only!', 'en');
    if (next === 'zh') soundEngine.speak('已开启纯中文发音！');
  };

  const toggleFullscreen = () => {
    soundEngine.playPop();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const modes: { id: GameMode; name: string; icon: string; desc: string }[] = [
    { id: 'free', name: '自由探索', icon: '🌟', desc: '随心敲键与物理玩具' },
    { id: 'balloon', name: '气球寻宝', icon: '🎈', desc: '听音认字母与数字' },
    { id: 'train', name: '数字火车', icon: '🚂', desc: '趣味数感与计数' },
    { id: 'word', name: '单词拼图', icon: '🧩', desc: '看图补全魔法拼词' },
    { id: 'piano', name: '动物钢琴', icon: '🎹', desc: '按键变身乐器合唱' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-2 sm:px-4 py-2 pointer-events-auto select-none">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 bg-white/70 backdrop-blur-xl px-3 py-2 rounded-2xl sm:rounded-3xl border border-white/60 shadow-lg">
        {/* Left: Brand Logo & Mascot badge */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-amber-400 via-pink-500 to-indigo-500 text-white shadow-md">
            <span className="text-xl animate-bounce-soft">🌈</span>
            <div className="leading-tight">
              <span className="font-black text-sm sm:text-base tracking-wide block">
                奇趣键盘大冒险
              </span>
            </div>
          </div>
        </div>

        {/* Center: 5 Game Modes Tabs */}
        <div className="flex items-center gap-1 sm:gap-1.5 bg-slate-900/10 p-1 rounded-2xl backdrop-blur-sm overflow-x-auto max-w-full">
          {modes.map(m => {
            const active = currentMode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => {
                  soundEngine.playPop();
                  onModeChange(m.id);
                }}
                className={`btn-kid flex items-center gap-1 px-2.5 sm:px-3.5 py-1.5 rounded-xl font-black text-xs sm:text-sm transition-all whitespace-nowrap ${
                  active
                    ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-md scale-105 ring-2 ring-white'
                    : 'bg-white/80 text-slate-700 hover:bg-white'
                }`}
              >
                <span className="text-base">{m.icon}</span>
                <span>{m.name}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Tools, Album, Voice, Theme, Sound */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Sticker Album */}
          <button
            onClick={() => {
              soundEngine.playSparkle();
              onOpenAlbum();
            }}
            className="btn-kid flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-extrabold text-xs shadow transition active:scale-95"
            title="查看探索图鉴与贴纸册"
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">探索图鉴</span>
            <span className="px-1.5 py-0.2 rounded-full bg-yellow-300 text-indigo-950 font-black text-[11px]">
              {discoveredCount}
            </span>
          </button>

          {/* Theme Switcher dropdown toggle */}
          <div className="relative">
            <button
              onClick={() => {
                soundEngine.playPop();
                setShowThemePicker(!showThemePicker);
              }}
              className="btn-kid p-2 rounded-xl bg-white/80 hover:bg-white text-slate-700 shadow transition active:scale-95 flex items-center gap-1"
              title="切换奇幻主题世界"
            >
              <span className="text-base">{currentTheme.icon}</span>
              <span className="hidden md:inline text-xs font-black">{currentTheme.nameCn}</span>
            </button>

            {/* Theme Picker Dropdown */}
            {showThemePicker && (
              <div
                onClick={() => setShowThemePicker(false)}
                className="absolute top-12 right-0 w-44 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border-2 border-amber-300 p-1.5 flex flex-col gap-1 z-50 animate-pop-in"
              >
                <div className="text-[10px] font-black text-slate-400 px-2 py-1">选择探索世界</div>
                {WORLD_THEMES.map(theme => (
                  <button
                    key={theme.id}
                    onClick={() => {
                      soundEngine.playMagic();
                      onThemeChange(theme);
                      setShowThemePicker(false);
                    }}
                    className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-bold text-left transition ${
                      currentTheme.id === theme.id
                        ? 'bg-amber-100 text-amber-900 font-black'
                        : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <span className="text-lg">{theme.icon}</span>
                    <span>{theme.nameCn}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Voice Language Toggle */}
          <button
            onClick={cycleVoiceLang}
            className="btn-kid px-2 py-1.5 rounded-xl bg-white/80 hover:bg-white text-slate-700 shadow font-black text-xs transition active:scale-95 flex items-center gap-1"
            title="切换语音发音：双语 / 英文 / 中文"
          >
            <Globe className="w-3.5 h-3.5 text-blue-500" />
            <span>
              {voiceLang === 'bilingual' ? '双语' : voiceLang === 'en' ? 'EN' : '中文'}
            </span>
          </button>

          {/* BGM Melody Toggle */}
          <button
            onClick={toggleBgm}
            className={`btn-kid p-2 rounded-xl shadow transition active:scale-95 ${
              isBgm ? 'bg-amber-300 text-amber-950' : 'bg-white/80 text-slate-500 hover:bg-white'
            }`}
            title="背景欢快乐曲开关"
          >
            <Music className="w-4 h-4" />
          </button>

          {/* Sound Mute Toggle */}
          <button
            onClick={toggleSound}
            className={`btn-kid p-2 rounded-xl shadow transition active:scale-95 ${
              isMuted ? 'bg-rose-200 text-rose-700' : 'bg-white/80 text-slate-700 hover:bg-white'
            }`}
            title="音效开关"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="btn-kid p-2 rounded-xl bg-white/80 hover:bg-white text-slate-700 shadow transition active:scale-95"
            title="全屏模式（防止误触其他标签页）"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>

          {/* Exit Game Process Button */}
          <button
            onClick={() => {
              soundEngine.playPop();
              onExitClick();
            }}
            className="btn-kid flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 text-white font-extrabold text-xs shadow-md hover:brightness-110 transition active:scale-95 ml-1"
            title="退出并完整结束游戏进程"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>退出</span>
          </button>
        </div>
      </div>
    </header>
  );
};
