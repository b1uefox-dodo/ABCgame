import React, { useState, useEffect } from 'react';
import { NUMBERS_DATA } from '../data/gameData';
import { KeyPress } from '../types';
import { soundEngine } from '../utils/soundEngine';
import confetti from 'canvas-confetti';
import { Sparkles, Star, Volume2, ArrowRight } from 'lucide-react';

interface TrainCar {
  index: number;
  expectedNum: number;
  isFilled: boolean;
  itemEmoji: string;
  itemName: string;
  color: string;
}

interface NumberTrainModeProps {
  latestKeyPress: KeyPress | null;
  onTargetKeyChange?: (key: string | null) => void;
  onSuccessCount?: () => void;
}

export const NumberTrainMode: React.FC<NumberTrainModeProps> = ({
  latestKeyPress,
  onTargetKeyChange,
  onSuccessCount
}) => {
  const [trainCars, setTrainCars] = useState<TrainCar[]>([]);
  const [currentCarIndex, setCurrentCarIndex] = useState(0);
  const [isTrainDeparting, setIsTrainDeparting] = useState(false);
  const [trainScore, setTrainScore] = useState(0);
  const [promptMessage, setPromptMessage] = useState('欢迎来到数字小火车！按数字键给车厢装满货物吧！🚂');

  // Initialize a train with 5 sequential wagons
  const setupNewTrain = () => {
    const fruits = [
      { emoji: '🍎', name: '苹果' },
      { emoji: '🍌', name: '香蕉' },
      { emoji: '🍓', name: '草莓' },
      { emoji: '🍊', name: '橘子' },
      { emoji: '🍇', name: '葡萄' },
      { emoji: '🍉', name: '西瓜' },
      { emoji: '🍍', name: '菠萝' }
    ];

    const carCount = 5;
    const cars: TrainCar[] = [];
    for (let i = 1; i <= carCount; i++) {
      const f = fruits[(i - 1) % fruits.length];
      cars.push({
        index: i,
        expectedNum: i,
        isFilled: false,
        itemEmoji: f.emoji,
        itemName: f.name,
        color: NUMBERS_DATA[i]?.color || '#F59E0B'
      });
    }

    setTrainCars(cars);
    setCurrentCarIndex(0);
    setIsTrainDeparting(false);

    if (onTargetKeyChange) onTargetKeyChange('1');
    soundEngine.speakPrompt('小火车进站啦！请按数字 1，装入第 1 节车厢！');
    setPromptMessage('🚂 请按数字 【1】 装入货物！');
  };

  useEffect(() => {
    setupNewTrain();
  }, []);

  // Handle incoming keyboard press
  useEffect(() => {
    if (!latestKeyPress || isTrainDeparting || currentCarIndex >= trainCars.length) return;

    const num = parseInt(latestKeyPress.key, 10);
    const targetCar = trainCars[currentCarIndex];

    if (!isNaN(num) && targetCar && num === targetCar.expectedNum) {
      // MATCH NUMBER!
      soundEngine.playNote(NUMBERS_DATA[num]?.freq || 440);
      soundEngine.playPop();
      soundEngine.speakNumberFeedback(num, '', '');

      // Fill current wagon
      setTrainCars(prev =>
        prev.map((c, idx) => (idx === currentCarIndex ? { ...c, isFilled: true } : c))
      );

      const nextIdx = currentCarIndex + 1;
      setCurrentCarIndex(nextIdx);
      setTrainScore(s => s + 10);
      if (onSuccessCount) onSuccessCount();

      if (nextIdx < trainCars.length) {
        const nextExpected = trainCars[nextIdx].expectedNum;
        if (onTargetKeyChange) onTargetKeyChange(`${nextExpected}`);
        setPromptMessage(`太棒啦！接下来请按数字 【${nextExpected}】！`);
      } else {
        // FULL TRAIN COMPLETE! DEPARTURE CELEBRATION!
        handleTrainFull();
      }
    } else if (!isNaN(num)) {
      // Wrong number
      soundEngine.playBoing();
      setPromptMessage(`这是数字 ${num} 哦，当前车厢需要数字 【${targetCar.expectedNum}】！`);
    }
  }, [latestKeyPress]);

  const handleTrainFull = () => {
    setIsTrainDeparting(true);
    soundEngine.playFanfare();
    soundEngine.playVoiceFile('/audio/prompts/whistle.m4a');

    confetti({
      particleCount: 80,
      spread: 80,
      origin: { y: 0.6 }
    });

    setTimeout(() => {
      setupNewTrain();
    }, 3800);
  };

  const blowWhistle = () => {
    soundEngine.playTrumpet();
    soundEngine.playVoiceFile('/audio/prompts/whistle.m4a');
  };

  const currentExpected =
    currentCarIndex < trainCars.length
      ? trainCars[currentCarIndex].expectedNum
      : null;

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      {/* Mission Guidance Bar */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 w-11/12 max-w-xl animate-pop-in">
        <div className="flex items-center justify-between px-4 py-3 bg-white/90 backdrop-blur-xl rounded-3xl border-4 border-amber-300 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center text-2xl font-black shadow-md">
              {currentExpected !== null ? currentExpected : '🎉'}
            </div>
            <div className="text-left">
              <div className="text-xs font-black text-slate-400">小火车货运站</div>
              <div className="text-sm sm:text-base font-black text-slate-800">
                {promptMessage}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={blowWhistle}
              className="px-3 py-2 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-extrabold text-xs transition active:scale-95 flex items-center gap-1 shadow-sm"
              title="鸣笛"
            >
              <span>📢 鸣笛</span>
            </button>
            <div className="flex items-center gap-1 text-amber-600 font-black text-base">
              <Star className="w-4 h-4 fill-amber-400" /> {trainScore}
            </div>
          </div>
        </div>
      </div>

      {/* Train Track & Rolling Train Scene */}
      <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none pb-28">
        {/* Animated Moving Train Container */}
        <div
          className={`flex items-end gap-2 transition-all duration-1000 ${
            isTrainDeparting
              ? 'translate-x-[150vw] duration-[3500ms] ease-in'
              : 'translate-x-0'
          }`}
        >
          {/* Locomotive Engine (Front) */}
          <div className="relative flex flex-col items-center">
            {/* Puffed Colorful Steam Smoke */}
            <div className="absolute -top-14 left-6 flex gap-1 animate-bounce">
              <span className="text-2xl animate-spin-slow">💨</span>
              <span className="text-xl">✨</span>
            </div>

            {/* Locomotive Body */}
            <div className="w-32 sm:w-36 h-28 bg-gradient-to-tr from-rose-500 to-red-600 rounded-3xl shadow-2xl border-4 border-yellow-300 relative flex flex-col justify-between p-2 text-white">
              {/* Chimney */}
              <div className="absolute -top-5 left-6 w-7 h-6 bg-red-700 rounded-t-lg border-2 border-yellow-300" />
              
              {/* Driver window with smiling panda driver */}
              <div className="w-12 h-10 bg-sky-200 rounded-xl border-2 border-white self-end flex items-center justify-center text-2xl shadow-inner">
                🐼
              </div>

              {/* Headlight */}
              <div className="flex items-center justify-between">
                <div className="w-4 h-4 rounded-full bg-yellow-300 shadow-[0_0_15px_#FDE047] animate-pulse" />
                <span className="font-black text-xs px-2 py-0.5 rounded-full bg-red-800 text-yellow-300">
                  奇趣号
                </span>
              </div>
            </div>

            {/* Train Wheels */}
            <div className="flex gap-4 -mt-3">
              <div className="w-8 h-8 rounded-full bg-slate-800 border-4 border-yellow-400 shadow-md animate-spin-slow" />
              <div className="w-8 h-8 rounded-full bg-slate-800 border-4 border-yellow-400 shadow-md animate-spin-slow" />
            </div>
          </div>

          {/* Freight Wagons */}
          {trainCars.map((car, idx) => {
            const isCurrent = idx === currentCarIndex;
            return (
              <div key={car.index} className="flex items-end">
                {/* Coupler link */}
                <div className="w-3 h-2 bg-slate-700 -mb-5" />

                <div className="flex flex-col items-center">
                  {/* Wagon Cargo Basket */}
                  <div
                    className={`w-28 sm:w-32 h-24 rounded-3xl border-4 shadow-xl flex flex-col items-center justify-center p-2 relative transition-all ${
                      car.isFilled
                        ? 'bg-gradient-to-b from-white to-slate-100 border-emerald-400 scale-105 shadow-emerald-200'
                        : isCurrent
                        ? 'bg-amber-100/90 border-yellow-400 animate-pulse ring-4 ring-yellow-300'
                        : 'bg-white/60 border-dashed border-slate-400 opacity-60'
                    }`}
                  >
                    {/* Car Index Badge */}
                    <div
                      className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-white font-black text-xs shadow"
                      style={{ backgroundColor: car.color }}
                    >
                      {car.expectedNum} 号车厢
                    </div>

                    {/* Loaded Goods Content */}
                    {car.isFilled ? (
                      <div className="flex flex-col items-center animate-pop-in">
                        <div className="flex gap-1 text-2xl">
                          {Array.from({ length: Math.min(car.expectedNum, 3) }).map((_, i) => (
                            <span key={i} className="animate-bounce-soft">
                              {car.itemEmoji}
                            </span>
                          ))}
                        </div>
                        <span className="text-xs font-black text-slate-700 mt-1">
                          {car.expectedNum} 个{car.itemName}
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <span className="text-3xl opacity-40">📦</span>
                        <span className="text-[11px] font-black text-slate-500">
                          {isCurrent ? `按 【${car.expectedNum}】 装车` : '待装车'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Wagon Wheels */}
                  <div className="flex gap-4 -mt-3">
                    <div className="w-7 h-7 rounded-full bg-slate-800 border-4 border-yellow-400 shadow" />
                    <div className="w-7 h-7 rounded-full bg-slate-800 border-4 border-yellow-400 shadow" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Train Rails / Tracks */}
        <div className="w-full h-5 bg-gradient-to-r from-slate-600 via-slate-500 to-slate-600 relative mt-2 border-y-2 border-slate-700 shadow-md">
          {/* Ties */}
          <div className="absolute inset-0 flex justify-around items-center">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className="w-2 h-full bg-amber-900/60" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
