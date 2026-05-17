/**
 * Accessible Dice RNG logic
 * - Rolls a die (1-6) on tap/click
 * - Speaks the result aloud
 * - Vibrates for tactile feedback
 */

export function speak(text) {
  if ('speechSynthesis' in window) {
    const utter = new window.SpeechSynthesisUtterance(text);
    utter.lang = 'en-US';
    utter.rate = 1;
    utter.pitch = 1.1;
    window.speechSynthesis.cancel(); // Stop any ongoing speech
    window.speechSynthesis.speak(utter);
  }
}

export function vibrate(pattern = [100, 50, 100]) {
  if (navigator.vibrate) {
    navigator.vibrate(pattern);
  }
}

export function rollDie() {
  return Math.floor(Math.random() * 6) + 1;
}
