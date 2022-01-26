<?php
require_once ABSPATH . "/wp-admin/includes/file.php";
WP_Filesystem();

define('IS_DEVELOPMENT', is_dev());

function is_dev() {
  if (isset($_COOKIE['prod'])) {
    return false;
  }

  return wp_get_environment_type() == 'development' ? true : false;
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

  public static function base_path(?bool $public = true): string {
    if ($public) {
      return get_template_directory_uri() . '/dist/';
    }

    return get_template_directory() . '/dist/';
  }

  public static function load(string $entry = 'main.ts', ?bool $load_from_manifest = false): void {
    self::js_preload_imports($entry);
    self::css_tag($entry, $load_from_manifest);
    self::register($entry, $load_from_manifest);
  }

  public static function register(string $entry, ?bool $load_from_manifest = false): void {
    $url = IS_DEVELOPMENT && !$load_from_manifest
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

  private static function js_preload_imports(string $entry, ?bool $load_from_manifest = false): void {
    if (IS_DEVELOPMENT && !$load_from_manifest) {
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

  private static function css_tag(string $entry, ?bool $load_from_manifest = false): void {
    if (IS_DEVELOPMENT && !$load_from_manifest) {
      return;
    }

    foreach (self::css_urls($entry) as $url) {
      wp_register_style("beardbalm/$entry", $url);
      wp_enqueue_style("beardbalm/$entry", $url);
    }
  }

  private static function get_manifest(): array {
    global $wp_filesystem;

    $url = self::base_path(false) . 'manifest.json';
    $data = $wp_filesystem->get_contents($url);

    return json_decode($data ?: "{}", true);
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
