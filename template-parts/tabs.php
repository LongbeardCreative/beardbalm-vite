<?php

$data    = $args && isset($args['data']) ? $args['data'] : '';
$class   = $args && isset($args['class']) ? $args['class'] : '';

$no_overflow   = $args && isset($args['no_overflow']) ? $args['no_overflow'] : false;

$partial = $args && isset($args['partial']) ? $args['partial'] : false;

$tabs      = '';
$tabpanels = '';

$i = 0;
foreach ($data as $t) {
  $is_selected        = $i == 0;
  $is_tab_active      = $is_selected ? 'tab--active' : '';
  $is_tabpanel_active = $is_selected ? 'tabpanel--active' : '';

  $title    = $t['title'];
  $icon     = isset($t['icon']) ? $t['icon'] : null;
  $content  = $t['content'];
  $key      = sanitize_key($title);
  $tabindex = $is_selected ? '0' : '-1';

  $tabs .= "<button id='tab-$key' class='tab $is_tab_active' role='tab' aria-selected='$is_selected' aria-controls='$key' tabindex='$tabindex' >";
  $tabs .= $icon ?: null;
  $tabs .= '<span>' . $title . '</span>';
  $tabs .= '</button>';

  $tabpanels .= "<div id='$key' class='tabpanel $is_tabpanel_active' role='tabpanel' aria-labelledby='tab-$key' aria-expanded='$is_selected' >";
  $tabpanels .= $content;
  $tabpanels .= '</div>';

  $i++;
}

?>

<?php if ($partial == 'tablist') {
  echo $tabs;
} else if ($partial == 'tabpanels') {
  echo $tabpanels;
} else { ?>
  <div class="lb-tabs <?php echo $class; ?>">
    <div class="tabs <?php echo $class ? $class . '__tabs' : ''; ?>" role="tablist" <?php echo $no_overflow ? 'data-no-overflow' : ''; ?>>
      <?php echo $tabs; ?>
    </div>
    <div class="tabpanels <?php echo $class ? $class . '__tabpanels' : ''; ?>">
      <?php echo $tabpanels; ?>
    </div>
  </div>
<?php } ?>