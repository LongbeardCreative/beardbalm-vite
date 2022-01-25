<?php

function file_get_contents_ssl(string $url) {
  $ch = curl_init();
  curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
  curl_setopt($ch, CURLOPT_HEADER, false);
  curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
  curl_setopt($ch, CURLOPT_URL, $url);
  curl_setopt($ch, CURLOPT_REFERER, $url);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
  curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 3000); // 3 sec.
  curl_setopt($ch, CURLOPT_TIMEOUT, 10000); // 10 sec.
  $data = curl_exec($ch);
  curl_close($ch);

  return $data;
}


/**
 * Phone to URL helper
 */
function phone_to_url(string $number): string {
  if (!$number) return false;
  $number = preg_replace('/(extension|x|#|-|code|ext)[.]/', ',', $number);
  $number = preg_replace('/\s+/', '', $number);
  $href = 'tel:' . preg_replace('/[^0-9+-,]/', '', $number);
  return $href;
}

/**
 * Loads a template into a variable
 */
function load_template_part(string $template_name, ?string $name = null, ?array $args = array()): string {
  ob_start();
  get_template_part($template_name, $name, $args);
  $var = ob_get_contents();
  ob_end_clean();
  return $var;
}

/**
 * Checks for the presence of WooCommerce in a page
 */
function is_woocommerce_url(): bool {
  if (class_exists('woocommerce')) {
    if (is_woocommerce() || is_cart() || is_checkout() || is_account_page() || is_wc_endpoint_url()) {
      return true;
    }
  }

  return false;
}

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
  if (!file_exists(get_template_directory() . '/src/assets/icons/' . $icon . '.svg')) {
    return false;
  }

  $icon_folder = get_template_directory_uri() . '/src/assets/icons/';
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
    $svg = file_get_contents_ssl($icon_path);
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
  return get_template_directory_uri() . '/src/assets/images/' . $filename;
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

/**
 * Get custom excerpt from Post Content
 */

function lb_get_excerpt(int $length): string {
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
