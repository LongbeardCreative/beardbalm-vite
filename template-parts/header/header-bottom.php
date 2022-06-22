<nav id="mobile-navigation" class="header__nav-mobile container md-hide">

    <!-- <div class="header__search header__search--mobile">
        <?php // echo lb_get_search_form('mobile-searchform'); 
        ?>
        <div class="header__search-box header__search-box--mobile active">
            <div class="header__search-box__results header__search-box__results--mobile"></div>
        </div>
    </div> -->

    <?php
    wp_nav_menu([
        'theme_location' => 'menu-primary',
        'menu_id'        => 'primary-menu-mobile',
        'menu_class'     => 'header__nav-mobile__menu menu',
        'link_before'    => '<span>',
        'link_after'     => '</span>',
    ]);
    ?>

    <div class="header__social--mobile">
        <?php get_template_part('template-parts/social-media'); ?>
    </div>
</nav>