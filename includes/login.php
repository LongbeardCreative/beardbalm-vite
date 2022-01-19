<?php

/**
 * Change Login URL from WP URl to this site's url
 */
add_filter('login_headerurl', function (): string {
  return get_bloginfo('url');
});

/**
 * Change Login URL from WP URl to this site's url
 */
add_filter('login_headertext', function (): string {
  return get_bloginfo('name');
});

/**
 * Enqueue Login CSS
 */
function lb_login_stylesheet() {
  require_once get_theme_file_path('includes/vite.php');
  Vite::load('login.ts');
}
add_action('login_enqueue_scripts', 'lb_login_stylesheet');
