<div class="header__top">
  <div class="container row">
    <div class="col-xs-12 col-lg-10 col-lg-offset-1">
      <div class="header__top__inner">
        <div class="site-branding">
          <a href="<?php echo esc_url(home_url('/')); ?>" rel="home">
            <?php
            $logo = get_field('header_logo', 'option');
            $size = 'full';
            if ($logo) {
              echo wp_get_attachment_image($logo, $size);
            }
            ?></a>
        </div>
        <nav id="site-navigation" class="header__nav main-navigation end-xs middle-xs">
          <?php wp_nav_menu([
            'theme_location' => 'menu-1',
            'menu_id'        => 'primary-menu',
            'menu_class'     => 'header__menu menu hide-xs show-md--flex',
            'link_before'    => '<span>',
            'link_after'     => '</span>',
          ]); ?>
          <!-- <div id="site-search" class="header__search xs-hide md-show">
            <button id="site-search-trigger" class="header__search__button menu-item">
              <?php the_svg('search'); ?>
              <span class="header__search__label"><?php _e('Search', 'beardbalm'); ?></span>
            </button>
            <div id="site-search-box" class="header__search-box">
              <?php get_search_form(); ?>
              <div id="site-search-results" class="header__search-box__results"></div>
            </div>
          </div> -->
          <button id="mobile-menu-toggle" class="menu-toggle show-xs--flex hide-md" aria-controls="primary-menu" aria-expanded="false">
            <span class="menu-toggle__label menu-toggle__label--close" style="display:none;"><?php esc_html_e('Close', 'beardbalm'); ?></span>
            <span class="menu-hamburger">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </span>
            <span class="menu-toggle__label menu-toggle__label--menu"><?php esc_html_e('Menu', 'beardbalm'); ?></span>
          </button>
        </nav>
      </div>
    </div>
  </div>
</div>