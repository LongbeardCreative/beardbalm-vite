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

// Define Theme Version
if (!defined('LB_VERSION')) {
  // Replace the version number of the theme on each release.
  define('LB_VERSION', '1.1');
}



require_once get_template_directory() . '/inc/utils.php';
require_once get_template_directory() . '/inc/vite.php';
require_once get_template_directory() . '/inc/wptt-webfont-loader.php';
require_once get_template_directory() . '/inc/cpt.php';
// require_once get_template_directory() . '/inc/widgets.php';
// require_once get_template_directory() . '/inc/template-tags.php';
require_once get_template_directory() . '/inc/template-functions.php';
// require get_template_directory() . '/inc/customizer.php';
require_once get_template_directory() . '/inc/relevanssi.php';
require_once get_template_directory() . '/inc/login.php';

/**
 * Change the base path. This is by default WP_CONTENT_DIR.
 * NOTE: Do not include trailing slash.
 */
add_filter('wptt_get_local_fonts_base_path', function ($path) {
  return get_template_directory() . '/src/fonts';
});

/**
 * Change the base URL. This is by default the content_url().
 * NOTE: Do not include trailing slash.
 */
add_filter('wptt_get_local_fonts_base_url', function ($url) {
  return get_template_directory_uri() . '/src/fonts';
});

// Enqueue essential scripts
function beardbalm_scripts() {
  // Cookie Consent
  // wp_enqueue_style( 'cookieconsent', get_template_directory_uri() . '/vendor/cookieconsent/cookieconsent.min.css', array(), '' );
  // wp_enqueue_script( 'cookieconsent', get_template_directory_uri() . '/vendor/cookieconsent/cookieconsent.min.js', array(), '', true );
  // wp_enqueue_script( 'beardbalm-cookieconsent', get_template_directory_uri() . '/js/cookieconsent.js', array(), LB_VERSION, true );

  // Theme styles and JS
  // $stylePath = __DIR__ . '/style.css';
  // $filetime = filemtime($stylePath);
  // wp_enqueue_style('beardbalm-style', get_stylesheet_uri(), array(), $filetime);

  // $jsPath = __DIR__ . '/src/js/main.js';
  // $filetimeJS = filemtime($jsPath);
  // wp_enqueue_script('beardbalm-js', get_template_directory_uri() . '/src/js/main.js', array('jquery'), $filetimeJS, true);

  // Web font
  // Load the webfont.
  wp_enqueue_style(
    'google-fonts',
    wptt_get_webfont_url('https://fonts.googleapis.com/css2?family=Bree+Serif&family=Poppins:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600;1,700&display=swap'),
    array(),
    '1.0'
  );

  // Main Scripts & Styles
  vite('main.ts');

  if (is_singular() && comments_open() && get_option('thread_comments')) {
    wp_enqueue_script('comment-reply');
  }

  wp_localize_script('beardbalm-js', 'siteData', array(
    'nonce'   => wp_create_nonce('lb-nonce'),
    'siteUrl' => get_site_url(),
    'ajaxUrl' => admin_url('admin-ajax.php'),
  ));
}
add_action('wp_enqueue_scripts', 'beardbalm_scripts');


/**
 * Remove the migrate script from the list of jQuery dependencies.
 * @param WP_Scripts $scripts WP_Scripts scripts object. Passed by reference.
 */
function lb_dequeue_jquery_migrate($scripts) {
  if (!is_admin() && !empty($scripts->registered['jquery'])) {
    $jquery_dependencies = $scripts->registered['jquery']->deps;
    $scripts->registered['jquery']->deps = array_diff($jquery_dependencies, array('jquery-migrate'));
  }
}
add_action('wp_default_scripts', 'lb_dequeue_jquery_migrate');


/**
 * Remove Customize from Admin Bar
 */

function lb_before_admin_bar_render() {
  global $wp_admin_bar;

  $wp_admin_bar->remove_menu('customize');
}

add_action('wp_before_admin_bar_render', 'lb_before_admin_bar_render');


