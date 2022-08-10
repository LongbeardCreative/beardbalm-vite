<?php

/**
 * Footer Template
 *
 * Default footer template. Everything after <div id="content">. Adapted from Underscores.
 *
 * @package WordPress
 * @subpackage beardbalm
 * @since Beard Balm 1.0.0
 * @author Longbeard
 * @url https://www.longbeard.com/
 */

?>

</div><!-- #content -->

<footer id="footer" class="footer">
  <?php if ('' === locate_template('template-parts/footer/footer-top.php', true, false))
    include('template-parts/footer/footer-top.php'); ?>
  <?php if ('' === locate_template('template-parts/footer/footer-bottom.php', true, false))
    include('template-parts/footer/footer-bottom.php'); ?>
</footer>
</div><!-- #page -->

<?php wp_footer(); ?>

</body>

</html>