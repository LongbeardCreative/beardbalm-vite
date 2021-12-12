<?php

/**
 * Template name: Homepage
 *
 * Boilerplate template for the homepage.
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

		<section class="container row section-m-t section-m-b">
			<div class="col-xs-12 col-lg-10 col-lg-offset-1">
				<h2>Accordions</h2>
				<?php
				$data = array(
					array(
						'title' => 'Lorem ipsum',
						'body'	=> '<p>Dolor sit amet consectetur adipiscing elit</p>'
					),
					array(
						'title' => 'Dolor sit',
						'body'	=> '<p>Amet consectetur adipiscing elit</p>'
					),
				);
				get_template_part('template-parts/accordions', '', array('data' => $data));
				?>

			</div>
		</section>
		<section class="container row section-m-b">
			<div class="col-xs-12 col-lg-10 col-lg-offset-1">
				<h2>Gravity Forms</h2>
				<?php echo do_shortcode('[gravityform id="2" ajax="true" title="false" description="false"]'); ?>
			</div>
		</section>
		<section class="container row section-m-b">
			<div class="col-xs-12 col-lg-10 col-lg-offset-1">
				<h2>Read More</h2>
				<div data-rm data-rm-xs="0" data-rm-sm="0" data-rm-md="1" data-rm-lg="1">
					<p>Lorem ipsum dolor sit amet</p>
					<p>Consectetur adipiscing elit</p>
				</div>
			</div>
		</section>
		<section class="container row section-m-b">
			<div class="col-xs-12 col-lg-10 col-lg-offset-1">
				<h2>Modal</h2>
				<ul>
					<li>With function call: <button type="button" onclick="modal({ youtube: { videoID: 'HM9r6Q_jFCE' } })">Open Modal</button></li>
					<li>With HTML API: <a href="http://www.youtube.com/watch?v=HM9r6Q_jFCE" data-modal>Open</a></li>
				</ul>
			</div>
		</section>
		<section class="container row section-m-b">
			<div class="col-xs-12 col-lg-10 col-lg-offset-1">
				<h2>Minimal Slider</h2>
				<p class="narrow">This uses very minimal JS for the arrow navigation and CSS <code>scroll-snap</code> feature for easy snapping. The rest is good ol' <code>overflow</code>!</p>
				<div class="slider" data-slider>
					<button class="slider__arrow slider__arrow--prev" data-slider-prev>‹</button>
					<ul class="slider__inner" data-slider-inner>
						<?php for ($i = 0; $i < 10; $i++) { ?>
							<li class="slider__slide">
								<div style="background-color: var(--gray-1); width: 20rem; height: 20rem; padding: 1rem;">Slide <?php echo $i; ?></div>
							</li>
						<?php } ?>
					</ul>
					<button class="slider__arrow slider__arrow--next" data-slider-next>›</button>
				</div>
			</div>
		</section>
	</main><!-- #main -->
</div><!-- #primary -->

<?php
get_footer();
