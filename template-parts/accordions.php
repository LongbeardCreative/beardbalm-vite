<?php

/**
 * Usage:
 * Pass 'data' as args to get_template_part('template-parts/accordions', '', array( 'data' => $data ));
 * 
 * $data = array(
 *  array(
 *    'title' => 'This is a header' (string)
 *    'body' => '<p>Lorem ipsum dolor sit amet</p>' (HTML string)
 *  ),
 * );
 */

if ($args) :
  $data   = $args && isset($args['data']) ? $args['data'] : '';
  $class  = $args && isset($args['class']) ? ' ' . $args['class'] : '';
endif;

if ($data) :
?>

  <div class="accordions<?php echo $class; ?>">
    <?php
    for ($i = 0; $i < count($data); $i++) :
      $accordion_data = $data[$i];
      get_template_part('template-parts/accordion', '', ['data' => $accordion_data, 'index' => $i]);
    endfor;
    ?>
  </div>

<?php endif; ?>