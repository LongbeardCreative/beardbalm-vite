function handleClick(e: Event) {
  const currentTarget = e.currentTarget as HTMLAnchorElement;
  const isSameUrl =
    window.location.pathname.replace(/^\//, '') ===
      currentTarget.pathname.replace(/^\//, '') &&
    window.location.hostname === currentTarget.hostname;

  if (!isSameUrl) {
    return;
  }

  // Figure out element to scroll to
  const { hash } = currentTarget;

  // Target can have the specified ID or name attribute
  const target =
    (document.querySelector(hash) as HTMLElement) ||
    (document.querySelector(`[name=${hash.slice(1)}]`) as HTMLElement);

  // Check if target exists
  if (!target) {
    return;
  }

  // Only prevent default if animation is happening
  e.preventDefault();

  // Get 'top' position of the target
  const targetTop =
    target.style.display === 'none'
      ? (target.parentNode as HTMLElement)?.offsetTop || target.offsetTop
      : target.offsetTop;

  // Smooth scroll window
  window.scrollTo({
    top: targetTop,
    behavior: 'smooth',
  });

  // Focus on target
  target.focus();

  if (window.location.hash === hash) {
    window.dispatchEvent(new Event('hashchange'));
  } else {
    window.location.hash = hash;
  }
}

export default function smoothScroll(
  selector: string = '[data-smooth-scroll]'
) {
  const links = document.querySelectorAll(`a[href*="#"]${selector}`);
  links.forEach((link) => {
    link.addEventListener('click', handleClick);
  });
}
