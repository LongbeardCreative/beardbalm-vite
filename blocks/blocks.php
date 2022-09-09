<?php

defined('ABSPATH') || exit;


/**
 * Load all translations for our plugin from the MO file.
 */
// function gutenberg_examples_01_esnext_load_textdomain() {
//   load_plugin_textdomain('gutenberg-examples', false, basename(__DIR__) . '/languages');
// }
// add_action('init', 'gutenberg_examples_01_esnext_load_textdomain');

/**
 * Registers all block assets so that they can be enqueued through Gutenberg in
 * the corresponding context.
 *
 * Passes translations to JavaScript.
 */
function gutenberg_examples_01_esnext_register_block() {

  // Register the block by passing the location of block.json to register_block_type.
  register_block_type(__DIR__ . '/testimonial');

  // if (function_exists('wp_set_script_translations')) {
  //   /**
  //    * May be extended to wp_set_script_translations( 'my-handle', 'my-domain',
  //    * plugin_dir_path( MY_PLUGIN ) . 'languages' ) ). For details see
  //    * https://make.wordpress.org/core/2018/11/09/new-javascript-i18n-support-in-wordpress/
  //    */
  //   wp_set_script_translations('gutenberg-examples-01-esnext', 'gutenberg-examples');
  // }
}
add_action('init', 'gutenberg_examples_01_esnext_register_block');
