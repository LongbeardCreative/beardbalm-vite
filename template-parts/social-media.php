<?php
$class = $args && isset($args['class']) ? ' ' . $args['class'] : '';

if (have_rows('social_media_platform', 'option')) {
?>

  <div class="social-list <?php echo $class; ?>">
    <ul>
      <?php while (have_rows('social_media_platform', 'option')) {
        the_row();
        $name = get_sub_field('name');
      ?>
        <li><a href="<?php the_sub_field('link'); ?>" target="_blank" rel="noopener noreferrer" aria-label="Biblicum <?php echo $name; ?>"><?php the_svg($name); ?></a></li>
      <?php } ?>
    </ul>
  </div>

<?php }
