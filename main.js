import './style.css'
import { setupHomeApp } from './src/homeApp.js'
import { setupDiceRNGApp } from './src/diceRNGApp.js'
import { setupSoundMemoryApp } from './src/soundMemoryApp.js'

const app = document.querySelector('#app')

// Simple SPA navigation state
let currentPage = 'home';

function render() {
  // Clean up previous game event listeners if needed
  if (app._cleanupSoundMemory) {
    app._cleanupSoundMemory();
    delete app._cleanupSoundMemory;
  }

  if (currentPage === 'home') {
    setupHomeApp(app, (gameId) => {
      if (gameId === 'dice') {
        currentPage = 'dice';
      } else if (gameId === 'memory') {
        currentPage = 'memory';
      }
      render();
    });
  } else if (currentPage === 'dice') {
    setupDiceRNGApp(app, () => {
      currentPage = 'home';
      render();
    });
  } else if (currentPage === 'memory') {
    setupSoundMemoryApp(app, () => {
      currentPage = 'home';
      render();
    });
  }
}

// Patch homeApp to support navigation to memory game
// (If not already, update homeApp.js to pass gameId to navigateToDice)
render();
