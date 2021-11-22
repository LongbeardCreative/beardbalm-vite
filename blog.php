<?php
/**
 * Template name: Blog Template
 *
 * Default template for category archives.
 *
 *
 * @package WordPress
 * @subpackage beardbalm
 * @since Beard Balm 1.0.1
 * @author Longbeard
 * @url https://www.longbeard.com/
 */
get_header();
?>

<div class="row">
	<div class="col-xs-12 col-sm-6 col-md-5 col-lg-offset-1">
	<div id="primary" class="content-area">
		<main id="main" class="site-main">

		<?php 
		$paged = ( get_query_var( 'paged' ) ) ? get_query_var( 'paged' ) : 1;
		$args = array(
			'posts_per_page' => 5,
			'paged' => $paged
		);
		query_posts($args);
		
		if ( have_posts() ) : ?>

				<header class="page-header">
					<h1>Blog</h1>
				</header><!-- .page-header -->

			<?php
			/* Start the Loop */
			while ( have_posts() ) :
				the_post();

				/*
				 * Include the Post-Type-specific template for the content.
				 * If you want to override this in a child theme, then include a file
				 * called content-___.php (where ___ is the Post Type name) and that will be used instead.
				 */
				get_template_part( 'template-parts/content', get_post_type() );

			endwhile;
?><div class="pagination">
<?php  previous_posts_link(); next_posts_link(); 
 ?>
 </div>
	<?php	else :

			get_template_part( 'template-parts/content', 'none' );
		
		endif; ?>

		</main><!-- #main -->
	</div><!-- #primary -->
		</div> <!-- /col -->

<div class="col-xs-12 col-sm-5 col-md-4 col-lg-3 col-sm-offset-1 col-md-offset-2">
<?php get_sidebar(); ?>
</div> <!-- /row -->
<?php get_footer();
