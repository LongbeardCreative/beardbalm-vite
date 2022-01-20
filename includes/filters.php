<?php

/**
 * Prevent WordPress from scaling extremely large images
 * Large images often used as background on VO's website
 */
add_filter('big_image_size_threshold', function (int $threshold): mixed {
  $current_user = wp_get_current_user();
  $allowed_users = array('kevin-lb', 'patrick-lb', 'lbadmin');

  if (is_user_logged_in() && (in_array($current_user->user_login, $allowed_users))) {
    return false;
  } else {
    return $threshold;
  }
});

/**
 * Body Class
 */

add_filter('body_class', function (array $classes): array {
  // Add page slug
  if (is_single() || is_page() && !is_front_page()) {
    if (!in_array(basename(get_permalink()), $classes)) {
      $classes[] = basename(get_permalink());
    }
  }

  return $classes;
});


/**
 * Filters WordPress' get_search_form()
 * @link https://developer.wordpress.org/reference/functions/get_search_form/
 */

function lb_search_form(string $form): string {
  $form = '<form role="search" method="get" id="searchform" class="searchform" action="' . home_url('/') . '" >
    <div><label class="screen-reader-text" for="s">' . __('Search for:') . '</label>
    <input type="search" value="" placeholder="Search..." name="s" id="s" />
    <button class="button" type="submit" id="searchsubmit" value="Search">Search</button>
    </div>
  </form>';

  return $form;
}
add_filter('get_search_form', 'lb_search_form');

/**
 * Custom excerpt length
 */
// add_filter('excerpt_length', function () {
//   return 20;
// });
