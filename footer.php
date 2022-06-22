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

<?php if (!is_admin() && !is_admin_bar_showing()) : ?>
  <script src="https://instant.page/5.1.0" type="module" integrity="sha384-by67kQnR+pyfy8yWP4kPO12fHKRLHZPfEsiSXR8u2IKcTdxD805MGUXBzVPnkLHw"></script>
<?php endif; ?>
</body>

</html>