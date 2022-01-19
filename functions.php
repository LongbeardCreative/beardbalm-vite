<?php

/**
 * Theme functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 * @package WordPress
 * @subpackage beardbalm
 * @since Beard Balm 1.0.1
 * @author Longbeard
 * @url https://www.longbeard.com/
 */

$root_dir = get_template_directory();

// Define Theme Version
if (!defined('LB_VERSION')) {
  // Replace the version number of the theme on each release.
  define('LB_VERSION', '1.1');
}

require_once get_template_directory() . '/includes/helpers.php';
require_once get_template_directory() . '/includes/setup.php';
require_once get_template_directory() . '/includes/filters.php';
require_once get_template_directory() . '/includes/vite.php';
require_once get_template_directory() . '/includes/wptt-webfont-loader.php';
require_once get_template_directory() . '/includes/cpt.php';
require_once get_template_directory() . '/includes/widgets.php';
require_once get_template_directory() . '/includes/template-tags.php';
require_once get_template_directory() . '/includes/template-functions.php';
require_once get_template_directory() . '/includes/relevanssi.php';
require_once get_template_directory() . '/includes/login.php';


/**
 * Clean up admin bar
 */
add_action('wp_before_admin_bar_render', function (): void {
  global $wp_admin_bar;
  $wp_admin_bar->remove_menu('wp-logo');
  $wp_admin_bar->remove_menu('customize');
  $wp_admin_bar->remove_menu('updates');
  $wp_admin_bar->remove_menu('comments');
  $wp_admin_bar->remove_menu('wpseo-menu');
});

/**
 * Gravity Forms
 * Filters the next, previous and submit buttons.
 * Replaces the forms <input> buttons with <button> while maintaining attributes from original <input>.
 *
 * @param string $button Contains the <input> tag to be filtered.
 * @param object $form Contains all the properties of the current form.
 *
 * @return string The filtered button.
 */

function lb_gform_input_to_button($button, $form) {

  $dom = new DOMDocument();
  $dom->loadHTML('<?xml encoding="utf-8" ?>' . $button);
  /** @var DOMElement $input */
  $input = $dom->getElementsByTagName('input')->item(0);
  $new_button = $dom->createElement('button');

  // Whether to wrap text with span or not
  if (isset($form['cssClass']) && $form['cssClass'] == 'donate-form') {
    $span = $dom->createElement('span');

    $span->appendChild($dom->createTextNode($input->getAttribute('value')));
    // $new_button->setAttribute('class', $new_button->getAttribute('class') . ' ' . 'button--icon');
    $new_button->appendChild($span);
  } else {
    $new_button->appendChild($dom->createTextNode($input->getAttribute('value')));
  }

  $input->removeAttribute('value');
  foreach ($input->attributes as $attribute) {
    $new_button->setAttribute($attribute->name, $attribute->value);
  }

  $input->parentNode->replaceChild($new_button, $input);

  return $dom->saveHtml($new_button);
}

add_filter('gform_next_button', 'lb_gform_input_to_button', 10, 2);
add_filter('gform_previous_button', 'lb_gform_input_to_button', 10, 2);
add_filter('gform_submit_button', 'lb_gform_input_to_button', 10, 2);
