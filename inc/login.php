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
  require_once get_theme_file_path('inc/vite.php');
  Vite::load('login.ts');
}
add_action('login_enqueue_scripts', 'lb_login_stylesheet');
