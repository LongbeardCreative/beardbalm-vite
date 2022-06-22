<?php
$id = $args && isset($args['id']) ? $args['id'] : 'searchform';
$class = $args && isset($args['class']) ? $args['class'] : '';
$method = $args && isset($args['method']) ? $args['method'] : 'GET';
$action = $args && isset($args['action']) ? $args['action'] : home_url('/');
$target = $args && isset($args['target']) ? $args['target'] : '_self';
$name = $args && isset($args['name']) ? $args['name'] : 's';
$placeholder = $args && isset($args['placeholder']) ? $args['placeholder'] : 'Search';
$value = $args && isset($args['value']) ? $args['value'] : (isset($_GET[$name]) ? $_GET[$name] : '');
$after = $args && isset($args['after']) ? $args['after'] : '';
?>

<form role="search" method="<?php echo $method; ?>" id="<?php echo $id; ?>" class="searchform <?php echo $class; ?>" action="<?php echo $action; ?>" target="<?php echo $target; ?>">
  <div class="searchform__inner">
    <label class="screen-reader-text" for="<?php echo $name; ?>"><?php _e('Search for:'); ?></label>
    <input type="search" value="<?php echo $value; ?>" placeholder="<?php echo $placeholder; ?>" name="<?php echo $name; ?>" id="<?php echo $id; ?>-input" />
    <?php echo $after; ?>
    <button type="submit" id="<?php echo $id; ?>-submit" aria-label="Search"><?php the_svg('search'); ?></button>
  </div>
</form>