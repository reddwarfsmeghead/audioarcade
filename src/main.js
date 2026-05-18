import { setupHomeApp } from './homeApp.js';
import { setupSoundMemoryApp } from './soundMemoryApp.js';
import { setupGuessSoundApp } from './guessSoundApp.js';

const app = document.getElementById('app');

let currentCleanup = null;

function showHome() {
  cleanup();
  setupHomeApp(app, handleGameSelect);
  currentCleanup = null;
}

function handleGameSelect(gameId) {
  cleanup();
  if (gameId === 'memory') {
    setupSoundMemoryApp(app, showHome);
    currentCleanup = () => {
      if (app._cleanupSoundMemory) app._cleanupSoundMemory();
    };
  } else if (gameId === 'guess') {
    setupGuessSoundApp(app, showHome);
    currentCleanup = () => {
      if (app._cleanupGuessSound) app._cleanupGuessSound();
    };
  }
}

function cleanup() {
  if (currentCleanup) currentCleanup();
  window.speechSynthesis.cancel();
}

showHome();
