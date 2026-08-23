import React, { useState, useEffect } from 'react';
import { soundEngine } from '../utils/soundEngine';

interface MascotPetProps {
  themeId: string;
  mascotName: string;
  mascotEmoji: string;
  actionTrigger?: string | null;
  onMascotClick?: () => void;
}

export const MascotPet: React.FC<MascotPetProps> = ({
  themeId: _themeId,
  mascotName: _mascotName,
  mascotEmoji,
  actionTrigger,
  onMascotClick
}) => {
  const [posX, setPosX] = useState(120);
  const [isJumping, setIsJumping] = useState(false);
  const [isWiggling, setIsWiggling] = useState(false);
  const [facing, setFacing] = useState<'left' | 'right'>('right');
  const [speechBubble, setSpeechBubble] = useState<string>('敲敲键盘，跟我一起探险吧！✨');

  // React to keyboard arrow triggers
  useEffect(() => {
    if (!actionTrigger) return;

    if (actionTrigger === 'ArrowRight') {
      setFacing('right');
      setPosX((x) => Math.min(window.innerWidth - 120, x + 60));
      soundEngine.playBoing();
    } else if (actionTrigger === 'ArrowLeft') {
      setFacing('left');
      setPosX((x) => Math.max(80, x - 60));
      soundEngine.playBoing();
    } else if (actionTrigger === 'ArrowUp') {
      setIsJumping(true);
      soundEngine.playMagic();
      setTimeout(() => setIsJumping(false), 600);
    } else if (actionTrigger === 'ArrowDown') {
      setIsWiggling(true);
      soundEngine.playPop();
      setTimeout(() => setIsWiggling(false), 500);
    }
  }, [actionTrigger]);

  // Periodic fun mascot speech prompts
  useEffect(() => {
    const speechLines = [
      '按任意字母，看看会变出什么宝贝！🍎',
      '试试按 1-9，听听神奇小音阶！🎶',
      '按【空格键】可以放超级大礼炮哦！🎉',
      '连续按 C-A-T 会发生神奇魔法！🐱',
      '按【回车键】打开神秘惊喜礼物盒！🎁',
      '点击我，我们来玩捉迷藏！⭐'
    ];

    const interval = setInterval(() => {
      const line = speechLines[Math.floor(Math.random() * speechLines.length)];
      setSpeechBubble(line);
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  const handleTickle = () => {
    setIsJumping(true);
    soundEngine.playSparkle();
    const tickleLines = ['嘻嘻，好痒呀！💖', '再按一个字母吧！🌟', '你真棒，小小探险家！🎉'];
    setSpeechBubble(tickleLines[Math.floor(Math.random() * tickleLines.length)]);
    setTimeout(() => setIsJumping(false), 600);
    if (onMascotClick) onMascotClick();
  };

  return (
    <div
      className="fixed bottom-[200px] sm:bottom-[210px] z-30 transition-all duration-300 pointer-events-auto select-none"
      style={{
        left: `${posX}px`,
        transform: 'translateX(-50%)'
      }}
    >
      {/* Speech Bubble - positioning lives on the outer div so the float
          animation (which overrides the transform property) cannot break
          the centering, and the bubble never mirrors with the mascot */}
      <div className="absolute -top-16 left-1/2 -translate-x-1/2 pointer-events-none">
        <div className="whitespace-nowrap bg-white/95 text-slate-800 font-extrabold text-xs sm:text-sm px-3.5 py-1.5 rounded-2xl shadow-xl border-2 border-indigo-400 animate-float">
          <span>{speechBubble}</span>
          {/* Tail */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 border-solid border-t-white border-t-8 border-x-transparent border-x-8 border-b-0" />
        </div>
      </div>

      {/* Mascot Avatar Body (flips horizontally to face the move direction) */}
      <div style={{ transform: facing === 'left' ? 'scaleX(-1)' : 'scaleX(1)' }}>
        <div
          onClick={handleTickle}
          className={`cursor-pointer transition-transform duration-200 ${
            isJumping
              ? '-translate-y-16 scale-125'
              : isWiggling
                ? 'scale-90 rotate-12'
                : 'animate-bounce-soft'
          }`}
        >
          <div className="relative group">
            {/* Glowing aura */}
            <div className="absolute -inset-2 bg-gradient-to-r from-yellow-300 to-pink-400 rounded-full blur-md opacity-75 group-hover:opacity-100 animate-pulse" />

            <div className="relative text-6xl sm:text-7xl filter drop-shadow-2xl active:scale-90 transition-transform">
              {mascotEmoji}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
