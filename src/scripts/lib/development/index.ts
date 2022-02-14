import './style.scss';

interface AlertProps {
  title?: string;
  text: string;
  actions: {
    onclick: string;
    text: string;
  };
}

function showConsoleOverlay({ title, text, actions }: AlertProps) {
  document.body.insertAdjacentHTML(
    'beforeend',
    `<div id="vite-alert" role="alert" data-vite-styles>
      <div class="vite-alert-dialog">
        <div class="vite-alert-dialog__overlay" onclick="document.getElementById('vite-alert').style.display = 'none'; document.getElementById('vite-badge').style.display = 'flex'"></div>
        <div class="vite-alert-dialog__card">
          <h2 class="vite-alert-dialog__card__title">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0z" fill="none"/><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>
            ${title}
          </h2>
          <p>${text}</p>
          <p style="text-align: right;">
            <button onclick="${actions.onclick}">${actions.text}</button>
          </p>
        </div>
      </div>
    </div>
    <button id="vite-badge" onclick="document.getElementById('vite-alert').style.display = 'flex'; document.getElementById('vite-badge').style.display = 'none'" data-vite-styles>
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0z" fill="none"/><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>
    </button>
    `
  );
}

function showFooterOverlay({ text, actions }: AlertProps) {
  document.body.insertAdjacentHTML(
    'beforeend',
    `<div id="vite-alert" role="alert" data-vite-styles>
      <div class="vite-alert-bar">
        <div class="vite-alert-bar__inner">
          <div class="vite-alert-bar__text">
            <p>${text}</p>
          </div>
          <div class="vite-alert-bar__actions">
            <button onclick="${actions.onclick}">${actions.text}</button>
          </div>
        </div>
      </div>
    </div>`
  );
}

async function checkViteServer() {
  try {
    await fetch('http://localhost:3000/main.ts');
    document.cookie = 'prod=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  } catch (err) {
    if (document.cookie.includes('prod=')) {
      showFooterOverlay({
        text: 'Showing built assets. Update assets by running <code>npm run build</code>.',
        actions: {
          onclick: `document.cookie = 'prod=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'; location.reload();`,
          text: `<svg width="16" height="22" viewBox="0 0 16 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 5V8L12 4L8 0V3C3.58 3 0 6.58 0 11C0 12.57 0.46 14.03 1.24 15.26L2.7 13.8C2.25 12.97 2 12.01 2 11C2 7.69 4.69 5 8 5ZM14.76 6.74L13.3 8.2C13.74 9.04 14 9.99 14 11C14 14.31 11.31 17 8 17V14L4 18L8 22V19C12.42 19 16 15.42 16 11C16 9.43 15.54 7.97 14.76 6.74V6.74Z" fill="currentColor"/></svg> Development Mode`,
        },
      });
    } else {
      showConsoleOverlay({
        title: 'Vite server not running ...',
        text: 'For development mode, please run your Vite server via <code>npm run dev</code>. If you want to preview the production assets, load the built assets:',
        actions: {
          onclick: `document.cookie='prod=;'; location.reload();`,
          text: `<svg width="16" height="22" viewBox="0 0 16 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 5V8L12 4L8 0V3C3.58 3 0 6.58 0 11C0 12.57 0.46 14.03 1.24 15.26L2.7 13.8C2.25 12.97 2 12.01 2 11C2 7.69 4.69 5 8 5ZM14.76 6.74L13.3 8.2C13.74 9.04 14 9.99 14 11C14 14.31 11.31 17 8 17V14L4 18L8 22V19C12.42 19 16 15.42 16 11C16 9.43 15.54 7.97 14.76 6.74V6.74Z" fill="currentColor"/></svg> Production Mode`,
        },
      });
    }
  }
}

checkViteServer();

export {};
