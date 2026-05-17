import './home.css';

const GAMES = [
  {
    id: 'dice',
    title: 'Dice Roller',
    description: 'Roll a dice and hear the result spoken aloud.',
  },
  {
    id: 'memory',
    title: 'Sound Memory Game',
    description: 'Listen to a sequence of sounds and repeat them. Each round gets harder.',
  },
  {
    id: 'maze',
    title: 'Audio Maze Adventure',
    description: 'Navigate a maze using sound cues. Find treasure or escape!',
  },
  {
    id: 'reaction',
    title: 'Reaction Time Challenge',
    description: 'Wait for the beep, then tap as fast as you can!',
  },
  {
    id: 'story',
    title: 'Story Choice Adventure',
    description: 'Choose your own adventure with spoken story choices.',
  },
  {
    id: 'bingo',
    title: 'Audio Bingo',
    description: 'Hear numbers or words and tap the matching button.',
  },
  {
    id: 'rhythm',
    title: 'Rhythm Tap Game',
    description: 'Tap in time with the drum beats. Great for music lovers!',
  },
  {
    id: 'guess',
    title: 'Guess The Sound',
    description: 'Hear a sound and guess what it is. Animals, vehicles, and more!',
  },
  {
    id: 'cooperative',
    title: 'Cooperative Treasure Hunt',
    description: 'Work together to follow audio clues and find the treasure.',
  },
  {
    id: 'rpg',
    title: 'Dice Battle RPG',
    description: 'Roll dice to battle monsters in a narrated adventure.',
  },
  {
    id: 'quiz',
    title: 'Accessible Quiz Games',
    description: 'Answer spoken questions on animals, space, and more.',
  }
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

export function setupHomeApp(root, onGameSelect) {
  root.className = 'home-root';
  root.innerHTML = '';

  const header = document.createElement('div');
  header.className = 'arcade-header';
  header.tabIndex = 0;
  header.textContent = '🎲 The Accessible Arcade';
  header.setAttribute('aria-label', 'The Accessible Arcade. A collection of audio-first games for blind and visually impaired kids.');
  header.addEventListener('focus', () => speak(header.textContent));
  root.appendChild(header);

  const intro = document.createElement('div');
  intro.className = 'arcade-intro';
  intro.textContent = 'Welcome! Explore a collection of audio-first, accessible games. All games are playable with keyboard, touch, and screen readers. Tap a game to hear a description, then press Enter or tap again to play.';
  intro.setAttribute('aria-label', intro.textContent);
  intro.tabIndex = 0;
  intro.addEventListener('focus', () => speak(intro.textContent));
  root.appendChild(intro);

  const grid = document.createElement('div');
  grid.className = 'arcade-grid';

  GAMES.forEach((game, idx) => {
    const btn = document.createElement('button');
    btn.className = 'arcade-game-btn';
    btn.textContent = game.title;
    btn.setAttribute('aria-label', `${game.title}. ${game.description} Press Enter to play.`);
    btn.tabIndex = 0;

    // Spoken description on focus/hover
    btn.addEventListener('focus', () => speak(`${game.title}. ${game.description}`));
    btn.addEventListener('mouseenter', () => speak(`${game.title}. ${game.description}`));

    // Keyboard accessibility: Enter/Space triggers click
    btn.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        btn.click();
      }
    });

    btn.addEventListener('click', () => {
      if (game.id === 'dice' || game.id === 'memory') {
        if (typeof onGameSelect === 'function') onGameSelect(game.id);
      } else {
        speak(`${game.title} is coming soon!`);
        showComingSoon(root, game.title, game.description, () => setupHomeApp(root, onGameSelect));
      }
    });

    grid.appendChild(btn);
  });

  root.appendChild(grid);

  // Focus the first game button for keyboard users
  setTimeout(() => {
    const firstBtn = grid.querySelector('button');
    if (firstBtn) firstBtn.focus();
  }, 300);
}

function showComingSoon(root, title, description, onBack) {
  root.className = 'home-root';
  root.innerHTML = '';

  const msg = document.createElement('div');
  msg.className = 'coming-soon-title';
  msg.textContent = `${title}`;
  msg.tabIndex = 0;
  msg.setAttribute('aria-label', `${title}. ${description}. Coming soon.`);
  msg.addEventListener('focus', () => speak(`${title}. ${description}. Coming soon.`));
  root.appendChild(msg);

  const desc = document.createElement('div');
  desc.className = 'coming-soon-desc';
  desc.textContent = description;
  desc.tabIndex = 0;
  desc.setAttribute('aria-label', description);
  desc.addEventListener('focus', () => speak(description));
  root.appendChild(desc);

  const soon = document.createElement('div');
  soon.className = 'coming-soon-msg';
  soon.textContent = 'Coming soon!';
  soon.tabIndex = 0;
  soon.setAttribute('aria-label', 'Coming soon!');
  soon.addEventListener('focus', () => speak('Coming soon!'));
  root.appendChild(soon);

  const backBtn = document.createElement('button');
  backBtn.className = 'arcade-back-btn';
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
  root.appendChild(backBtn);

  setTimeout(() => backBtn.focus(), 300);
}
