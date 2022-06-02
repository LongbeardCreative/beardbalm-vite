<?php

/**
 * Beardbalm WP CLI
 */

class Beardbalm_CLI {

  /**
   * Clear up fonts folder and regenerate fonts
   */
  public function regenerate_fonts() {
    if (!class_exists('WPTT_WebFont_Loader')) {
      WP_CLI::warning('WPTT_WebFont_Loader package does not exist. Skipping ...');
      return;
    }

    // Delete fonts folder
    $loader = new WPTT_WebFont_Loader();
    $delete = $loader->delete_fonts_folder();
    if ($delete) {
      WP_CLI::success('fonts/ folder deleted');
    } else {
      WP_CLI::error('cannot delete fonts/ folder');
      return;
    }

    // Regenerate by triggering wp_enqueue_scripts action
    do_action('wp_enqueue_scripts');
    WP_CLI::success('Regeneration completed!');
  }
}

/**
 * Registers our command when cli get's initialized.
 */
function beardbalm_cli_register_commands() {
  WP_CLI::add_command('beardbalm', 'Beardbalm_CLI');
}

add_action('cli_init', 'beardbalm_cli_register_commands');
