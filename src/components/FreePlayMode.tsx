import React, { useState, useEffect, useRef } from 'react';
import { PhysicsWorld, PhysicsEntity, SparkleParticle } from '../utils/physics';
import { LETTERS_DATA, NUMBERS_DATA, WorldTheme } from '../data/gameData';
import { KeyPress } from '../types';
import { soundEngine } from '../utils/soundEngine';
import { MascotPet } from './MascotPet';
import { Sparkles, Gift, Trash2, Volume2, Move } from 'lucide-react';

function shadeColor(color: string, percent: number): string {
  if (!color || !color.startsWith('#') || color.length < 7) return color || '#3B82F6';
  let R = parseInt(color.substring(1, 3), 16);
  let G = parseInt(color.substring(3, 5), 16);
  let B = parseInt(color.substring(5, 7), 16);

  R = Math.min(255, Math.max(0, Math.floor((R * (100 + percent)) / 100)));
  G = Math.min(255, Math.max(0, Math.floor((G * (100 + percent)) / 100)));
  B = Math.min(255, Math.max(0, Math.floor((B * (100 + percent)) / 100)));

  const RR = R.toString(16).padStart(2, '0');
  const GG = G.toString(16).padStart(2, '0');
  const BB = B.toString(16).padStart(2, '0');

  return `#${RR}${GG}${BB}`;
}

interface FreePlayModeProps {
  currentTheme: WorldTheme;
  latestKeyPress: KeyPress | null;
  onKeyDiscovered: (type: 'letter' | 'number', val: string | number) => void;
  onEggTriggered: (word: string) => void;
  mascotAction: string | null;
}

