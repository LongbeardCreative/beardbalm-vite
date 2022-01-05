<?php

/**
 * Change Login URL from WP URl to this site's url
 */
function lb_login_logo_url() {
  return home_url('/');
}
add_filter('login_headerurl', 'lb_login_logo_url');

/**
 * Change Login URL from WP URl to this site's url
 */
function lb_login_logo_url_title() {
  return 'Longbeard';
}
add_filter('login_headertext', 'lb_login_logo_url_title');

/**
 * Enqueue Login CSS
 */
function lb_login_stylesheet() {
  // $filetime = filemtime(__DIR__ . '/login.css');
  // wp_enqueue_style('lb-login', get_template_directory_uri() . '/login.css', array(), $filetime);
  require_once get_theme_file_path('inc/vite.php');
  vite('login.ts');
  print_r(vite('login.ts'));
}
add_action('login_enqueue_scripts', 'lb_login_stylesheet');
