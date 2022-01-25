// To be run only locally / on development mode

interface AlertProps {
  text: string;
  actions: {
    onclick: string;
    text: string;
  };
}

const fontSans = `system-ui, -apple-system, segoe ui, roboto, ubuntu, cantarell, noto sans, sans-serif`;
const fontMono = `Dank Mono,Operator Mono,Inconsolata,Fira Mono,ui-monospace,SF Mono,Monaco,Droid Sans Mono,Source Code Pro,monospace`;

const styles = `
  <style type="text/css">
    #vite-alert {
      font-family: ${fontSans};
      font-size: 1rem;
      line-height: 1.5;
    }

    #vite-alert code {
      font-family: ${fontMono};
      font-size: 0.9rem;
      background-color: hsl(0 0% 0% / 0.16);
      padding: 0.125rem 0.375rem;
      border-radius: 0.25rem;
    }

    #vite-alert p {
      margin: 0 0 1rem;
    }

    #vite-alert p:last-child {
      margin-bottom: 0;
    }

    #vite-alert button {
      color: #228BE6;
      background: #E7F5FF;
      padding: 0.5rem 1rem;
      text-shadow: 0 1px 0 #D0EBEF;
      border: 0;
      border-radius: 0.25rem;
      font-size: 0.833rem;
      cursor: pointer;
    }

    #vite-alert button:hover {
      background: #D0EBEF;
    }
  </style>
`;

function showConsoleOverlay({ text, actions }: AlertProps) {
  document.body.insertAdjacentHTML(
    'beforeend',
    `
    ${styles}
    <div id="vite-alert" role="alert" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
      <div style="position: absolute; z-index: -1; top: 0; left: 0; width: 100%; height: 100%; background: hsl(0 0% 0% / 0.32); backdrop-filter: blur(1rem);" onclick="document.getElementById('vite-alert').style.display = 'none'"></div>
      <div style="width: 400px; max-width: 80%; background-color: hsl(0 0% 20%); color: hsl(0 0% 100%); padding: 2rem; border-radius: 1rem;">
        <p>${text}</p>
        <p>
          <button onclick="${actions.onclick}">${actions.text}</button>
        </p>
      </div>
    </div>`
  );
}

function showFooterOverlay({ text, actions }: AlertProps) {
  document.body.insertAdjacentHTML(
    'beforeend',
    `
    ${styles}
    <div id="vite-alert" role="alert" style="position: fixed; bottom: 0; left: 0; width: 100%; background: #63e6be; display: flex; align-items: center; justify-content: center;">
      <div style="padding: 0.5rem 1rem; display: flex; align-items: center;">
        <p style="color: hsl(0 0% 20%); margin: 0;">${text}</p>
        <p style="margin: 0;margin-left: 1rem;">
          <button onclick="${actions.onclick}">${actions.text}</button>
        </p>
      </div>
    </div>`
  );
}

async function checkViteServer() {
  try {
    await fetch('http://localhost:3000/main.ts');
  } catch (err) {
    if (document.cookie.includes('prod=')) {
      showFooterOverlay({
        text: 'Showing built assets. Update assets by running <code>npm run build</code>.',
        actions: {
          onclick: `document.cookie = 'prod=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'; location.reload();`,
          text: 'Switch to Development Mode',
        },
      });
    } else {
      showConsoleOverlay({
        text: 'Please run your Vite.js server via <code>npm run dev</code>, or load the built assets by refreshing:',
        actions: {
          onclick: `document.cookie='prod=;'; location.reload();`,
          text: 'Refresh',
        },
      });
    }
  }
}

checkViteServer();

export {};
