import './guessSound.css';

// Example sound set (public domain/pexels audio URLs)
const SOUNDS = [
  {
    label: 'Cat Meowing',
    url: 'https://www.pexels.com/audio/download/856982/', // Cat
    choices: ['Cat Meowing', 'Dog Barking', 'Cow Mooing', 'Horse Neighing'],
  },
  {
    label: 'Fire Truck Siren',
    url: 'https://www.pexels.com/audio/download/1451356/', // Fire truck
    choices: ['Ambulance Siren', 'Fire Truck Siren', 'Police Car', 'Train Whistle'],
  },
  {
    label: 'Piano Note',
    url: 'https://www.pexels.com/audio/download/164789/', // Piano
    choices: ['Piano Note', 'Guitar Strum', 'Drum Beat', 'Violin'],
  },
  {
    label: 'Bird Chirping',
    url: 'https://www.pexels.com/audio/download/1162645/', // Bird
    choices: ['Bird Chirping', 'Frog Croaking', 'Cricket', 'Duck Quacking'],
  },
  {
    label: 'Helicopter',
    url: 'https://www.pexels.com/audio/download/1103568/', // Helicopter
    choices: ['Helicopter', 'Airplane', 'Car Engine', 'Boat Horn'],
  },
  {
    label: 'Rain Falling',
    url: 'https://www.pexels.com/audio/download/1264152/', // Rain
    choices: ['Rain Falling', 'Waves Crashing', 'Wind Blowing', 'Fire Crackling'],
  },
  {
    label: 'Dog Barking',
    url: 'https://www.pexels.com/audio/download/856981/', // Dog
    choices: ['Dog Barking', 'Wolf Howling', 'Lion Roaring', 'Sheep Baaing'],
  },
  {
    label: 'Train Whistle',
    url: 'https://www.pexels.com/audio/download/1162647/', // Train
    choices: ['Train Whistle', 'Boat Horn', 'Car Horn', 'Bicycle Bell'],
  },
  {
    label: 'Drum Beat',
    url: 'https://www.pexels.com/audio/download/164790/', // Drum
    choices: ['Drum Beat', 'Piano Note', 'Guitar Strum', 'Trumpet'],
  },
  {
    label: 'Horse Neighing',
    url: 'https://www.pexels.com/audio/download/856983/', // Horse
    choices: ['Horse Neighing', 'Cow Mooing', 'Goat Bleating', 'Pig Oinking'],
  },
];

function shuffle(arr) {
  return arr.map(v => [Math.random(), v]).sort().map(a => a[1]);
}

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

