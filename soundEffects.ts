class SoundEffectManager {
  private static instance: SoundEffectManager;
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;
  private volume: number = 0.3;

  private constructor() {
    // Initialize audio context on first user interaction
    this.initAudioContext();
  }

  public static getInstance(): SoundEffectManager {
    if (!SoundEffectManager.instance) {
      SoundEffectManager.instance = new SoundEffectManager();
    }
    return SoundEffectManager.instance;
  }

  private initAudioContext(): void {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn('AudioContext not supported:', error);
      this.enabled = false;
    }
  }

  // Play a notification sound using Web Audio API
  public playNotificationSound(type: 'default' | 'message' | 'like' = 'default'): void {
    if (!this.enabled || !this.audioContext) return;

    try {
      // Resume audio context if suspended (required by some browsers)
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }

      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      // Connect nodes
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      // Set sound parameters based on type
      switch (type) {
        case 'message':
          oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(600, this.audioContext.currentTime + 0.1);
          break;
        case 'like':
          oscillator.frequency.setValueAtTime(1000, this.audioContext.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(1200, this.audioContext.currentTime + 0.05);
          break;
        default:
          oscillator.frequency.setValueAtTime(900, this.audioContext.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(700, this.audioContext.currentTime + 0.15);
      }

      // Set volume envelope
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(this.volume, this.audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);

      // Play sound
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.2);

    } catch (error) {
      console.warn('Error playing notification sound:', error);
    }
  }

  // Play a simple beep sound
  public playBeep(frequency: number = 1000, duration: number = 100): void {
    if (!this.enabled || !this.audioContext) return;

    try {
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }

      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
      gainNode.gain.setValueAtTime(this.volume, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration / 1000);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration / 1000);

    } catch (error) {
      console.warn('Error playing beep:', error);
    }
  }

  // Enable/disable sound effects
  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  // Set volume (0.0 to 1.0)
  public setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  // Get current state
  public isEnabled(): boolean {
    return this.enabled;
  }

  public getVolume(): number {
    return this.volume;
  }

  // Play a success sound
  public playSuccessSound(): void {
    if (!this.enabled || !this.audioContext) return;

    try {
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }

      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      // Ascending tone for success
      oscillator.frequency.setValueAtTime(523, this.audioContext.currentTime); // C5
      oscillator.frequency.setValueAtTime(659, this.audioContext.currentTime + 0.1); // E5
      oscillator.frequency.setValueAtTime(784, this.audioContext.currentTime + 0.2); // G5

      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(this.volume, this.audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.3);

    } catch (error) {
      console.warn('Error playing success sound:', error);
    }
  }
}

export const soundEffectManager = SoundEffectManager.getInstance();

// Hook for React components
export const useSoundEffects = () => {
  const playNotificationSound = (type: 'default' | 'message' | 'like' = 'default') => {
    soundEffectManager.playNotificationSound(type);
  };

  const playBeep = (frequency?: number, duration?: number) => {
    soundEffectManager.playBeep(frequency, duration);
  };

  const playSuccessSound = () => {
    soundEffectManager.playSuccessSound();
  };

  const setEnabled = (enabled: boolean) => {
    soundEffectManager.setEnabled(enabled);
  };

  const setVolume = (volume: number) => {
    soundEffectManager.setVolume(volume);
  };

  return {
    playNotificationSound,
    playBeep,
    playSuccessSound,
    setEnabled,
    setVolume,
    isEnabled: soundEffectManager.isEnabled(),
    getVolume: soundEffectManager.getVolume(),
  };
};
