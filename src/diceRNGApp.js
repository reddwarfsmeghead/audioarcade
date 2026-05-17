import './diceRNG.css';
import { rollDie, speak, vibrate } from './diceRNG.js';

export function setupDiceRNGApp(root) {
  let currentNumber = rollDie();

  // Create elements
  const numberEl = document.createElement('div');
  numberEl.className = 'dice-rng-number';
  numberEl.setAttribute('role', 'status');
  numberEl.setAttribute('aria-live', 'polite');
  numberEl.setAttribute('tabindex', '0');
  numberEl.textContent = currentNumber;

  const instructionEl = document.createElement('div');
  instructionEl.className = 'dice-rng-instruction';
  instructionEl.textContent = 'Touch anywhere to roll the dice. The number will be read aloud.';

  root.className = 'dice-rng-root';
  root.innerHTML = '';
  root.appendChild(numberEl);
  root.appendChild(instructionEl);

  function rollAndAnnounce() {
    currentNumber = rollDie();
    numberEl.textContent = currentNumber;
    speak(`You rolled a ${currentNumber}`);
    vibrate();
  }

  // Touch/click anywhere to roll
  root.addEventListener('click', rollAndAnnounce);
  root.addEventListener('touchstart', (e) => {
    e.preventDefault();
    rollAndAnnounce();
  });

  // Keyboard accessibility (space/enter)
  root.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      rollAndAnnounce();
    }
  });

  // Initial announcement
  setTimeout(() => {
    speak(`Ready. Touch anywhere to roll the dice.`);
  }, 500);

  // Focus for keyboard users
  numberEl.focus();
}
