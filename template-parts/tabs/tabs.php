<?php

$data    = $args && isset($args['data']) ? $args['data'] : '';
$class   = $args && isset($args['class']) ? $args['class'] : '';

$partial = $args && isset($args['partial']) ? $args['partial'] : false;

$tabs      = '';
$tabpanels = '';

$i = 0;
foreach ($data as $t) {
  $is_selected        = $i == 0;
  $is_tab_active      = $is_selected ? 'tab--active' : '';
  $is_tabpanel_active = $is_selected ? 'tabpanel--active' : '';

  $title    = $t['title'];
  $content  = $t['content'];
  $key      = sanitize_key($title);
  $tabindex = $is_selected ? '0' : '-1';

  $tabs .= "<button id='tab-$key' class='tab $is_tab_active' role='tab' aria-selected='$is_selected' aria-controls='$key' tabindex='$tabindex' >";
  $tabs .= $title;
  $tabs .= '</button>';

  $tabpanels .= "<div id='$key' class='tabpanel $is_tabpanel_active' role='tabpanel' aria-labelledby='tab-$key' aria-expanded='$is_selected' tabindex='0' >";
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
    <div class="tabs" role="tablist">
      <?php echo $tabs; ?>
    </div>
    <div class="tabpanels">
      <?php echo $tabpanels; ?>
    </div>
  </div>
<?php } ?>