export function setupGuessSoundApp(root, onBack) {
  root.className = 'guess-sound-root';
  root.innerHTML = '';

  let round = 0;
  let score = 0;
  let gameOrder = shuffle([...SOUNDS]).slice(0, 5);

  // Header
  const header = document.createElement('div');
  header.className = 'guess-sound-header';
  header.textContent = '🎧 Guess the Sound!';
  header.tabIndex = 0;
  header.setAttribute('aria-label', 'Guess the Sound! Listen and choose the correct answer.');
  header.addEventListener('focus', () => speak(header.textContent));
  root.appendChild(header);

  // Instructions
  const instructions = document.createElement('div');
  instructions.className = 'guess-sound-instructions';
  instructions.textContent = 'Listen to the sound, then pick the right answer. Use keyboard, touch, or screen reader. 5 rounds!';
  instructions.tabIndex = 0;
  instructions.setAttribute('aria-label', instructions.textContent);
  instructions.addEventListener('focus', () => speak(instructions.textContent));
  root.appendChild(instructions);

  // Status
  const status = document.createElement('div');
  status.className = 'guess-sound-status';
  status.textContent = '';
  status.tabIndex = 0;
  status.setAttribute('aria-live', 'polite');
  root.appendChild(status);

  // Sound player
  const soundBox = document.createElement('div');
  soundBox.className = 'guess-sound-player';
  root.appendChild(soundBox);

  // Choices grid
  const choicesGrid = document.createElement('div');
  choicesGrid.className = 'guess-sound-choices';
  root.appendChild(choicesGrid);

  // Controls
  const controls = document.createElement('div');
  controls.className = 'guess-sound-controls';

  const nextBtn = document.createElement('button');
  nextBtn.className = 'guess-sound-next-btn';
  nextBtn.textContent = 'Next';
  nextBtn.setAttribute('aria-label', 'Next round');
  nextBtn.style.display = 'none';
  nextBtn.tabIndex = 0;
  nextBtn.addEventListener('focus', () => speak('Next round'));
  nextBtn.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      nextBtn.click();
    }
  });
  nextBtn.addEventListener('click', () => {
    round++;
    showRound();
  });
  controls.appendChild(nextBtn);

  const playAgainBtn = document.createElement('button');
  playAgainBtn.className = 'guess-sound-playagain-btn';
  playAgainBtn.textContent = 'Play Again';
  playAgainBtn.setAttribute('aria-label', 'Play again');
  playAgainBtn.style.display = 'none';
  playAgainBtn.tabIndex = 0;
  playAgainBtn.addEventListener('focus', () => speak('Play again'));
  playAgainBtn.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      playAgainBtn.click();
    }
  });
  playAgainBtn.addEventListener('click', () => {
    round = 0;
    score = 0;
    gameOrder = shuffle([...SOUNDS]).slice(0, 5);
    showRound();
  });
  controls.appendChild(playAgainBtn);

  const backBtn = document.createElement('button');
  backBtn.className = 'guess-sound-back-btn';
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

  // Keyboard navigation for choices
  function focusChoice(idx) {
    const btns = choicesGrid.querySelectorAll('button');
    if (btns[idx]) btns[idx].focus();
  }

  function showRound() {
    status.textContent = `Round ${round + 1} of 5. Score: ${score}`;
    choicesGrid.innerHTML = '';
    soundBox.innerHTML = '';
    nextBtn.style.display = 'none';
    playAgainBtn.style.display = 'none';

    if (round >= 5) {
      // Game over
      status.textContent = `Game Over! Your score: ${score} out of 5.`;
      speak(`Game Over! Your score is ${score} out of 5.`);
      playAgainBtn.style.display = '';
      return;
    }

    const sound = gameOrder[round];
    // Play button
    const playBtn = document.createElement('button');
    playBtn.className = 'guess-sound-play-btn';
    playBtn.textContent = '🔊 Play Sound';
    playBtn.setAttribute('aria-label', 'Play sound');
    playBtn.tabIndex = 0;
    playBtn.addEventListener('focus', () => speak('Play sound'));
    playBtn.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        playBtn.click();
      }
    });
    playBtn.addEventListener('click', () => {
      playAudio(sound.url);
      vibrate(40);
    });
    soundBox.appendChild(playBtn);

    // Choices
    const shuffledChoices = shuffle([...sound.choices]);
    shuffledChoices.forEach((choice, idx) => {
      const btn = document.createElement('button');
      btn.className = 'guess-sound-choice-btn';
      btn.textContent = choice;
      btn.setAttribute('aria-label', choice);
      btn.tabIndex = 0;
      btn.addEventListener('focus', () => speak(choice));
      btn.addEventListener('mouseenter', () => speak(choice));
      btn.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          btn.click();
        }
        // Arrow navigation
        if (e.key === 'ArrowRight') focusChoice((idx + 1) % shuffledChoices.length);
        if (e.key === 'ArrowLeft') focusChoice((idx - 1 + shuffledChoices.length) % shuffledChoices.length);
      });
      btn.addEventListener('click', () => {
        if (btn.disabled) return;
        btn.disabled = true;
        checkAnswer(choice, sound.label, btn);
      });
      choicesGrid.appendChild(btn);
    });

    // Focus first choice after a short delay
    setTimeout(() => focusChoice(0), 300);
    // Play sound automatically at start
    setTimeout(() => playAudio(sound.url), 600);
  }

  function playAudio(url) {
    // Remove any previous audio
    soundBox.querySelectorAll('audio').forEach(a => a.remove());
    const audio = document.createElement('audio');
    audio.src = url;
    audio.autoplay = true;
    audio.tabIndex = -1;
    audio.setAttribute('aria-label', 'Sound effect');
    soundBox.appendChild(audio);
    audio.play();
  }

  function checkAnswer(choice, answer, btn) {
    const correct = choice === answer;
    if (correct) {
      btn.classList.add('correct');
      status.textContent = 'Correct!';
      speak('Correct!');
      vibrate(80);
      score++;
    } else {
      btn.classList.add('incorrect');
      status.textContent = `Try again! The answer was: ${answer}`;
      speak(`Try again! The answer was: ${answer}`);
      vibrate([100, 60, 100]);
    }
    // Disable all choices
    choicesGrid.querySelectorAll('button').forEach(b => b.disabled = true);
    nextBtn.style.display = '';
    // Focus next button
    setTimeout(() => nextBtn.focus(), 400);
  }

  // Start first round
  showRound();

  // Clean up on exit
  root._cleanupGuessSound = () => {
    window.speechSynthesis.cancel();
  };
}
