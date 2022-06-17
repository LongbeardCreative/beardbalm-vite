<?php
$class    = $args && isset($args['class']) ? $args['class'] : null;
$contacts = $args && isset($args['contacts']) ? $args['contacts'] : null;
$id       = $args && isset($args['id']) ? $args['id'] : null;

if (!$contacts || empty($contacts)) {
  return;
}

?>
<ul class="contact-info-list">
  <?php
  foreach ($contacts as $contact) {
    $type  = isset($contact['type']) && $contact['type'] ? $contact['type'] : null;
    $link  = isset($contact['link']) ? $contact['link'] : null;
    $title = isset($contact['title']) && $contact['title'] ? $contact['title'] : $link;

    if (!$title && !$link) {
      continue;
    }

    $icon  = '';
    switch ($type) {
      case 'email':
        $icon = get_the_svg('email', 'Email', "email-$id");
        $link = $link !== null ? $link : "mailto:$title";
        break;
      case 'website':
        $icon = get_the_svg('web', 'Website', "website-$id");
        $title = $title !== null ? str_replace(['https://', 'http://'], '', $title) : $link;
        $link = $link !== null ? $link : "//$title";
        break;
      case 'phone':
        $icon = get_the_svg('phone', 'Phone', "phone-$id");
        $link = $link !== null ? $link : phone_to_url($title);
        break;
      case 'address':
        $icon = get_the_svg('location', 'Address', "address-$id");
        break;
      case 'facebook':
        $icon = get_the_svg('facebook', 'Facebook', "facebook-$id");
        break;
        // case 'social':
        //   $icon = get_the_svg('share', 'Social Media', "social-$id");
        //   break;
      default:
        $icon = '';
        break;
    }

    if ($link) {
  ?>
      <li>
        <div class="contact-info contact-info--<?php echo $type; ?>">
          <a href="<?php echo esc_url($link); ?>" target="_blank" rel="noopener noreferrer" class="contact-info__inner">
            <?php if ($icon) { ?>
              <span class="contact-info__icon">
                <?php echo $icon; ?>
              </span>
            <?php } ?>
            <span><?php echo $title; ?></span>
          </a>
        </div>
      </li>
    <?php } else { ?>
      <li>
        <div class="contact-info contact-info--<?php echo $type; ?>">
          <div class="contact-info__inner">
            <?php if ($icon) { ?>
              <div class="contact-info__icon">
                <?php echo $icon; ?>
              </div>
            <?php } ?>
            <span><?php echo $title; ?></span>
          </div>
        </div>
      </li>
    <?php } ?>
  <?php } ?>
</ul>