export default function smoothScroll() {
  function handleClick(e: Event) {
    const currentTarget = e.currentTarget as HTMLAnchorElement;
    if (
      location.pathname.replace(/^\//, '') ===
        currentTarget.pathname.replace(/^\//, '') &&
      location.hostname == currentTarget.hostname
    ) {
      // Figure out element to scroll to
      const { hash } = currentTarget;
      let target =
        (document.querySelector(hash) as HTMLElement) ||
        (document.querySelector(`[name=${hash.slice(1)}]`) as HTMLElement);
      // Does a scroll target exist?
      if (target) {
        // Only prevent default if animation is actually gonna happen
        e.preventDefault();
        const scrollTop =
          target.getAttribute('role') === 'tabpanel'
            ? (target.parentNode as HTMLElement)?.offsetTop
            : target.offsetTop;
        window.scrollTo({
          top: scrollTop,
          behavior: 'smooth',
        });
        target.focus();
      }
      if (window.location.hash === hash) {
        window.dispatchEvent(new Event('hashchange'));
      } else {
        window.location.hash = hash;
      }
    }
  }

  const links = document.querySelectorAll('a[href*="#"][data-smooth-scroll]');
  links.forEach((link) => {
    link.addEventListener('click', handleClick);
  });
}
