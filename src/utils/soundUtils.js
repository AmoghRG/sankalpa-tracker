/**
 * Audio and Haptic feedback utilities using Web Audio API
 */

let audioCtx = null;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Plays a resonant spiritual temple bell / singing bowl chime
 * @param {string} type - 'bell' | 'chime' | 'malaComplete'
 */
export function playChantSound(type = 'bell') {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    if (type === 'malaComplete') {
      // Celebratory harmonic chord (3 tones)
      const freqs = [528, 660, 792]; // Harmonic Solfeggio triad
      freqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.18, now + i * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 2.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 2.6);
      });
      return;
    }

    // Sacred singing bowl / brass bell sound
    // Fundamental + overtones with gentle exponential decay
    const fundamentalFreq = type === 'chime' ? 660 : 528; // 528Hz Solfeggio frequency
    const harmonics = [
      { f: fundamentalFreq, gain: 0.25, decay: 1.8 },
      { f: fundamentalFreq * 2.02, gain: 0.12, decay: 1.4 },
      { f: fundamentalFreq * 3.01, gain: 0.05, decay: 0.9 },
    ];

    harmonics.forEach(({ f, gain: peakGain, decay }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(peakGain, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + decay);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + decay + 0.1);
    });
  } catch {
    // Ignore audio errors if audio context blocked by browser
  }
}

/**
 * Triggers subtle haptic vibration on mobile devices
 */
export function triggerHaptic(pattern = [25]) {
  try {
    if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  } catch {
    // Vibration not supported or not allowed
  }
}
