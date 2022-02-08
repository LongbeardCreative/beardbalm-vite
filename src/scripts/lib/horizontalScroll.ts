import { wrapAll } from '../utils/helpers';

function scrollOverflow(el: HTMLElement) {
  const wrap = el.closest('.overflow-wrapper');
  if (!wrap) {
    return;
  }

  if (el.scrollWidth > el.clientWidth) {
    // your element have overflow
    wrap.classList.add('overflow--x');

    if (el.scrollLeft > 0) {
      wrap.classList.add('overflow--left');
    } else {
      wrap.classList.remove('overflow--left');
    }

    if (el.scrollLeft < el.scrollWidth - el.offsetWidth - 10) {
      wrap.classList.add('overflow--right');
    } else {
      wrap.classList.remove('overflow--right');
    }
  } else {
    // your element doesn't have overflow
    wrap.classList.remove('overflow--x');
  }
}

export default function horizontalScroll(selector: string) {
  const elements = document.querySelectorAll(selector);

  if (!elements.length) {
    return;
  }

  elements.forEach((el) => {
    if (el.hasAttribute('data-no-overflow')) {
      return;
    }

    if (!el.closest('.overflow-wrapper')) {
      const div = document.createElement('div');
      div.classList.add('overflow-wrapper');
      wrapAll([el], div);
    }
    if (!el.classList.contains('overflow-ready')) {
      el.classList.add('overflow-ready--x');
    }
    scrollOverflow(el as HTMLElement);

    el.addEventListener('scroll', (e) =>
      scrollOverflow(e.currentTarget as HTMLElement)
    );
  });

  window.addEventListener('resize', () => {
    setTimeout(() => {
      elements.forEach((el) => scrollOverflow(el as HTMLElement));
    }, 500);
  });
}
