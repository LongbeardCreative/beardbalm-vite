export default function navigation() {
  const html = document.documentElement;
  const container = document.querySelector('#mobile-navigation') as HTMLElement;
  const button = document.querySelector('#mobile-menu-toggle') as HTMLElement;

  if (!container || !button) {
    return;
  }

  const menu = container.querySelector('ul');

  // Hide menu toggle button if menu is empty and return early.
  if (!menu) {
    button.style.display = 'none';
    return;
  }

  if (!menu.classList.contains('nav-menu')) {
    menu.classList.add('nav-menu');
  }

  function openMenu() {
    container.classList.add('toggled');
    button.setAttribute('aria-expanded', 'true');
    html.classList.add('no-scroll');
  }

  function closeMenu() {
    container.classList.remove('toggled');
    button.setAttribute('aria-expanded', 'false');
    html.classList.remove('no-scroll');
  }

  button.onclick = function () {
    if (container.classList.contains('toggled')) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  // Close mobile menu when user clicks outside
  document.addEventListener('click', function (e) {
    const target = e.target as Node;

    if (!target) {
      return;
    }

    var isClickInside = container.contains(target) || button.contains(target);

    if (!isClickInside) {
      closeMenu();
    }
  });

  // Close mobile menu when use presses Escape
  document.body.addEventListener('keyup', function (e) {
    if (e.key === 'Escape') {
      closeMenu();
    }
  });

  function mobileMenuResponsive() {
    if (window.innerWidth > 1024) {
      // html.classList.remove('mobile-menu--active');
      closeMenu();
    } else {
      // html.classList.add('mobile-menu--active');
    }
  }

  window.addEventListener('load', mobileMenuResponsive);
  window.addEventListener('resize', mobileMenuResponsive);
}
