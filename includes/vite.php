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

  $ch = curl_init('http://localhost:3000/' . $entry);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_NOBODY, true);
  curl_exec($ch);
  $error = curl_errno($ch);
  curl_close($ch);

  return $exists = !$error;
}

add_filter('script_loader_tag', function ($tag, $handle) {
  // Check if $handle starts with module/
  if (explode('/', $handle)[0] != 'module') {
    return $tag;
  }

  $attrs = 'type="module"';
  $attrs .= IS_DEVELOPMENT ? ' crossorigin' : '';

  $tag = str_replace("<script ", "<script $attrs ", $tag);
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
    $url = self::base_path() . 'manifest.json';

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
    curl_setopt($ch, CURLOPT_HEADER, false);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_REFERER, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 3000); // 3 sec.
    curl_setopt($ch, CURLOPT_TIMEOUT, 10000); // 10 sec.
    $data = curl_exec($ch);
    curl_close($ch);

    return json_decode($data, true);
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
