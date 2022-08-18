<?php

/**
 * Search Results template.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#search-result
 *
 * @package WordPress
 * @subpackage beardbalm
 * @since Beard Balm 1.0.0
 * @author Longbeard
 * @url https://www.longbeard.com/
 */

get_header();
?>

<div class="container mt-page mb-section">
	<div class="row">
		<div class="col-xs-12 col-md-7 col-lg-6 col-lg-offset-1">
			<div id="primary" class="content-area">
				<main id="main" class="site-main">
					<h1 class="h3 page-title">
						<?php
						/* translators: %s: search query. */
						printf(esc_html__('Search Results for: %s', 'beardbalm'), '<span>' . get_search_query() . '</span>');
						?>
					</h1>
					<div class="search-results content-m-t">
						<?php if (have_posts()) { ?>
							<div class="posts-grid">
								<div class="posts-grid__inner">
									<?php while (have_posts()) {
										the_post();

										echo '<div class="posts-grid__item">';
										get_template_part('template-parts/post-entry', '', array(
											'show_thumbnail' => false,
											'show_icon' => false,
											'show_excerpt' => true,
											'style' => 'small',
										));
										echo '</div>';
									} ?>
								</div>
							</div>
							<?php
							global $wp_query;
							get_template_part('template-parts/pagination', '', array(
								'query'          => $wp_query,
								'show_results'   => true,
							));
							?>
						<?php } else { ?>
							<div class="text-block narrow">
								<p>No results match your search. Please try being less specific or using a different keyword.</p>
							</div>
						<?php } ?>
					</div>
				</main><!-- #main -->
			</div><!-- #primary -->
		</div>
		<div class="col-xs-12 col-md-4 col-md-offset-1 col-lg-3 col-lg-offset-1">
			<?php get_sidebar(null, array(
				'search_placeholder' => 'Search Site',
				'search_url' => home_url(),
				'search_name' => 's',
				'show_recent' => false,
			)); ?>
		</div>
	</div>
</div>

<?php
get_sidebar();
get_footer();
