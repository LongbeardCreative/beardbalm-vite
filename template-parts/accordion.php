<?php
$data = $args && isset($args['data']) ? $args['data'] : null;
$index = $args && isset($args['index']) ? $args['index'] : '0';

if ($data) :
  $title = isset($data['title']) ? $data['title'] : null;
  $body = isset($data['body']) ? $data['body'] : null;

  if ($title && $body) :
    $id = sanitize_title(substr($title, 0, 5)) . '-' . $index;
    $controls = 'content-' . $id;
?>
    <div class="accordion">
      <button type="button" class="accordion__head" aria-controls="<?php echo $controls; ?>" aria-expanded="false">
        <span class="accordion__title"><?php echo $title; ?></span>
        <div class="accordion__plus-minus"></div>
      </button>
      <div id="<?php echo $controls; ?>" class="accordion__body" aria-labelledby="<?php echo $id; ?>">
        <div class="accordion__body__inner">
          <?php echo $body; ?>
        </div>
      </div>
    </div>
<?php
  endif;
endif;
?>