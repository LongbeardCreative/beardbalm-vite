<?php
$class = $args && isset($args['class']) ? ' ' . $args['class'] : '';

if (have_rows('social_media_platform', 'option')) {
?>

  <ul class="social-media<?php echo $class; ?>">
    <?php while (have_rows('social_media_platform', 'option')) {
      the_row();
      $name = get_sub_field('name');
    ?>
      <li><a href="<?php the_sub_field('link'); ?>" target="_blank" rel="noopener noreferrer" aria-label="Duc in Altum <?php echo $name; ?>"><?php the_svg($name); ?></a></li>
    <?php } ?>
  </ul>

<?php }
