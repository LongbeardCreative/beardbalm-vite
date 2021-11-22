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

<footer id="colophon" class="site-footer">

</footer><!-- #colophon -->
</div><!-- #page -->

<?php wp_footer(); ?>
<?php if (get_field('slick', 'option')) : ?>
  <script type="text/javascript" src="//cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js"></script>
<?php endif; ?>
<?php if (get_field('lightgallery', 'option')) : ?>
  <script src="/wp-content/themes/beardbalm/vendor/lightgallery/js/lightgallery.js"></script>
<?php endif; ?>
<?php if (get_field('lity', 'option')) : ?>
  <link href="/wp-content/themes/beardbalm/vendor/lity/dist/lity.min.css" rel="stylesheet">
  <script src="/wp-content/themes/beardbalm/vendor/lity/dist/lity.min.js"></script>
<?php endif; ?>
<?php if (get_field('aos', 'option')) : ?>
  <script src="https://unpkg.com/aos@next/dist/aos.js"></script>
  <script>
    AOS.init();
  </script>
<?php endif; ?>
<?php if (get_field('instant_page', 'option')) : ?>
  <script src="//instant.page/5.1.0" type="module" integrity="sha384-by67kQnR+pyfy8yWP4kPO12fHKRLHZPfEsiSXR8u2IKcTdxD805MGUXBzVPnkLHw"></script>
<?php endif; ?>
</body>

</html>