<?php

define('IS_DEVELOPMENT', is_dev());

function is_dev(string $entry = 'main.ts'): bool {
  // This method is very useful for the local server
  // if we try to access it, and by any means, didn't started Vite yet
  // it will fallback to load the production files from manifest
  // so you still navigate your site as you intended!

  static $exists = null;
  if ($exists !== null) {
    return $exists;
  }
  $handle = curl_init('http://localhost:3000/' . $entry);
  curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($handle, CURLOPT_NOBODY, true);

  curl_exec($handle);
  $error = curl_errno($handle);
  curl_close($handle);

  return $exists = !$error;
}

add_filter('script_loader_tag', function ($tag, $handle) {
  // Check if $handle starts with module/
  if (explode('/', $handle)[0] != 'module') {
    return $tag;
  }

  // change the script tag by adding type="module" and return it.
  $tag = str_replace('<script ', '<script type="module" crossorigin ', $tag);
  return $tag;
}, 10, 2);

class Vite {

  public static function base_path(): string {
    return get_template_directory_uri() . '/dist/';
  }

  public static function load(string $entry = 'main.ts'): void {
    self::js_preload_imports($entry);
    self::css_tag($entry);
    self::register($entry);
  }

  public static function register(string $entry): void {
    $url = IS_DEVELOPMENT
      ? 'http://localhost:3000/' . $entry
      : self::asset_url($entry);

    if (!$url) {
      return;
    }

    if ($entry == 'login.ts' || $entry == 'login.js') {
      // Special treatment for login
      add_action('login_head', function () use (&$url) {
        echo '<script type="module" crossorigin src="' . $url . '"></script>';
      });
    } else {
      wp_register_script("module/beardbalm/$entry", $url, false, true);
      wp_enqueue_script("module/beardbalm/$entry");
    }
  }

  private static function js_preload_imports(string $entry): void {
    if (IS_DEVELOPMENT) {
      return;
    }

    $res = '';

    foreach (self::imports_urls($entry) as $url) {
      $res .= '<link rel="modulepreload" href="' . $url . '">';
    }

    add_action('wp_head', function () use (&$res) {
      echo $res;
    });
  }

  private static function css_tag(string $entry): void {
    if (IS_DEVELOPMENT) {
      return;
    }

    foreach (self::css_urls($entry) as $url) {
      wp_register_style("beardbalm/$entry", $url);
      wp_enqueue_style("beardbalm/$entry", $url);
    }
  }

  private static function get_manifest(): array {
    // $context_opts = array(
    //   "ssl" => array(
    //     "verify_peer" => false,
    //     "verify_peer_name" => false,
    //   ),
    // );
    $content = file_get_contents(
      self::base_path() . 'manifest.json'
      // , false, stream_context_create($context_opts)
    );

    return json_decode($content, true);
  }

  private static function asset_url(string $entry): string {
    $manifest = self::get_manifest();

    return isset($manifest[$entry])
      ? self::base_path() . $manifest[$entry]['file']
      : '';
  }

  private static function imports_urls(string $entry): array {
    $urls = [];
    $manifest = self::get_manifest();

    if (!empty($manifest[$entry]['imports'])) {
      foreach ($manifest[$entry]['imports'] as $imports) {
        $urls[] = self::base_path() . $manifest[$imports]['file'];
      }
    }
    return $urls;
  }

  private static function css_urls(string $entry): array {
    $urls = [];
    $manifest = self::get_manifest();

    if (!empty($manifest[$entry]['css'])) {
      foreach ($manifest[$entry]['css'] as $file) {
        $urls[] = self::base_path() . $file;
      }
    }
    return $urls;
  }
}
