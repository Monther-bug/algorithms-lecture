/* Tiny sound effects made with the Web Audio API (no audio files). */
(function () {
  let ctx = null;
  let muted = false;
  try { muted = localStorage.getItem('algo-muted') === '1'; } catch (e) { /* storage blocked */ }

  function audio() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function tone(freq, start, dur, type = 'triangle', gain = 0.14) {
    const c = audio();
    if (!c) return;
    const osc = c.createOscillator();
    const amp = c.createGain();
    const t = c.currentTime + start;
    osc.type = type;
    osc.frequency.value = freq;
    amp.gain.setValueAtTime(0.0001, t);
    amp.gain.exponentialRampToValueAtTime(gain, t + 0.02);
    amp.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(amp).connect(c.destination);
    osc.start(t);
    osc.stop(t + dur + 0.05);
  }

  const SOUNDS = {
    select: () => tone(560, 0, 0.08, 'triangle', 0.08),
    correct: () => { tone(660, 0, 0.16); tone(990, 0.11, 0.3); },
    wrong: () => { tone(210, 0, 0.22, 'sawtooth', 0.06); tone(150, 0.14, 0.34, 'sawtooth', 0.06); },
    tick: () => tone(1250, 0, 0.05, 'square', 0.035),
    timeup: () => { tone(440, 0, 0.2, 'square', 0.06); tone(300, 0.2, 0.42, 'square', 0.06); },
    fanfare: () => {
      [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.13, 0.28, 'triangle', 0.12));
      tone(1047, 0.56, 0.7, 'triangle', 0.1);
    },
  };

  window.Sound = {
    play(name) { if (!muted && SOUNDS[name]) SOUNDS[name](); },
    get muted() { return muted; },
    toggle() {
      muted = !muted;
      try { localStorage.setItem('algo-muted', muted ? '1' : '0'); } catch (e) { /* storage blocked */ }
      return muted;
    },
  };
})();
