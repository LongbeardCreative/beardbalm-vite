import './style.scss';

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    // eslint-disable-next-line no-unused-vars
    toggleViteAlert: (value: boolean) => void;
  }
}
interface AlertProps {
  title?: string;
  text: string;
  actions?: {
    onclick: string;
    text: string;
  };
}

interface ManifestProps {
  [key: string]: {
    file: string;
    css?: string[];
  };
}

function initRefreshCron() {
  const manifestPath = '/wp-content/themes/beardbalm/dist/manifest.json';
  const cronrate = 1;
  // const loadCount = 0;

  function getStoredTime() {
    return window.sessionStorage.getItem('nt_css');
  }

  function parseFile(file: string) {
    const [fileName, fileHash, fileExt] = file.split('.');
    return { fileName, fileHash, fileExt };
  }

  function updateAssets(json: ManifestProps) {
    const assets = document.querySelectorAll<
      HTMLScriptElement | HTMLLinkElement
    >(
      'script[id*="beardbalm/"], link[id*="beardbalm/"], link[rel="modulepreload"]'
    );

    async function maybeUpdateAsset(file: string) {
      const { fileName, fileHash, fileExt } = parseFile(file);
      if (!fileName || !fileHash || !fileExt) {
        // Something is off, reload
        window.location.reload();
        return;
      }

      await Promise.all(
        [...assets].map(async (asset) => {
          const url = new URL(
            asset.tagName === 'SCRIPT'
              ? (asset as HTMLScriptElement).src
              : (asset as HTMLLinkElement).href
          ).pathname;

          const match = url.match(
            new RegExp(`${fileName}\\.(.*?)\\.${fileExt}`)
          );

          if (match) {
            const {
              fileName: currFileName,
              fileHash: currFileHash,
              fileExt: currFileExt,
            } = parseFile(match[0]);

            if (
              currFileName === fileName &&
              currFileExt === fileExt &&
              currFileHash !== fileHash
            ) {
              if (asset.tagName === 'SCRIPT') {
                (asset as HTMLScriptElement).src = (
                  asset as HTMLScriptElement
                ).src.replace(currFileHash, fileHash);
                window.location.reload(); // avoid needing to re-execute script
              } else {
                (asset as HTMLLinkElement).href = (
                  asset as HTMLLinkElement
                ).href.replace(currFileHash, fileHash);
              }

              console.log(
                `${currFileName}.{${currFileHash}->${fileHash}}.${currFileExt} updated `
              );
            }
          }
        })
      );
    }

    Object.keys(json).forEach((key) => {
      const { file, css } = json[key];
      if (file) {
        maybeUpdateAsset(file);
      }
      if (css?.length) {
        css.forEach((cssFile: string) => {
          maybeUpdateAsset(cssFile);
        });
      }
    });
  }

  function checkAssets(time: string, json: ManifestProps) {
    // console.log(json);
    if (!getStoredTime()) {
      // if no cookie for file
      window.sessionStorage.setItem('nt_css', time);
      updateAssets(json); // refresh CSS
    } else {
      const currTS = getStoredTime(); // read cookie

      if (currTS !== time) {
        // console.log(`res: ${res}cookie: ${currTS}`);
        window.sessionStorage.setItem('nt_css', time);
        updateAssets(json); // if no match, refresh stylesheet
      } else {
        // otherwise return
      }
    }
  }

  async function checkLastModified() {
    const res = await fetch(manifestPath, {
      method: 'GET',
    });
    const lastModified = res.headers.get('Last-Modified');
    const json = await res.json();
    checkAssets(lastModified || '', json);
  }

  window.setInterval(() => {
    checkLastModified();
  }, cronrate * 1000); // 1 second
}

function showFooterOverlay({ text, actions }: AlertProps) {
  window.toggleViteAlert = (show: boolean) => {
    const alert = document.querySelector<HTMLDivElement>('#vite-alert');
    const badge = document.querySelector<HTMLDivElement>('#vite-badge');
    if (alert && badge) {
      alert.style.display = show ? '' : 'none';
      badge.style.display = show ? 'none' : '';

      if (show) {
        document.cookie =
          'viteAlertHidden=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      } else {
        document.cookie = 'viteAlertHidden=;';
      }
    }
  };

  const hasViteAlertHiddenCookie = document.cookie.includes('viteAlertHidden=');

  document.body.insertAdjacentHTML(
    'beforeend',
    `
    <button id="vite-badge" onclick="toggleViteAlert(true)" data-vite-styles ${
      hasViteAlertHiddenCookie ? '' : 'style="display:none;"'
    }>
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0z" fill="none"/><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>
    </button>
    <div id="vite-alert" role="alert" data-vite-styles ${
      hasViteAlertHiddenCookie ? 'style="display:none;"' : ''
    }>
      <div class="vite-alert-bar">
        <div class="vite-alert-bar__inner">
          <div class="vite-alert-bar__text">
            <p>${text}</p>
          </div>
          ${
            actions
              ? `
          <div class="vite-alert-bar__actions">
            <button onclick="${actions.onclick}">${actions.text}</button>
          </div>
          `
              : ''
          }
        </div>
        <button class="vite-alert-bar__close" onclick="toggleViteAlert(false)">&times;</button>
      </div>
    </div>`
  );
}

async function checkViteServer() {
  try {
    await fetch('http://localhost:3000/main.ts');

    // IS DEV MODE
    // Remove cookie and refresh, so that the server knows to be in Dev mode
    if (document.cookie.includes('prod=')) {
      document.cookie = 'prod=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      window.location.reload();
    }
  } catch (err) {
    // IS WATCH MODE
    if (document.cookie.includes('prod=')) {
      showFooterOverlay({
        text: '<strong>Showing built assets.</strong> Develop locally with <code>npm run dev</code> or using watch mode with <code>npm run watch</code>.',
      });
      initRefreshCron();
    } else {
      document.cookie = 'prod=;';
      window.location.reload();
    }
  }
}

checkViteServer();

export {};
