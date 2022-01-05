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
