<?php

/**
 * Phone to URL helper
 * 
 * @param string $number Phone number
 * 
 * @return string Phone URL
 */
function phone_to_url($number) {
  if (!$number) return false;
  $number = preg_replace('/(extension|x|#|-|code|ext)[.]/', ',', $number);
  $number = preg_replace('/\s+/', '', $number);
  $href = 'tel:' . preg_replace('/[^0-9+-,]/', '', $number);
  return $href;
}

/**
 * Loads a template into a variable
 * 
 * @param string $slug The slug name for the generic template.
 * @param string $name (Optional) The name of the specialised template.
 * @param array $args (Optional) Additional arguments passed to the template.
 * 
 * @return string Content from the template
 */
function load_template_part($template_name, $part_name = null, $args) {
  ob_start();
  get_template_part($template_name, $part_name, $args);
  $var = ob_get_contents();
  ob_end_clean();
  return $var;
}

/**
 * Prevent WordPress from scaling extremely large images
 * Large images often used as background on VO's website
 */
function lb_big_image_size_threshold($threshold) {
  $current_user = wp_get_current_user();

  if (is_user_logged_in() && ($current_user->user_login === 'kevin-lb' || $current_user->user_login === 'patrick-lb' || $current_user->user_login === 'lbadmin')) {
    return false;
  } else {
    return $threshold;
  }
}
add_filter('big_image_size_threshold', 'lb_big_image_size_threshold');

/**
 * Checks for the presence of WooCommerce in a page
 */
function is_woocommerce_url() {
  if (class_exists('woocommerce')) {
    if (is_woocommerce() || is_cart() || is_checkout() || is_account_page() || is_wc_endpoint_url()) {
      return true;
    }
  }

  return false;
}

/**
 * Body Class
 */

// function lb_body_classes($classes) {
//   if (is_date()) {
//     $classes[] = 'page-template-media';
//   }

//   return $classes;
// }
// add_filter('body_class', 'lb_body_classes');