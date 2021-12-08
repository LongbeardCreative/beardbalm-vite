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

// JS/TS
import './theme.ts';