export const FreePlayMode: React.FC<FreePlayModeProps> = ({
  currentTheme,
  latestKeyPress,
  onKeyDiscovered,
  onEggTriggered,
  mascotAction
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const physicsWorldRef = useRef<PhysicsWorld>(new PhysicsWorld());
  const [heroCard, setHeroCard] = useState<{
    symbol: string;
    emoji: string;
    title: string;
    subtitle: string;
    color: string;
    phonics?: string;
    funFact?: string;
  } | null>(null);

  const [activeGiftBox, setActiveGiftBox] = useState<{
    isOpen: boolean;
    rewardEmoji: string;
    rewardTitle: string;
  } | null>(null);

  const [isVacuumActive, setIsVacuumActive] = useState(false);
  const [letterPressCounters, setLetterPressCounters] = useState<Record<string, number>>({});
  const typedWordBufferRef = useRef<string>('');
  const lastKeyTimeRef = useRef<number>(0);

  // Mouse / Touch Dragging State
  const draggedEntityRef = useRef<PhysicsEntity | null>(null);
  const dragOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Handle incoming key presses
  useEffect(() => {
    if (!latestKeyPress) return;

    const now = Date.now();
    // Reset typed buffer if more than 3.5s elapsed
    if (now - lastKeyTimeRef.current > 3500) {
      typedWordBufferRef.current = '';
    }
    lastKeyTimeRef.current = now;

    const key = latestKeyPress.key;
    const upperKey = key.toUpperCase();
    const world = physicsWorldRef.current;

    // --- Special Keys ---
    if (key === ' ' || key === 'Space') {
      world.triggerSuperConfettiParty();
      soundEngine.playFanfare();
      soundEngine.playVoiceFile('/audio/prompts/confetti.m4a');
      return;
    }

    if (key === 'Enter') {
      triggerSurpriseGiftBox();
      return;
    }

    if (key === 'Backspace') {
      triggerVacuumMonster();
      return;
    }

    // --- Letter Keys (A-Z) ---
    if (LETTERS_DATA[upperKey]) {
      const letterData = LETTERS_DATA[upperKey];
      const count = letterPressCounters[upperKey] || 0;
      const itemIndex = count % letterData.items.length;
      const currentItem = letterData.items[itemIndex];

      setLetterPressCounters(prev => ({
        ...prev,
        [upperKey]: count + 1
      }));

      // Spawn entity in physics world
      const spawnX = Math.random() * (world.width - 240) + 120;
      const spawnY = 140;

      world.addEntity({
        type: 'letter',
        symbol: upperKey,
        emoji: currentItem.emoji,
        title: `${upperKey} • ${currentItem.name}`,
        subtitle: currentItem.nameCn,
        color: currentItem.color,
        x: spawnX,
        y: spawnY,
        vx: (Math.random() - 0.5) * 10,
        vy: -(Math.random() * 6 + 4),
        radius: 46,
        rotation: (Math.random() - 0.5) * 20,
        scale: 0.3,
        targetScale: 1,
        lifespan: 35000
      });

      // Sound & Speech
      soundEngine.playSoundByType(currentItem.soundType);
      soundEngine.speakLetterFeedback(upperKey, currentItem.name, currentItem.nameCn, itemIndex);

      // Hero Card Center Display
      setHeroCard({
        symbol: upperKey,
        emoji: currentItem.emoji,
        title: `${currentItem.name} (${currentItem.nameCn})`,
        subtitle: `自然拼读: ${letterData.phonics}`,
        color: currentItem.color,
        phonics: letterData.phonics,
        funFact: currentItem.funFact
      });

      onKeyDiscovered('letter', upperKey);

      // Word Buffer Check for Easter Eggs
      typedWordBufferRef.current += upperKey;
      if (typedWordBufferRef.current.length > 8) {
        typedWordBufferRef.current = typedWordBufferRef.current.slice(-8);
      }
      checkEasterEgg(typedWordBufferRef.current);
      return;
    }

    // --- Number Keys (0-9) ---
    const num = parseInt(key, 10);
    if (!isNaN(num) && NUMBERS_DATA[num]) {
      const numData = NUMBERS_DATA[num];

      // Spawn 1 to 3 items per number press for smooth physics and clean visuals
      const spawnCount = num === 0 ? 1 : Math.min(num, 3);
      for (let i = 0; i < spawnCount; i++) {
        setTimeout(() => {
          const spawnX = (world.width / (spawnCount + 1)) * (i + 1) + (Math.random() - 0.5) * 30;
          world.addEntity({
            type: 'number',
            symbol: `${num}`,
            emoji: numData.emoji,
            title: `${num} ${numData.name}`,
            subtitle: `${numData.nameCn} (${numData.pinyin})`,
            color: numData.color,
            x: spawnX,
            y: 150,
            vx: (Math.random() - 0.5) * 8,
            vy: -(Math.random() * 8 + 5),
            radius: 44,
            rotation: (Math.random() - 0.5) * 15,
            scale: 0.3,
            targetScale: 1,
            lifespan: 35000
          });
        }, i * 90);
      }

      // Sound & Note
      soundEngine.playNote(numData.freq);
      soundEngine.speakNumberFeedback(num, numData.name, numData.nameCn, `${num} ${numData.countItem.nameCn}`);

      setHeroCard({
        symbol: `${num}`,
        emoji: numData.emoji,
        title: `数字 ${num} - ${numData.nameCn} (${numData.name})`,
        subtitle: `音乐音阶: ${numData.note}`,
        color: numData.color,
        funFact: numData.funFact
      });

      onKeyDiscovered('number', num);
    }
  }, [latestKeyPress]);

  // Check easter eggs from typed word stream
  const checkEasterEgg = (buffer: string) => {
    const eggs = [
      'CAT', 'DOG', 'SUN', 'STAR', 'CAR', 'BUS', 'FLY', 'PIG', 'FOX', 'FISH', 'LOVE', 'RAIN', 'ICE', 'BEE'
    ];
    for (const egg of eggs) {
      if (buffer.endsWith(egg)) {
        typedWordBufferRef.current = '';
        onEggTriggered(egg);
        break;
      }
    }
  };

  const triggerSurpriseGiftBox = () => {
    soundEngine.playMagic();
    soundEngine.playVoiceFile('/audio/prompts/gift.m4a');
    const surprises = [
      { emoji: '🦄', title: '七彩独角兽！' },
      { emoji: '👑', title: '金色大皇冠！' },
      { emoji: '🚀', title: '星际火箭！' },
      { emoji: '🎂', title: '草莓彩虹蛋糕！' },
      { emoji: '🤖', title: '全能酷机器人！' },
      { emoji: '🦖', title: '霸王恐龙宝贝！' }
    ];
    const picked = surprises[Math.floor(Math.random() * surprises.length)];
    setActiveGiftBox({
      isOpen: false,
      rewardEmoji: picked.emoji,
      rewardTitle: picked.title
    });
  };

  const openGiftBox = () => {
    if (!activeGiftBox) return;
    soundEngine.playFanfare();
    setActiveGiftBox(prev => prev ? { ...prev, isOpen: true } : null);

    const world = physicsWorldRef.current;
    world.createSpawnExplosion(world.width / 2, world.height / 2, '#F59E0B', activeGiftBox.rewardEmoji);

    // Spawn super reward
    world.addEntity({
      type: 'gift',
      symbol: '🎁',
      emoji: activeGiftBox.rewardEmoji,
      title: activeGiftBox.rewardTitle,
      subtitle: '神秘盲盒大奖！',
      color: '#EC4899',
      x: world.width / 2,
      y: world.height / 2 - 50,
      vx: 0,
      vy: -12,
      radius: 65,
      rotation: 0,
      scale: 0.5,
      targetScale: 1.3,
      lifespan: 45000
    });

    setTimeout(() => {
      setActiveGiftBox(null);
    }, 2800);
  };

  const triggerVacuumMonster = () => {
    setIsVacuumActive(true);
    soundEngine.playVacuum();
    soundEngine.playVoiceFile('/audio/prompts/vacuum.m4a');

    const world = physicsWorldRef.current;
    world.clearEntities();

    setTimeout(() => {
      setIsVacuumActive(false);
    }, 1800);
  };

  // Canvas Render Loop (60 FPS)
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      physicsWorldRef.current.updateDimensions();
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const render = () => {
      const world = physicsWorldRef.current;
      world.update();

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Draw Sparkle Particles
      world.particles.forEach(p => {
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.opacity);
        if (p.emoji) {
          ctx.font = `${p.size * 2}px "Fredoka", sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(p.emoji, p.x, p.y);
        } else {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      // 2. Draw Physics Entities (Pure Crisp Circular 3D Toy Badges - Zero Fog / 100% Vibrant)
      world.entities.forEach(ent => {
        ctx.save();
        ctx.translate(ent.x, ent.y);

        // Clamped soft tilt (always upright, never inverted)
        const tilt = Math.max(-15, Math.min(15, ent.rotation));
        ctx.rotate((tilt * Math.PI) / 180);
        ctx.scale(ent.scale, ent.scale);

        const r = ent.radius;
        const baseColor = ent.color || '#3B82F6';

        // 1. Soft Crisp Floor Shadow (Oval right beneath badge)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.14)';
        ctx.beginPath();
        ctx.ellipse(0, r + 4, r * 0.85, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // 2. Solid Pure White Circular Base (100% Opaque, No Fog, No Haze)
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fill();

        // 3. Thick Vibrant Colored Border Ring
        ctx.lineWidth = 5;
        ctx.strokeStyle = baseColor;
        ctx.stroke();

        // 4. Large Crisp Vibrant Emoji (Zero Overlays, 100% Pure Clarity)
        ctx.font = `${r * 1.25}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(ent.emoji, 0, -r * 0.08);

        // 5. Top-Right Floating Symbol Badge (Letter/Number)
        const badgeR = 13;
        const badgeX = r * 0.65;
        const badgeY = -r * 0.65;
        
        ctx.fillStyle = baseColor;
        ctx.beginPath();
        ctx.arc(badgeX, badgeY, badgeR, 0, Math.PI * 2);
        ctx.fill();
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = '#FFFFFF';
        ctx.stroke();

        ctx.fillStyle = '#FFFFFF';
        ctx.font = '900 13px "Fredoka", sans-serif';
        ctx.fillText(ent.symbol, badgeX, badgeY + 4);

        // 6. Bottom Clean Subtitle Pill (100% Solid Pure White Pill with High Contrast Text)
        if (ent.subtitle) {
          const pillW = Math.min(r * 1.7, 82);
          const pillH = 22;
          const pillY = r * 0.62;

          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.roundRect(-pillW / 2, pillY - pillH / 2, pillW, pillH, 11);
          ctx.fill();
          ctx.lineWidth = 1.8;
          ctx.strokeStyle = baseColor;
          ctx.stroke();

          ctx.fillStyle = '#0F172A';
          ctx.font = 'bold 12px "Fredoka", "PingFang SC", "Microsoft YaHei", sans-serif';
          ctx.fillText(ent.subtitle, 0, pillY + 4);
        }

        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // --- Interactive Drag / Tap Support ---
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const world = physicsWorldRef.current;
    for (let i = world.entities.length - 1; i >= 0; i--) {
      const ent = world.entities[i];
      const dist = Math.hypot(clickX - ent.x, clickY - ent.y);
      if (dist < ent.radius * ent.scale) {
        draggedEntityRef.current = ent;
        ent.isBeingDragged = true;
        dragOffsetRef.current = { x: clickX - ent.x, y: clickY - ent.y };

        // Play pop on tap
        soundEngine.playPop();
        soundEngine.speak(ent.subtitle || ent.title);
        ent.vy = -6;
        world.createSpawnExplosion(ent.x, ent.y, ent.color, '✨');
        break;
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!draggedEntityRef.current) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const curX = e.clientX - rect.left;
    const curY = e.clientY - rect.top;

    const ent = draggedEntityRef.current;
    const newX = curX - dragOffsetRef.current.x;
    const newY = curY - dragOffsetRef.current.y;

    ent.vx = (newX - ent.x) * 0.4;
    ent.vy = (newY - ent.y) * 0.4;
    ent.x = newX;
    ent.y = newY;
  };

  const handlePointerUp = () => {
    if (draggedEntityRef.current) {
      draggedEntityRef.current.isBeingDragged = false;
      draggedEntityRef.current = null;
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      {/* 2D Interactive Canvas */}
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing pointer-events-auto"
      />

      {/* Top Center Hero Banner Display */}
      {heroCard && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 pointer-events-auto animate-pop-in">
          <div className="flex items-center gap-3 px-5 py-2.5 rounded-3xl bg-white/90 backdrop-blur-xl border-4 border-amber-300 shadow-2xl">
            <span
              className="text-4xl sm:text-5xl font-black drop-shadow"
              style={{ color: heroCard.color }}
            >
              {heroCard.symbol}
            </span>
            <span className="text-5xl sm:text-6xl animate-bounce-soft">
              {heroCard.emoji}
            </span>
            <div className="flex flex-col text-left">
              <span className="text-lg sm:text-xl font-black text-slate-800">
                {heroCard.title}
              </span>
              <span className="text-xs sm:text-sm font-extrabold text-indigo-600">
                {heroCard.funFact || heroCard.subtitle}
              </span>
            </div>
            <button
              onClick={() => {
                soundEngine.playPop();
                soundEngine.speak(heroCard.funFact || heroCard.title);
              }}
              className="p-2 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 transition active:scale-95"
              title="朗读"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Mascot Companion (Controllable with Arrow Keys) */}
      <MascotPet
        themeId={currentTheme.id}
        mascotName={currentTheme.mascotName}
        mascotEmoji={currentTheme.mascotEmoji}
        actionTrigger={mascotAction}
      />

      {/* Surprise Gift Box Modal */}
      {activeGiftBox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm pointer-events-auto">
          <div className="relative p-8 bg-white/95 rounded-3xl border-4 border-purple-400 shadow-2xl text-center flex flex-col items-center gap-4 animate-bounce-soft">
            <h3 className="text-2xl font-black text-purple-700">
              🎁 神秘惊喜礼物盒！
            </h3>
            {!activeGiftBox.isOpen ? (
              <div
                onClick={openGiftBox}
                className="cursor-pointer group text-8xl sm:text-9xl animate-wiggle hover:scale-110 transition"
              >
                <div className="relative">
                  <div className="absolute -inset-4 bg-purple-300 rounded-full blur-xl opacity-60 group-hover:opacity-100" />
                  <span className="relative">🎁</span>
                </div>
                <p className="text-sm font-black text-slate-600 mt-2">
                  点击礼物盒开箱！✨
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 animate-pop-in">
                <span className="text-8xl animate-spin-slow">
                  {activeGiftBox.rewardEmoji}
                </span>
                <span className="text-xl font-black text-purple-900">
                  {activeGiftBox.rewardTitle}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Vacuum Monster Visual Animation */}
      {isVacuumActive && (
        <div className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none">
          <div className="text-9xl animate-spin-slow filter drop-shadow-2xl">
            🌪️
          </div>
          <div className="absolute bottom-20 text-3xl font-black text-white px-6 py-2 rounded-full bg-rose-500 shadow-2xl animate-bounce">
            咕噜咕噜~ 怪物吸尘器出动！✨
          </div>
        </div>
      )}

      {/* Quick Playful Hint at Bottom Left */}
      <div className="absolute bottom-2 left-3 z-10 text-[11px] font-bold text-white/80 drop-shadow flex items-center gap-1.5 pointer-events-none">
        <Move className="w-3 h-3" />
        <span>可拖拽抛掷玩具 • 敲击键盘探索新角色</span>
      </div>
    </div>
  );
};
