<?php
/**
 * Template part for displaying page content in page.php
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package beardbalm
 */

?>
<header class="page-header">
	<?php the_title( '<h1 class="entry-title">', '</h1>' ); ?>
</header><!-- .page-header -->

<?php beardbalm_post_thumbnail(); ?>

<div class="page-content">
	<?php
	the_content();
	?>
</div><!-- .page-content -->
