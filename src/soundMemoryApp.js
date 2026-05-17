import './soundMemory.css';

const TONES = [
  { name: 'Low', freq: 261.6, color: '#9E7FFF', key: 'A', label: 'Low Tone' },
  { name: 'Mid', freq: 329.6, color: '#38bdf8', key: 'S', label: 'Mid Tone' },
  { name: 'High', freq: 392.0, color: '#f472b6', key: 'D', label: 'High Tone' },
  { name: 'Chime', freq: 523.3, color: '#10b981', key: 'F', label: 'Chime Tone' },
];

function speak(text) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utter = new window.SpeechSynthesisUtterance(text);
    utter.rate = 1;
    utter.pitch = 1;
    utter.volume = 1;
    window.speechSynthesis.speak(utter);
  }
}

function vibrate(ms) {
  if (navigator.vibrate) navigator.vibrate(ms);
}

function playTone(freq, duration = 500) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    osc.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.value = 0.18;
    osc.start();
    setTimeout(() => {
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.05);
      osc.stop(ctx.currentTime + 0.05);
      ctx.close();
    }, duration);
  } catch (e) {
    // AudioContext error, ignore
  }
}

function randomToneIdx() {
  return Math.floor(Math.random() * TONES.length);
}

export function setupSoundMemoryApp(root, onBack) {
  root.className = 'sound-memory-root';
  root.innerHTML = '';

  let sequence = [];
  let userStep = 0;
  let round = 1;
  let acceptingInput = false;
  let strictMode = false;

  // Header
  const header = document.createElement('div');
  header.className = 'sound-memory-header';
  header.textContent = '🔊 Sound Memory Game';
  header.tabIndex = 0;
  header.setAttribute('aria-label', 'Sound Memory Game. Repeat the sequence of tones.');
  header.addEventListener('focus', () => speak(header.textContent));
  root.appendChild(header);

  // Instructions
  const instructions = document.createElement('div');
  instructions.className = 'sound-memory-instructions';
  instructions.textContent = 'Listen to the sequence, then repeat it by pressing the colored buttons or keys (A, S, D, F). Each round adds a new sound!';
  instructions.tabIndex = 0;
  instructions.setAttribute('aria-label', instructions.textContent);
  instructions.addEventListener('focus', () => speak(instructions.textContent));
  root.appendChild(instructions);

  // Game status
  const status = document.createElement('div');
  status.className = 'sound-memory-status';
  status.textContent = 'Press Start to begin!';
  status.tabIndex = 0;
  status.setAttribute('aria-live', 'polite');
  root.appendChild(status);

  // Tone buttons
  const btnGrid = document.createElement('div');
  btnGrid.className = 'sound-memory-btn-grid';
  TONES.forEach((tone, idx) => {
    const btn = document.createElement('button');
    btn.className = 'sound-memory-btn';
    btn.style.background = `linear-gradient(135deg, ${tone.color} 60%, #262626 100%)`;
    btn.textContent = tone.name;
    btn.setAttribute('aria-label', `${tone.label}. Keyboard: ${tone.key}`);
    btn.tabIndex = 0;
    btn.dataset.idx = idx;
    btn.addEventListener('focus', () => speak(`${tone.label}`));
    btn.addEventListener('mouseenter', () => speak(`${tone.label}`));
    btn.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        btn.click();
      }
    });
    btn.addEventListener('click', () => {
      if (!acceptingInput) return;
      handleUserInput(idx);
    });
    btnGrid.appendChild(btn);
  });
  root.appendChild(btnGrid);

  // Controls
  const controls = document.createElement('div');
  controls.className = 'sound-memory-controls';

  const startBtn = document.createElement('button');
  startBtn.className = 'sound-memory-start-btn';
  startBtn.textContent = 'Start';
  startBtn.setAttribute('aria-label', 'Start game');
  startBtn.tabIndex = 0;
  startBtn.addEventListener('focus', () => speak('Start game'));
  startBtn.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      startBtn.click();
    }
  });
  startBtn.addEventListener('click', startGame);
  controls.appendChild(startBtn);

  const strictToggle = document.createElement('button');
  strictToggle.className = 'sound-memory-strict-btn';
  strictToggle.textContent = 'Strict Mode: Off';
  strictToggle.setAttribute('aria-label', 'Toggle strict mode');
  strictToggle.tabIndex = 0;
  strictToggle.addEventListener('focus', () => speak('Toggle strict mode'));
  strictToggle.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      strictToggle.click();
    }
  });
  strictToggle.addEventListener('click', () => {
    strictMode = !strictMode;
    strictToggle.textContent = `Strict Mode: ${strictMode ? 'On' : 'Off'}`;
    speak(`Strict mode ${strictMode ? 'on' : 'off'}`);
  });
  controls.appendChild(strictToggle);

  const backBtn = document.createElement('button');
  backBtn.className = 'sound-memory-back-btn';
  backBtn.textContent = 'Back to Arcade';
  backBtn.setAttribute('aria-label', 'Back to Arcade');
  backBtn.tabIndex = 0;
  backBtn.addEventListener('focus', () => speak('Back to Arcade'));
  backBtn.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      backBtn.click();
    }
  });
  backBtn.addEventListener('click', () => {
    if (typeof onBack === 'function') onBack();
  });
  controls.appendChild(backBtn);

  root.appendChild(controls);

  // Keyboard support for tones
  window.addEventListener('keydown', keyHandler);

  function keyHandler(e) {
    if (!acceptingInput) return;
    const idx = TONES.findIndex(t => t.key.toLowerCase() === e.key.toLowerCase());
    if (idx !== -1) {
      handleUserInput(idx);
    }
  }

  function startGame() {
    sequence = [];
    userStep = 0;
    round = 1;
    acceptingInput = false;
    status.textContent = 'Get ready!';
    speak('Round 1. Listen carefully.');
    vibrate(80);
    setTimeout(() => {
      addToSequence();
      playSequence();
    }, 800);
  }

  function addToSequence() {
    sequence.push(randomToneIdx());
  }

  function playSequence() {
    acceptingInput = false;
    userStep = 0;
    let i = 0;
    status.textContent = `Round ${round}: Listen carefully.`;
    speak(`Round ${round}. Listen carefully.`);
    vibrate(60);
    const playNext = () => {
      if (i >= sequence.length) {
        setTimeout(() => {
          status.textContent = 'Your turn!';
          speak('Your turn!');
          acceptingInput = true;
        }, 400);
        return;
      }
      const idx = sequence[i];
      highlightBtn(idx);
      playTone(TONES[idx].freq, 500);
      vibrate(40);
      setTimeout(() => {
        unhighlightBtn(idx);
        setTimeout(() => {
          i++;
          playNext();
        }, 180);
      }, 500);
    };
    playNext();
  }

  function highlightBtn(idx) {
    const btn = btnGrid.children[idx];
    btn.classList.add('active');
  }
  function unhighlightBtn(idx) {
    const btn = btnGrid.children[idx];
    btn.classList.remove('active');
  }

  function handleUserInput(idx) {
    if (!acceptingInput) return;
    playTone(TONES[idx].freq, 300);
    vibrate(30);
    highlightBtn(idx);
    setTimeout(() => unhighlightBtn(idx), 200);

    if (idx === sequence[userStep]) {
      userStep++;
      if (userStep === sequence.length) {
        acceptingInput = false;
        status.textContent = 'Correct!';
        speak('Correct!');
        vibrate(80);
        setTimeout(() => {
          round++;
          addToSequence();
          playSequence();
        }, 1200);
      }
    } else {
      acceptingInput = false;
      status.textContent = 'Try again!';
      speak('Try again!');
      vibrate([100, 60, 100]);
      if (strictMode) {
        setTimeout(() => {
          status.textContent = 'Game over! Press Start to try again.';
          speak('Game over! Press Start to try again.');
        }, 1200);
      } else {
        setTimeout(() => {
          userStep = 0;
          playSequence();
        }, 1200);
      }
    }
  }

  // Clean up event listeners on exit
  root._cleanupSoundMemory = () => {
    window.removeEventListener('keydown', keyHandler);
    window.speechSynthesis.cancel();
  };
}
