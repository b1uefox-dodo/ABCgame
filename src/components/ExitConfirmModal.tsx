import React, { useState } from 'react';
import { LogOut } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

interface ExitConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExitConfirmModal: React.FC<ExitConfirmModalProps> = ({ isOpen, onClose }) => {
  const [isExiting, setIsExiting] = useState(false);
  const [serverExitStatus, setServerExitStatus] = useState<'server_stopped' | 'static_web' | null>(
    null
  );

  if (!isOpen) return null;

  const handleConfirmExit = async () => {
    setIsExiting(true);
    soundEngine.playSparkle();
    soundEngine.speak('宝宝再见，下次再来一起探险哦！');

    try {
      // Send termination signal to local Node / Vite server
      const res = await fetch('/api/exit', {
        method: 'POST'
      }).catch(() => null);

      if (res && res.ok) {
        setServerExitStatus('server_stopped');
      } else {
        setServerExitStatus('static_web');
      }
    } catch {
      setServerExitStatus('static_web');
    }

    // Try closing the browser window/tab
    setTimeout(() => {
      window.close();
    }, 1800);
  };

  return (
    <div
      onClick={!isExiting ? onClose : undefined}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-pop-in select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-white/95 rounded-3xl border-4 border-rose-300 shadow-2xl p-6 sm:p-8 flex flex-col items-center text-center gap-4 text-slate-800"
      >
        {!isExiting ? (
          <>
            {/* Header Icon */}
            <div className="w-16 h-16 rounded-full bg-rose-100 border-4 border-rose-300 flex items-center justify-center text-rose-500 shadow-inner animate-bounce-soft">
              <LogOut className="w-8 h-8" />
            </div>

            {/* Title & Desc */}
            <div className="flex flex-col gap-1">
              <h3 className="text-2xl font-black text-slate-800">确定要退出游戏吗？</h3>
              <p className="text-sm font-bold text-slate-500">
                退出后将关闭后台运行进程并结束游玩。
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 w-full mt-2">
              <button
                onClick={() => {
                  soundEngine.playPop();
                  onClose();
                }}
                className="btn-kid flex-1 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-sm sm:text-base transition"
              >
                继续玩耍 🌟
              </button>

              <button
                onClick={handleConfirmExit}
                className="btn-kid flex-1 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-red-600 text-white font-black text-sm sm:text-base shadow-lg transition active:scale-95"
              >
                退出并结束 🚪
              </button>
            </div>
          </>
        ) : (
          <div className="py-4 flex flex-col items-center gap-3 animate-pop-in">
            <span className="text-7xl animate-bounce">👋</span>
            <h3 className="text-2xl font-black text-slate-800">宝宝再见！下次再来玩哦！</h3>
            {serverExitStatus === 'server_stopped' ? (
              <div className="text-xs sm:text-sm font-bold text-emerald-700 bg-emerald-50 px-4 py-3 rounded-2xl border border-emerald-200 flex flex-col gap-1">
                <span>✅ 后台游戏进程已完整关闭！</span>
                <span className="text-slate-600 font-medium">
                  您可以直接关闭此浏览器网页标签。下次想玩时，双击桌面的【奇趣键盘大冒险】图标即可重新启动！
                </span>
              </div>
            ) : (
              <div className="text-xs sm:text-sm font-bold text-indigo-700 bg-indigo-50 px-4 py-3 rounded-2xl border border-indigo-200 flex flex-col gap-1">
                <span>🌟 感谢游玩奇趣键盘大冒险！</span>
                <span className="text-slate-600 font-medium">
                  您可以直接关闭当前网页标签页，或者随时刷新页面重新开始游戏！
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
