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

  function handleClickOutside(e: MouseEvent) {
    const target = e.target as Node;

    if (!target) {
      return;
    }

    const isClickInside = container.contains(target) || button.contains(target);

    if (!isClickInside) {
      closeMenu();
    }
  }

  function handleKeyPress(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      closeMenu();
    }
  }

  function openMenu() {
    container.classList.add('toggled');
    button.setAttribute('aria-expanded', 'true');
    html.classList.add('no-scroll');

    document.addEventListener('click', handleClickOutside);
    document.body.addEventListener('keyup', handleKeyPress);
  }

  function closeMenu() {
    container.classList.remove('toggled');
    button.setAttribute('aria-expanded', 'false');
    html.classList.remove('no-scroll');

    document.removeEventListener('click', handleClickOutside);
    document.body.removeEventListener('keyup', handleKeyPress);
  }

  button.onclick = function () {
    if (container.classList.contains('toggled')) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  function mobileMenuResponsive() {
    if (window.innerWidth > 1024) {
      // html.classList.remove('mobile-menu--active');
      closeMenu();
    } else {
      // html.classList.add('mobile-menu--active');
    }
  }

  if (typeof window !== 'undefined') {
    mobileMenuResponsive();
  }

  window.addEventListener('load', mobileMenuResponsive);
  window.addEventListener('resize', mobileMenuResponsive);
}
