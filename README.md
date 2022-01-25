# Beardbalm &times; Vite.js

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

- Install dependencies if needed:

  ```shell
  cd beardbalm
  npm i
  ```

- Start your local Vite server:

  ```shell
  npm run dev
  ```

  Your Vite server will run at `http://localhost:3000/`, but feel free to change the port if needed.

- Visit your WordPress local URL (e.g. `https://beardbalm.local/`), **not** your Vite server (e.g. `http://localhost:3000`), which will be empty. The Vite server will be used only to serve assets on dev mode.

- Enjoy live reloading for PHP changes and hot module replacement for CSS and JS changes 😎.

- Once you're finished developing, you can build production-ready assets by running:

  ```
  npm run build
  ```

## JS / TS

JS / TS files are found under `/src/scripts` folder. All direct children of this folder will become "entrypoints" when bundled by vite, i.e. become separate files. Only `login.ts` and `main.ts` are by default enqueued on WordPress. If you create another entrypoint, you're responsible to enqueue that file via `/inc/setup.php` under `wp_enqueue_scripts` action hook.

For instance, if you have a new entrypoint called `home.ts`, which you'd like to load only on the homepage, simply use the `Vite::load()` utility function, like the following:

```php
// /inc/setup.php

add_action('wp_enqueue_scripts', function () {
  // ... other enqueues

  if (is_home()) {
    Vite::load('home.ts');
  }
});
```

### The `lib` folder

Most scripts under the `lib` folder (except for project-specific scripts) are not intended to be edited directly, although at this early stage, it might be necessary. The goal is to turn those scripts into NPM packages in the future, so that it's easier to test, make updates / patches across projects.

### jQuery

The use of jQuery is discouraged by many in the recent years. Vanilla JS is progressing quickly and becomes more performant over the years, while being able to achieve most things jQuery can with ease.

See the following blog for reference:

- [The performance impact of using jQuery in WordPress themes](https://make.wordpress.org/themes/2021/10/04/the-performance-impact-of-using-jquery-in-wordpress-themes/)

Handy reference to convert a jQuery function into a Vanilla one:

- [youmightnotneedjquery.com](https://youmightnotneedjquery.com/)

By default, jQuery is _dequeued_ on the frontend of this theme, with some exceptions (e.g. WooCommerce Pages, Gravity Forms usage). If you need to use jQuery on a certain page, you will need to specify that intentionally by adding a condition onto the dequeue function:

```php
// functions.php

add_action('wp_enqueue_scripts', function () {
  if (
    !is_admin() &&
    !is_woocommerce_url() &&
    // Add more conditions here,
    // e.g. if you want to load jQuery on a certain page template,
    // tell this conditional to not dequeue jQuery on that template
    !is_page_template('page-templates/some-template.php')
  ) {
    wp_dequeue_script('jquery');
    wp_deregister_script('jquery');
  }
});
```

### Third-party packages

It's recommended to use third-party packages that don't depend on jQuery. If they support installation via NPM, that's also the recommended way as usually tree-shaking is available on bigger libraries.

For example, to install [lightGallery](https://github.com/sachinchoolur/lightGallery), install via NPM as follows:

```shell
npm install --save lightgallery
```

And import the package into an entrypoint:

```ts
// main.ts

import lightGallery from 'lightgallery';

// Plugins
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';
```

## CSS / SCSS

CSS / SCSS files are found under `/src/styles`. All entrypoints must be imported into a JS / TS entrypoint, as otherwise Vite won't work correctly. For instance, `style.scss` is imported into `main.ts` like so:

```ts
// main.ts

import '../styles/style.scss';
// ... other imports
```

## Known Issues

(Work in progress)
