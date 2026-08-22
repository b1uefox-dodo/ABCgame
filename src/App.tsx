import React, { useState, useEffect, useCallback, useRef } from 'react';
import { WORLD_THEMES, WorldTheme, EASTER_EGG_WORDS, EasterEggWord } from './data/gameData';
import { KeyPress } from './types';
import { HeaderNav, GameMode } from './components/HeaderNav';
import { FreePlayMode } from './components/FreePlayMode';
import { BalloonPopMode } from './components/BalloonPopMode';
import { NumberTrainMode } from './components/NumberTrainMode';
import { WordBuilderMode } from './components/WordBuilderMode';
import { AnimalPianoMode } from './components/AnimalPianoMode';
import { VirtualKeyboard } from './components/VirtualKeyboard';
import { EasterEggModal } from './components/EasterEggModal';
import { BadgeAlbum } from './components/BadgeAlbum';
import { ExitConfirmModal } from './components/ExitConfirmModal';
import { soundEngine } from './utils/soundEngine';

export const App: React.FC = () => {
  const [currentMode, setCurrentMode] = useState<GameMode>('free');
  const [currentTheme, setCurrentTheme] = useState<WorldTheme>(WORLD_THEMES[0]);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [latestKeyPress, setLatestKeyPress] = useState<KeyPress | null>(null);
  const [targetKeyHint, setTargetKeyHint] = useState<string | null>(null);
  const [mascotAction, setMascotAction] = useState<string | null>(null);

  // Easter Egg, Album & Exit Modal State
  const [activeEasterEgg, setActiveEasterEgg] = useState<EasterEggWord | null>(null);
  const [isAlbumOpen, setIsAlbumOpen] = useState(false);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);

  // Discovered Badges
  const [discoveredLetters, setDiscoveredLetters] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('abc_discovered_letters');
      return saved ? new Set(JSON.parse(saved)) : new Set(['A', 'B', 'C']);
    } catch {
      return new Set(['A', 'B', 'C']);
    }
  });

  const [discoveredNumbers, setDiscoveredNumbers] = useState<Set<number>>(() => {
    try {
      const saved = localStorage.getItem('abc_discovered_numbers');
      return saved ? new Set(JSON.parse(saved)) : new Set([1, 2, 3]);
    } catch {
      return new Set([1, 2, 3]);
    }
  });

  const [discoveredEggs, setDiscoveredEggs] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('abc_discovered_eggs');
      return saved ? new Set(JSON.parse(saved)) : new Set(['CAT']);
    } catch {
      return new Set(['CAT']);
    }
  });

  // Save discovered badges to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('abc_discovered_letters', JSON.stringify(Array.from(discoveredLetters)));
    } catch {}
  }, [discoveredLetters]);

  useEffect(() => {
    try {
      localStorage.setItem('abc_discovered_numbers', JSON.stringify(Array.from(discoveredNumbers)));
    } catch {}
  }, [discoveredNumbers]);

  useEffect(() => {
    try {
      localStorage.setItem('abc_discovered_eggs', JSON.stringify(Array.from(discoveredEggs)));
    } catch {}
  }, [discoveredEggs]);

  const handleKeyDiscovered = useCallback((type: 'letter' | 'number', val: string | number) => {
    if (type === 'letter') {
      setDiscoveredLetters((prev) => new Set(prev).add(val as string));
    } else {
      setDiscoveredNumbers((prev) => new Set(prev).add(val as number));
    }
  }, []);

  const handleEggTriggered = useCallback((word: string) => {
    const eggObj = EASTER_EGG_WORDS.find((e) => e.word.toUpperCase() === word.toUpperCase());
    if (eggObj) {
      setDiscoveredEggs((prev) => new Set(prev).add(eggObj.word));
      setActiveEasterEgg(eggObj);
    }
  }, []);

  // Process key input from physical keyboard or virtual keyboard
  const keySeqRef = useRef(0);

  const dispatchKeyAction = useCallback((key: string) => {
    soundEngine.unlockAudio();
    setActiveKey(key);
    // Every press gets a unique seq so mode effects re-run even for
    // repeated presses of the same key
    keySeqRef.current += 1;
    setLatestKeyPress({ key, seq: keySeqRef.current });

    // Arrow keys triggers mascot action
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
      setMascotAction(key);
      setTimeout(() => setMascotAction(null), 200);
    }

    setTimeout(() => {
      setActiveKey(null);
    }, 120);
  }, []);

  // Global Keyboard & Touch Event Listener
  useEffect(() => {
    const handleUserTouch = () => {
      soundEngine.unlockAudio();
    };
    window.addEventListener('pointerdown', handleUserTouch, { once: true });

    const handleKeyDown = (e: KeyboardEvent) => {
      soundEngine.unlockAudio();
      // Prevent browser default scroll for game keys
      if (
        [
          'Space',
          ' ',
          'ArrowUp',
          'ArrowDown',
          'ArrowLeft',
          'ArrowRight',
          'Tab',
          'Backspace'
        ].includes(e.key)
      ) {
        e.preventDefault();
      }

      // Ignore OS key auto-repeat so holding a key down doesn't spam sounds
      if (e.repeat) return;

      // Quick Theme Cycle on CapsLock or Tab
      if (e.key === 'Tab' || e.key === 'CapsLock') {
        e.preventDefault();
        const currentIdx = WORLD_THEMES.findIndex((t) => t.id === currentTheme.id);
        const nextTheme = WORLD_THEMES[(currentIdx + 1) % WORLD_THEMES.length];
        setCurrentTheme(nextTheme);
        soundEngine.playMagic();
        return;
      }

      dispatchKeyAction(e.key);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('pointerdown', handleUserTouch);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentTheme, dispatchKeyAction]);

  const totalDiscovered = discoveredLetters.size + discoveredNumbers.size + discoveredEggs.size;

  return (
    <div
      className={`relative w-screen h-screen overflow-hidden bg-gradient-to-br ${currentTheme.bgGradient} select-none font-bubble`}
    >
      {/* Dynamic Thematic Ambient Floating Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        {currentTheme.ambientEmoji.map((emoji, idx) => (
          <div
            key={idx}
            className="absolute text-5xl sm:text-7xl animate-float"
            style={{
              left: `${(idx * 22 + 8) % 90}%`,
              top: `${(idx * 27 + 12) % 80}%`,
              animationDelay: `${idx * 0.7}s`,
              animationDuration: `${3.5 + (idx % 3)}s`
            }}
          >
            {emoji}
          </div>
        ))}
      </div>

      {/* Top Header Navigation Bar */}
      <HeaderNav
        currentMode={currentMode}
        onModeChange={(m) => {
          setCurrentMode(m);
          setTargetKeyHint(null);
        }}
        currentTheme={currentTheme}
        onThemeChange={setCurrentTheme}
        onOpenAlbum={() => setIsAlbumOpen(true)}
        discoveredCount={totalDiscovered}
        onExitClick={() => setIsExitModalOpen(true)}
      />

      {/* Main Game Screen depending on Active Mode */}
      <main className="absolute inset-0 w-full h-full">
        {currentMode === 'free' && (
          <FreePlayMode
            currentTheme={currentTheme}
            latestKeyPress={latestKeyPress}
            onKeyDiscovered={handleKeyDiscovered}
            onEggTriggered={handleEggTriggered}
            mascotAction={mascotAction}
          />
        )}

        {currentMode === 'balloon' && (
          <BalloonPopMode
            latestKeyPress={latestKeyPress}
            onTargetKeyChange={setTargetKeyHint}
            onSuccessCount={() => {}}
          />
        )}

        {currentMode === 'train' && (
          <NumberTrainMode
            latestKeyPress={latestKeyPress}
            onTargetKeyChange={setTargetKeyHint}
            onSuccessCount={() => {}}
          />
        )}

        {currentMode === 'word' && (
          <WordBuilderMode
            latestKeyPress={latestKeyPress}
            onTargetKeyChange={setTargetKeyHint}
            onSuccessCount={() => {}}
          />
        )}

        {currentMode === 'piano' && <AnimalPianoMode latestKeyPress={latestKeyPress} />}
      </main>

      {/* Bottom Virtual Keyboard (Real-time synchronization & touch/click support) */}
      <div className="fixed bottom-2 left-0 right-0 z-30 pointer-events-none">
        <VirtualKeyboard
          activeKey={activeKey}
          onKeyPress={dispatchKeyAction}
          targetKey={targetKeyHint}
        />
      </div>

      {/* Full-Screen Easter Egg Magic Show Modal */}
      {activeEasterEgg && (
        <EasterEggModal egg={activeEasterEgg} onClose={() => setActiveEasterEgg(null)} />
      )}

      {/* Sticker Explorer Badge Album Modal */}
      {isAlbumOpen && (
        <BadgeAlbum
          discoveredLetters={discoveredLetters}
          discoveredNumbers={discoveredNumbers}
          discoveredEggs={discoveredEggs}
          onClose={() => setIsAlbumOpen(false)}
          onItemClick={(type, val) => {
            if (type === 'egg') {
              handleEggTriggered(val as string);
              setIsAlbumOpen(false);
            } else {
              dispatchKeyAction(`${val}`);
              setIsAlbumOpen(false);
            }
          }}
        />
      )}

      {/* Exit Game Confirmation Modal */}
      <ExitConfirmModal isOpen={isExitModalOpen} onClose={() => setIsExitModalOpen(false)} />
    </div>
  );
};

export default App;
