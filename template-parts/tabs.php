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
  $subtitle = isset($t['subtitle']) ? $t['subtitle'] : '';
  $icon     = isset($t['icon']) ? $t['icon'] : null;
  $content  = $t['content'];
  $link     = isset($t['link']) ? $t['link'] : null;
  $key      = sanitize_key($title);
  $tabindex = $is_selected ? '0' : '-1';

  if ($link) {
    $link_url = $link['url'];
    $link_target = isset($link['target']) && $link['target'] ? $link['target'] : '_self';
    $link_rel = $link_target == '_blank' ? 'nooopener noreferrer' : '';

    if ($link_url) {
      $tabs .= "<a href='$link_url' class='tab' target='$link_target' rel='$link_rel'>";
      $tabs .= '<span>' . $title . $icon . '</span>';
      $tabs .= $subtitle ? '<small>' . $subtitle . '</small>' : '';
      $tabs .= $link_target == '_blank' ? get_the_svg('external-link') : '';
      $tabs .= '</a>';

      continue;
    }
  }

  $tabs .= "<button id='tab-$key' class='tab $is_tab_active' role='tab' aria-selected='$is_selected' aria-controls='$key' tabindex='$tabindex' >";
  $tabs .= '<span>' . $title . $icon . '</span>';
  $tabs .= $subtitle ? '<small>' . $subtitle . '</small>' : '';
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
    <div class="tabs-wrapper <?php echo $class ? $class . '__tabs-wrapper' : ''; ?>">
      <?php if (!$no_overflow) { ?>
        <div class="overflow-wrapper">
        <?php } ?>
        <div class="tabs <?php echo $class ? $class . '__tabs' : ''; ?>" role="tablist" <?php echo $no_overflow ? 'data-no-overflow' : ''; ?>>
          <?php echo $tabs; ?>
        </div>
        <?php if (!$no_overflow) { ?>
        </div>
      <?php } ?>
    </div>
    <div class="tabpanels <?php echo $class ? $class . '__tabpanels' : ''; ?>">
      <?php echo $tabpanels; ?>
    </div>
  </div>
<?php } ?>