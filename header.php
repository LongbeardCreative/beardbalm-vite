<?php

/**
 * Header Template
 *
 * Default header template. Adapted from Underscores.
 *
 *
 * @package WordPress
 * @subpackage beardbalm
 * @since Beard Balm 1.0.1
 * @author Longbeard
 * @url https://www.longbeard.com/
 */
?>
<!doctype html>
<html <?php language_attributes(); ?>>

<head>
	<meta charset="<?php bloginfo('charset'); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
	<link rel="profile" href="https://gmpg.org/xfn/11">

	<?php wp_head(); ?>
	<?php if (get_field('google_analytics_code', 'option')) {
		$analyticsUA = get_field('google_analytics_code', 'option');
		$analytics = '<!-- Global site tag (gtag.js) - Google Analytics -->
		<script async src="https://www.googletagmanager.com/gtag/js?id=' . $analyticsUA . '"></script>
		<script>
		window.dataLayer = window.dataLayer || [];
		function gtag(){dataLayer.push(arguments);}
		gtag(\'js\', new Date());

		gtag(\'config\', \'' . $analyticsUA . '\', { \'anonymize_ip\': true });
		</script>';

		echo "\n" . $analytics;
	}
	?>
	<?php if (get_field('facebook_pixel_code', 'option')) {
		$pixelID = get_field('facebook_pixel_code', 'option');
		$pixel = '<!-- Facebook Pixel Code -->
		<script>
		!function(f,b,e,v,n,t,s)
		{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
		n.callMethod.apply(n,arguments):n.queue.push(arguments)};
		if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version=\'2.0\';
		n.queue=[];t=b.createElement(e);t.async=!0;
		t.src=v;s=b.getElementsByTagName(e)[0];
		s.parentNode.insertBefore(t,s)}(window, document,\'script\',
		\'https://connect.facebook.net/en_US/fbevents.js\');
		fbq(\'init\', \'' . $pixelID . '\');
		fbq(\'track\', \'PageView\');
		</script>
		<noscript><img height=\'1\' width=\'1\' style=\'display:none\'
		src=\'https://www.facebook.com/tr?id=' . $pixelID . ' &ev=PageView&noscript=1\'
		/></noscript><!-- End Facebook Pixel Code -->';

		echo "\n" . $pixel;
	}
	?>
</head>

<body <?php body_class(); ?>>
	<?php wp_body_open(); ?>
	<div id="page" class="site">
		<a class="skip-link screen-reader-text" href="#content"><?php esc_html_e('Skip to content', 'beardbalm'); ?></a>
		<header id="masthead" class="header">
			<?php if ('' === locate_template('template-parts/header-top.php', true, false))
				include('template-parts/header-top.php'); ?>
			<?php if ('' === locate_template('template-parts/header-bottom.php', true, false))
				include('template-parts/header-bottom.php'); ?>
		</header><!-- #masthead -->

		<div id="content" class="site-content">