if (!function_exists('beardbalm_setup')) :
  /**
   * Sets up theme defaults and registers support for various WordPress features.
   *
   * Note that this function is hooked into the after_setup_theme hook, which
   * runs before the init hook. The init hook is too late for some features, such
   * as indicating support for post thumbnails.
   */
  function beardbalm_setup() {
    // Enable support for Post Thumbnails on posts and pages.
    // @link https://developer.wordpress.org/themes/functionality/featured-images-post-thumbnails/
    add_theme_support('post-thumbnails');

    /**
     * Let WordPress manage the document title.
     * By adding theme support, we declare that this theme does not use a
     * hard-coded <title> tag in the document head, and expect WordPress to
     * provide it for us.
     */
    add_theme_support('title-tag');

    // Add default posts and comments RSS feed links to head.
    add_theme_support('automatic-feed-links');

    /**
     * Switch default core markup for search form, comment form, and comments
     * to output valid HTML5.
     */
    add_theme_support(
      'html5',
      array(
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
        'style',
        'script',
      )
    );

    /**
     * WooCommerce Theme Support
     */
    // add_theme_support(
    //   'woocommerce',
    //   array(
    //     'thumbnail_image_width' => 516,
    //     'single_image_width'    => 800,
    //     'product_grid'          => array(
    //       'default_rows'    => 3,
    //       'min_rows'        => 1,
    //       'default_columns' => 3,
    //       'min_columns'     => 1,
    //       'max_columns'     => 6,
    //     ),
    //   )
    // );
    // add_theme_support('wc-product-gallery-zoom');
    // add_theme_support('wc-product-gallery-lightbox');
    // add_theme_support('wc-product-gallery-slider');

    /**
     * Register Menu
     */
    register_nav_menus(
      array(
        'menu-1' => esc_html__('Primary', 'beardbalm'),
      )
    );
  }
endif;
add_action('after_setup_theme', 'beardbalm_setup');

/**
 * Register widget area.
 *
 * @link https://developer.wordpress.org/themes/functionality/sidebars/#registering-a-sidebar
 */
function beardbalm_widgets_init() {
  register_sidebar(
    array(
      'name'          => esc_html__('Sidebar', 'beardbalm'),
      'id'            => 'sidebar-1',
      'description'   => esc_html__('Add widgets here.', 'beardbalm'),
      'before_widget' => '<section id="%1$s" class="widget %2$s">',
      'after_widget'  => '</section>',
      'before_title'  => '<h2 class="widget-title">',
      'after_title'   => '</h2>',
    )
  );
}
add_action('widgets_init', 'beardbalm_widgets_init');

/**
 * Init Theme's ACF
 */

function lb_acf_init() {
  acf_add_options_page(array(
    'page_title'   => 'Theme General Settings',
    'menu_title'  => 'Theme Settings',
    'menu_slug'   => 'theme-general-settings',
    'capability'  => 'edit_posts',
    'redirect'    => false
  ));

  acf_add_options_sub_page(array(
    'page_title'   => 'Theme Header Settings',
    'menu_title'  => 'Header',
    'parent_slug'  => 'theme-general-settings',
  ));

  acf_add_options_sub_page(array(
    'page_title'   => 'Theme Footer Settings',
    'menu_title'  => 'Footer',
    'parent_slug'  => 'theme-general-settings',
  ));
}

add_action('acf/init', 'lb_acf_init');



/**
 * Filters WordPress' get_search_form()
 * 
 * @param string  $form   Form HTML
 * @return string $form   Form HTML
 * 
 * @link https://developer.wordpress.org/reference/functions/get_search_form/
 */

function lb_search_form($form) {
  $form = '<form role="search" method="get" id="searchform" class="searchform" action="' . home_url('/') . '" >
    <div><label class="screen-reader-text" for="s">' . __('Search for:') . '</label>
    <input type="text" value="" placeholder="Search..." name="s" id="s" />
    <button class="button" type="submit" id="searchsubmit" value="Search">Search</button>
    </div>
  </form>';

  return $form;
}
add_filter('get_search_form', 'lb_search_form');


/**
 * Add Video Tutorials link to WP Admin
 */

// function lb_videotutorials_admin_menu() {
//   global $submenu;
//   $url = '/video-tutorials';
//   $submenu['index.php'][] = array('Video Tutorials', 'manage_options', $url);
// }

// add_action('admin_menu', 'videotutorials_admin_menu');

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

