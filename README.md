# Beardbalm + Vite.js

A boilerplate WordPress theme, powered by [Vite.js](https://vitejs.dev/) for ⚡️ developer experience.

Vite.js config is inspired by [vite-php-setup](https://github.com/andrefelipe/vite-php-setup) and [sage-vite](https://github.com/8bit-echo/sage-vite).

## Getting Started

- Set up and start your local WordPress server in whichever way you want, such as [Local](https://localwp.com/), [DevKinsta](https://kinsta.com/devkinsta/), [wp-env](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-env/), etc.

- Clone this repository to WordPress' `themes` folder by running:

  ```shell
  cd /path/to/wp-content/themes
  git clone https://github.com/LongbeardCreative/beardbalm-vite.git
  ```

- Ensure that `beardbalm` theme is activated on WordPress dashboard.

- Install dependencies and start your local Vite server:

  ```shell
  cd beardbalm
  npm i
  npm run dev
  ```

  Your Vite server will run at `http://localhost:3000/`, but feel free to change the port if needed.

- Visit your WordPress local URL (e.g. `https://beardbalm.local/`), not Vite server (e.g. `http://localhost:3000`), which will be empty. Vite server will be used only to serve assets on dev mode.

- Enjoy live reloading for PHP changes and hot module replacement for CSS and JS changes 😎.

- Once finish developing, you can build production-ready assets by running:

  ```
  npm run build
  ```

## Features

(Work in progress)

## Know Issues

(Work in progress)
