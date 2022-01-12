// https://vitejs.dev/config/#build-polyfillmodulepreload
// using workaround https://github.com/vitejs/vite/issues/4786
// if (import.meta.env.MODE !== "development") {
//   import("vite/modulepreload-polyfill");
// }

/**
 * Styles
 *
 * It is necessary to import styles to "link" a PHP page with Vite.js client
 * Without this, liveReload will not work
 */
import '../styles/style.scss';

// Scripts
import accessibility from './lib/accessibility';
import accordions from './lib/accordions';
import horizontalScroll from './lib/horizontalScroll';
import modal from './lib/modal';
import navigation from './lib/navigation';
import readMore from './lib/readMore';
import slider from './lib/slider';
import smoothScroll from './lib/smoothScroll';
import tabs from './lib/tabs';

document.addEventListener('DOMContentLoaded', () => {
  console.log('JMJ');
  navigation();
  accessibility();
  smoothScroll();
  accordions();
  tabs();
  readMore();
  horizontalScroll('.lb-tabs .tabs');
  modal();
  slider();
});