/**
 * Get custom excerpt from Post Content
 * 
 * @param int $length       Length of excerpt in characters
 * 
 * @return string $excerpt  The Excerpt
 */

function lb_get_excerpt($length) {
  $excerpt = get_the_content();
  // $excerpt = preg_replace(" ([.*?])", '', $excerpt);
  $excerpt = strip_shortcodes($excerpt);
  $excerpt = strip_tags($excerpt);
  $excerpt = substr($excerpt, 0, $length);
  $excerpt = substr($excerpt, 0, strripos($excerpt, " "));
  $excerpt = trim(preg_replace('/\s+/', ' ', $excerpt));
  $excerpt = $excerpt . '...';
  return $excerpt;
}

function lb_custom_excerpt_length($length) {
  return 20;
}
// add_filter('excerpt_length', 'lb_custom_excerpt_length', 99);

// SVG ICON SYSTEM

/**
 * Gets svg file from pre-defined folder
 * Process the svg for accessibility
 *
 * @param string $icon The slug of the SVG file
 * @param string $title (Optional) Title of SVG file for accessibility. Leave blank for decorative SVG
 * @param string $title_id (Optional) Title ID to reference the description. Leave blank to auto-generate ID
 * @param string $desc (Optional) Description of SVG for accessibility.
 *
 * @return string The processed SVG as HTML
 */

function get_the_svg($icon, $title = '', $title_id = '', $desc = '') {
  if (!file_exists(get_template_directory() . '/assets/icons/' . $icon . '.svg')) {
    return false;
  }

  $icon_folder = get_template_directory_uri() . '/assets/icons/';
  $icon_path = $icon_folder . $icon . '.svg';

  if (strpos(get_site_url(), 'longbeardco.com') !== false) {
    $auth = base64_encode("long:beard");
    $context = stream_context_create([
      "http" => [
        "header" => "Authorization: Basic $auth"
      ]
    ]);
    $svg = file_get_contents($icon_path, false, $context);
  } else {
    $svg = file_get_contents($icon_path);
  }

  if (!$svg) :
    return false;
  endif;

  $svgXml = new SimpleXMLElement($svg);

  if ($title) :
    // generate title_id if not defined
    $title_id = $title_id ?: sanitize_title($title) . '-icon';

    if ($svgXml['aria-hidden'] == 'true') :
      $svgXml['aria-hidden'] = 'false';
    endif;

    // Add accessibility attributes
    $svgXml['aria-labelledby'] = $title_id;
    $svgXml['role'] = 'img';

    $svgXml->title = $title;
    $svgXml->title['id'] = $title_id;

    if ($desc) :
      $svgXml->desc = $desc;
    endif;

    return $svgXml->asXml();

  else :
    // Remove icon from Accessibility API
    $svgXml['aria-hidden'] = 'true';

    // Remove unnecessary aria-labelledby attribute
    if (isset($svgXml['aria-labelledby'])) :
      unset($svgXml['aria-labelledby']);
    endif;

    // Remove unnecessary <title> tag
    if (isset($svgXml->title)) :
      unset($svgXml->title);
    endif;

    // Remove semantic meaning
    $svgXml['role'] = 'presentation';

    return $svgXml->asXml();

  endif;
}

/**
 * Echoes svg file from pre-defined folder
 * Process the svg for accessibility
 *
 * @param string $icon The slug of the SVG file
 * @param string $title (Optional) Title of SVG file for accessibility. Leave blank for decorative SVG
 * @param string $titleId (Optional) Title ID to reference the description. Leave blank to auto-generate ID
 * @param string $desc (Optional) Description of SVG for accessibility.
 *
 * @return void
 */

function the_svg($icon, $title = '', $titleId = '', $desc = '') {
  echo get_the_svg($icon, $title, $titleId, $desc);
}

/**
 * Get absolute path to image file
 *
 * @param string $filename The slug of the SVG file
 *
 * @return string Absolute path to image file
 */
function get_the_theme_image_src($filename) {
  return get_template_directory_uri() . '/assets/images/' . $filename;
}

/**
 * Echoes absolute path to image file
 *
 * @param string $filename The slug of the SVG file
 *
 * @return void
 */
function the_theme_image_src($filename) {
  echo get_the_theme_image_src($filename);
}
