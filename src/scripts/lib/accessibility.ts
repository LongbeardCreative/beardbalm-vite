import { deviceHasTouchScreen } from '../utils/helpers';

/**
 * Accessibility helpers
 * -- Detecting the use of keyboard tabs, mouse, or touch device
 */
export default function accessibility() {
  // Remove focus from links
  document.body.classList.add('is-mouse');

  // Listen to tab events to enable outlines (accessibility improvement)
  document.body.addEventListener('keyup', (e) => {
    if (e.key === 'Tab') {
      document.body.classList.remove('is-mouse');
    }
  });

  // Let the document know when the mouse is being used
  document.body.addEventListener('mousedown', () => {
    document.body.classList.add('is-mouse');
  });

  // Check if this is touch device
  if (deviceHasTouchScreen()) {
    document.body.classList.add('is-touch-device');
  } else {
    document.body.classList.add('not-touch-device');
  }
}
