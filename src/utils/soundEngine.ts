// High-performance, zero-latency Audio & Speech Engine with pre-rendered native audio files and instant cache

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isBgmPlaying: boolean = false;
  private bgmTimer: number | null = null;
  private voiceLanguage: 'bilingual' | 'en' | 'zh' = 'bilingual';
  private currentAudio: HTMLAudioElement | null = null;
  private audioCache: Map<string, HTMLAudioElement> = new Map();
  private isUnlocked: boolean = false;

  constructor() {
    // Pre-initialize on construction
  }

  public unlockAudio() {
    if (this.isUnlocked) return;
    this.isUnlocked = true;
    this.initCtx();
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      if (this.isBgmPlaying) {
        this.stopBgm();
      }
      if (this.currentAudio) {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
        this.currentAudio = null;
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
  }

  public getMuted() {
    return this.isMuted;
  }

  public setVoiceLanguage(lang: 'bilingual' | 'en' | 'zh') {
    this.voiceLanguage = lang;
  }

  public getVoiceLanguage() {
    return this.voiceLanguage;
  }

  // --- Real Audio File Player (100% Reliable Native Voice with Zero Latency) ---

  public playVoiceFile(url: string) {
    if (this.isMuted) return;
    try {
      if (this.currentAudio) {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      }
      let audio = this.audioCache.get(url);
      if (!audio) {
        audio = new Audio(url);
        audio.volume = 1.0;
        this.audioCache.set(url, audio);
      } else {
        audio.currentTime = 0;
      }
      this.currentAudio = audio;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.warn('Audio play failed for', url, err);
        });
      }
    } catch (e) {
      console.warn('Audio file error:', e);
    }
  }

  public speakLetterFeedback(letter: string, itemName?: string, itemNameCn?: string, itemIndex: number = 0) {
    if (this.isMuted) return;
    const upper = letter.toUpperCase();
    const lang = this.voiceLanguage || 'bilingual';
    const urlWithIndex = `/audio/letters/${lang}/${upper}_${itemIndex}.m4a`;
    this.playVoiceFile(urlWithIndex);
  }

  public speakNumberFeedback(num: number, nameEn?: string, nameCn?: string, countStr?: string) {
    if (this.isMuted) return;
    const lang = this.voiceLanguage || 'bilingual';
    this.playVoiceFile(`/audio/numbers/${lang}/${num}.m4a`);
  }

  public playEggVoice(word: string) {
    if (this.isMuted) return;
    this.playVoiceFile(`/audio/eggs/${word.toUpperCase()}.m4a`);
  }

  public playCorrectPrompt() {
    if (this.isMuted) return;
    this.playVoiceFile('/audio/prompts/correct.m4a');
  }

  public playWrongPrompt() {
    if (this.isMuted) return;
    if (this.voiceLanguage === 'en') {
      this.playVoiceFile('/audio/prompts/wrong_en.m4a');
    } else {
      this.playVoiceFile('/audio/prompts/wrong.m4a');
    }
  }

  public speakPrompt(promptText: string, promptKey?: string) {
    if (this.isMuted) return;
    if (promptKey) {
      this.playVoiceFile(`/audio/prompts/${promptKey}.m4a`);
    } else {
      this.speak(promptText, 'zh');
    }
  }

  // --- Web Speech API (TTS) Fallback ---

  public speak(text: string, lang: 'zh' | 'en' = 'zh') {
    if (this.isMuted) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    try {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.volume = 1.0;
      utterance.rate = 1.0;
      utterance.pitch = 1.15;
      utterance.lang = lang === 'zh' ? 'zh-CN' : 'en-US';

      window.speechSynthesis.speak(utterance);
    } catch {}
  }

  // --- Web Audio Synthesized Sound Effects ---

  public playPop() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.08);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  }

  public playBoing() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(520, now + 0.22);
    osc.frequency.linearRampToValueAtTime(320, now + 0.35);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.38);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.39);
  }

  public playSparkle() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        if (!this.ctx || this.isMuted) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const now = this.ctx.currentTime;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.005, now + 0.28);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.3);
      }, idx * 45);
    });
  }

  public playMagic() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const notes = [440, 554.37, 659.25, 880, 1108.73, 1318.51, 1760];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        if (!this.ctx || this.isMuted) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const now = this.ctx.currentTime;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.005, now + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.42);
      }, idx * 50);
    });
  }

  public playFanfare() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const chords = [
      { notes: [261.63, 329.63, 392.00], time: 0, dur: 0.15 },
      { notes: [261.63, 329.63, 392.00], time: 140, dur: 0.15 },
      { notes: [261.63, 329.63, 392.00], time: 280, dur: 0.15 },
      { notes: [329.63, 392.00, 523.25], time: 440, dur: 0.6 }
    ];

    chords.forEach(({ notes, time, dur }) => {
      setTimeout(() => {
        if (!this.ctx || this.isMuted) return;
        notes.forEach(freq => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();
          const now = this.ctx!.currentTime;

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now);

          gain.gain.setValueAtTime(0.25, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + dur);

          osc.connect(gain);
          gain.connect(this.ctx!.destination);

          osc.start(now);
          osc.stop(now + dur + 0.05);
        });
      }, time);
    });
  }

  public playTrumpet() {
    this.playFanfare();
  }

  public playSwoosh() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(900, now + 0.18);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.32);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.36);
  }

  public playVacuum() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(350, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.4);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.46);
  }

  public playMeow() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.linearRampToValueAtTime(700, now + 0.15);
    osc.frequency.linearRampToValueAtTime(500, now + 0.4);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.42);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.43);
  }

  public playQuack() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.linearRampToValueAtTime(240, now + 0.18);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.24);
  }

  public playRoar() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.linearRampToValueAtTime(90, now + 0.4);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.46);
  }

  public playNote(freq: number, instrument: string = 'xylophone') {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    if (instrument === 'cat') {
      this.playMeow();
      return;
    }
    if (instrument === 'duck') {
      this.playQuack();
      return;
    }
    if (instrument === 'frog') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq * 0.5, now);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    } else if (instrument === 'harp') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * 1.5, now);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.005, now + 0.8);
    } else if (instrument === 'drum') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq * 0.4, now);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.15);
      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
    } else {
      // Default: Xylophone
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.005, now + 0.45);
    }

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.5);
  }

  public playSoundByType(type: string, freq?: number) {
    switch (type) {
      case 'pop': this.playPop(); break;
      case 'boing': this.playBoing(); break;
      case 'sparkle': this.playSparkle(); break;
      case 'magic': this.playMagic(); break;
      case 'swoosh': this.playSwoosh(); break;
      case 'meow': this.playMeow(); break;
      case 'quack': this.playQuack(); break;
      case 'roar': this.playRoar(); break;
      case 'chime': this.playSparkle(); break;
      case 'trumpet': this.playFanfare(); break;
      default:
        if (freq) {
          this.playNote(freq);
        } else {
          this.playPop();
        }
    }
  }

  // --- Background Melody Lullaby Player ---

  public toggleBgm(): boolean {
    if (this.isBgmPlaying) {
      this.stopBgm();
      return false;
    } else {
      this.startBgm();
      return true;
    }
  }

  public isBgmActive(): boolean {
    return this.isBgmPlaying;
  }

  public startBgm() {
    if (this.isMuted) return;
    this.initCtx();
    this.isBgmPlaying = true;

    const pentatonicScale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25];
    let noteIndex = 0;

    const playMelodyNote = () => {
      if (!this.isBgmPlaying || !this.ctx || this.isMuted) return;
      const freq = pentatonicScale[noteIndex % pentatonicScale.length];
      noteIndex = (noteIndex + Math.floor(Math.random() * 3) + 1) % pentatonicScale.length;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.65);

      this.bgmTimer = window.setTimeout(playMelodyNote, 420);
    };

    playMelodyNote();
  }

  public stopBgm() {
    this.isBgmPlaying = false;
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }
}

export const soundEngine = new SoundEngine();
