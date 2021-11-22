<?php
$link = '';
$title = '';
if (is_single()) :
  $link = get_permalink();
  $title = get_the_title();
elseif (is_tax()) :
  $link = get_term_link(get_queried_object());
  $title = get_queried_object()->name;
endif;

$subject = "From Website – $title";
?>

<div class="social-share">
  <span class="social-share__label">Share:</span>
  <ul>
    <li><a href="https://www.facebook.com/sharer/sharer.php?u=<?php echo $link; ?>" target="_blank" rel="noopener noreferrer"><?php the_svg('facebook', 'Share on Facebook'); ?></a></li>
    <li><a href="http://twitter.com/share?text=<?php echo $title; ?>&url=<?php echo $link; ?>" target="_blank" rel="noopener noreferrer"><?php the_svg('twitter', 'Share on Twitter'); ?></a></li>
    <li><a href="https://www.linkedin.com/shareArticle?mini=true&url=<?php echo $link; ?>" target="_blank" rel="noopener noreferrer"><?php the_svg('linkedin', 'Share on LinkedIn'); ?></a></li>
    <li><a href="mailto:?subject=<?php echo $subject; ?>&body=<?php echo $link; ?>" target="_blank" rel="noopener noreferrer"><?php the_svg('email', 'Share via Email'); ?></a></li>
  </ul>
</div>