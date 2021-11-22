<?php

/**
 * 404 Error Page
 *
 * Default page for 404 errors.
 *
 *
 * @package WordPress
 * @subpackage beardbalm
 * @since Beard Balm 1.0.0
 * @author Longbeard
 * @url https://www.longbeard.com/
 */
get_header();
?>

<div id="primary" class="content-area">
	<main id="main" class="site-main">

		<section class="error-404 not-found container row page-m-t page-m-b">
			<div class="col-xs-12 col-lg-10 col-lg-offset-1">
				<h1 class="page-title title-stars m-b">404 <span style="font-weight:400;opacity:0.5;">&times;</span> <?php esc_html_e('Page Not Found', 'beardbalm'); ?></h1>
				<p><?php esc_html_e('The page you requested cannot be located.', 'beardbalm'); ?></p>
				<a href="<?php echo home_url('/'); ?>" class="button">Return Home</a>
			</div>
		</section>

	</main>
</div>

<?php
get_footer();
