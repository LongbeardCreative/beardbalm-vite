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
          <div class="hide-xs show-md">
            <?php wp_nav_menu([
              'theme_location' => 'menu-primary',
              'menu_id'        => 'primary-menu',
              'menu_class'     => 'header__menu menu hide-xs show-md--flex',
              'link_before'    => '<span>',
              'link_after'     => '</span>',
            ]); ?>
          </div>
          <div id="site-search" class="header__search" data-js="header-search">
            <button class="header__search__toggle" data-js="header-search-toggle">
              <?php the_svg('search'); ?>
              <span class="header__search__label screen-reader-text"><?php _e('Search', 'beardbalm'); ?></span>
            </button>
            <div class="header__search__box container" data-js="header-search-box">
              <div class="header__search__box__inner">
                <?php get_template_part('template-parts/search-form', '', []); ?>
                <div class="header__search__results" data-js="header-search-results"></div>
              </div>
            </div>
          </div>
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