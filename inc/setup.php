<?php

/**
 * Sets up theme defaults and registers support for various WordPress features.
 */

add_action('after_setup_theme', function () {
  /**
   * Enable post thumbnails
   * @link https://developer.wordpress.org/themes/functionality/featured-images-post-thumbnails/
   */
  add_theme_support('post-thumbnails');

  /**
   * Enable selective refresh for widgets in customizer
   * @link https://developer.wordpress.org/themes/advanced-topics/customizer-api/#theme-support-in-sidebars
   */
  add_theme_support('customize-selective-refresh-widgets');

  /**
   * Let WordPress manage the document title.
   * By adding theme support, we declare that this theme does not use a
   * hard-coded <title> tag in the document head, and expect WordPress to
   * provide it for us.
   * 
   * @link https://developer.wordpress.org/reference/functions/add_theme_support/#title-tag
   */
  add_theme_support('title-tag');

  /**  
   * Add default posts and comments RSS feed links to head. 
   */
  add_theme_support('automatic-feed-links');

  /**
   * Enable HTML5 markup support
   * @link https://developer.wordpress.org/reference/functions/add_theme_support/#html5
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
   * Register navigation menus
   * @link https://developer.wordpress.org/reference/functions/register_nav_menus/
   */
  register_nav_menus(
    array(
      'menu-1' => esc_html__('Primary', 'beardbalm'),
    )
  );
});

/**
 * Register widget area.
 * @link https://developer.wordpress.org/themes/functionality/sidebars/#registering-a-sidebar
 */

add_action('widgets_init', function () {
  $config = array(
    'before_widget' => '<section id="%1$s" class="widget %2$s">',
    'after_widget'  => '</section>',
    'before_title'  => '<h2 class="widget-title">',
    'after_title'   => '</h2>',
  );
  register_sidebar(
    array(
      'name'          => esc_html__('Sidebar', 'beardbalm'),
      'id'            => 'sidebar-1',
      'description'   => esc_html__('Add widgets here.', 'beardbalm'),
    ) + $config
  );
});

/**
 * Init Theme's ACF
 */

add_action('acf/init', function () {
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
});

add_action('wp_enqueue_scripts', function () {
  // Web font
  // Load the webfont.
  wp_enqueue_style(
    'google-fonts',
    wptt_get_webfont_url('https://fonts.googleapis.com/css2?family=Bree+Serif&family=Poppins:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600;1,700&display=swap'),
    array(),
    '1.0'
  );

  // Main Scripts & Styles
  Vite::load('main.ts');

  if (WP_ENVIRONMENT_TYPE == 'development' || WP_ENVIRONMENT_TYPE == 'staging') {
    Vite::load('development.ts', true);
  }

  if (is_singular() && comments_open() && get_option('thread_comments')) {
    wp_enqueue_script('comment-reply');
  }

  if (!is_singular(array('post'))) {
    wp_dequeue_style('wp-block-library');
  }
});

/**
 * Handle jQuery loads
 */

// Dequeue jQuery by default
add_action('wp_enqueue_scripts', function () {
  if (
    !is_admin() &&
    !is_woocommerce_url()
  ) {
    wp_dequeue_script('jquery');
    wp_deregister_script('jquery');
  }
});

// Add global variables
add_action('wp_head', function () {
?>
  <script>
    window.siteData = {
      nonce: '<?php echo wp_create_nonce('lb-nonce'); ?>',
      siteUrl: '<?php echo get_site_url(); ?>',
      ajaxUrl: '<?php echo admin_url('admin-ajax.php'); ?>',
    }
  </script>
<?php
});

// Load jQuery whenever there's Gravity Forms
add_action('gform_enqueue_scripts', function () {
  wp_enqueue_script('jquery', includes_url('/js/jquery/jquery.min.js'));
});

/**
 * Remove the migrate script from the list of jQuery dependencies.
 */
add_action('wp_default_scripts', function (WP_Scripts $scripts) {
  if (!is_admin() && !empty($scripts->registered['jquery'])) {
    $jquery_dependencies = $scripts->registered['jquery']->deps;
    $scripts->registered['jquery']->deps = array_diff($jquery_dependencies, array('jquery-migrate'));
  }
});


/**
 * Change the base path. This is by default WP_CONTENT_DIR.
 * NOTE: Do not include trailing slash.
 */
add_filter('wptt_get_local_fonts_base_path', function ($path) {
  return get_template_directory() . '/src';
});

/**
 * Change the base URL. This is by default the content_url().
 * NOTE: Do not include trailing slash.
 */
add_filter('wptt_get_local_fonts_base_url', function ($url) {
  return get_template_directory_uri() . '/src';
});
