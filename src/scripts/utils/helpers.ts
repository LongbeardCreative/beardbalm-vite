export function unwrap(el: HTMLElement | Element | Node | null) {
  if (!el) {
    return;
  }

  const parent = el.parentNode;
  if (!parent) {
    return;
  }
  while (el.firstChild) {
    parent.insertBefore(el.firstChild, el);
  }
  parent.removeChild(el);
}

export function wrapAll(
  _nodes: HTMLElement[] | Element[] | NodeList,
  wrapper: HTMLElement
) {
  // Remove null
  const nodes = [..._nodes].filter((node) => Boolean(node));

  if (!nodes.length) {
    return wrapper;
  }

  // Cache the current parent and previous sibling of the first node.
  const { parentNode, previousSibling } = nodes[0];

  if (!parentNode) {
    return wrapper;
  }

  // Place each node in wrapper.
  //  - If nodes is an array, we must increment the index we grab from
  //    after each loop.
  //  - If nodes is a NodeList, each node is automatically removed from
  //    the NodeList when it is removed from its parent with appendChild.

  // eslint-disable-next-line no-plusplus
  for (let i = 0; nodes.length - i; wrapper.firstChild === nodes[0] && i++) {
    wrapper.appendChild(nodes[i]);
  }

  // Place the wrapper just after the cached previousSibling,
  // or if that is null, just before the first child.
  const nextSibling = previousSibling
    ? previousSibling.nextSibling
    : parentNode.firstChild;
  parentNode.insertBefore(wrapper, nextSibling);

  return wrapper;
}

/**
 * Format number to USD format
 */
export function formatCurrency(number: number) {
  if (number && !Number.isNaN(number)) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(number);
  }
  return null;
}

// Vanilla JS slide up animation
export function slideUp(target: HTMLElement, duration: number = 250) {
  target.style.transitionProperty = 'height, margin, padding';
  target.style.transitionDuration = `${duration}ms`;
  target.style.boxSizing = 'border-box';
  target.style.height = `${target.offsetHeight}px`;
  setTimeout(() => {
    target.style.overflow = 'hidden';
    target.style.height = '0';
    target.style.paddingTop = '0';
    target.style.paddingBottom = '0';
    target.style.marginTop = '0';
    target.style.marginBottom = '0';
  }, 0);
  setTimeout(() => {
    target.style.display = 'none';
    target.style.removeProperty('height');
    target.style.removeProperty('padding-top');
    target.style.removeProperty('padding-bottom');
    target.style.removeProperty('margin-top');
    target.style.removeProperty('margin-bottom');
    target.style.removeProperty('overflow');
    target.style.removeProperty('transition-duration');
    target.style.removeProperty('transition-property');
  }, duration);
}

// Vanilla JS slide down animation
export function slideDown(target: HTMLElement, duration: number = 250) {
  target.style.removeProperty('display');
  let { display } = window.getComputedStyle(target);
  if (display === 'none') display = 'block';
  target.style.display = display;
  const height = target.offsetHeight;
  target.style.overflow = 'hidden';
  target.style.height = '0px';
  target.style.paddingTop = '0px';
  target.style.paddingBottom = '0px';
  target.style.marginTop = '0px';
  target.style.marginBottom = '0px';
  target.style.boxSizing = 'border-box';
  target.style.transitionProperty = 'height, margin, padding';
  target.style.transitionDuration = `${duration}ms`;
  setTimeout(() => {
    target.style.height = `${height}px`;
    target.style.removeProperty('padding-top');
    target.style.removeProperty('padding-bottom');
    target.style.removeProperty('margin-top');
    target.style.removeProperty('margin-bottom');
  }, 0);
  setTimeout(() => {
    target.style.removeProperty('height');
    target.style.removeProperty('overflow');
    target.style.removeProperty('transition-duration');
    target.style.removeProperty('transition-property');
  }, duration);
}

// Vanilla JS slide toggle animation
export function slideToggle(target: HTMLElement, duration: number = 250) {
  if (window.getComputedStyle(target).display === 'none') {
    return slideDown(target, duration);
  }
  return slideUp(target, duration);
}

// Checks if the user's device has touch screen
export function deviceHasTouchScreen(): boolean {
  let hasTouchScreen = false;
  if (typeof window !== 'undefined') {
    if ('maxTouchPoints' in navigator) {
      hasTouchScreen = navigator.maxTouchPoints > 0;
    } else if ('msMaxTouchPoints' in navigator) {
      // @ts-expect-error
      hasTouchScreen = navigator.msMaxTouchPoints > 0;
    } else {
      const mQ =
        typeof window.matchMedia !== 'undefined' &&
        window.matchMedia('(pointer:coarse)');
      if (mQ && mQ.media === '(pointer:coarse)') {
        hasTouchScreen = !!mQ.matches;
      } else if ('orientation' in window) {
        hasTouchScreen = true; // deprecated, but good fallback
      } else {
        // Only as a last resort, fall back to user agent sniffing
        const UA = navigator.userAgent;
        hasTouchScreen =
          /\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(UA) ||
          /\b(Android|Windows Phone|iPad|iPod)\b/i.test(UA);
      }
    }
  }
  return hasTouchScreen;
}

/**
 * Efficiently removes children of a parent element
 */
export function removeChildren(el: HTMLElement) {
  while (el.firstChild) {
    if (el.lastChild) {
      el.removeChild(el.lastChild);
    }
  }
}

// Check if an element is visible
export function isVisible(el: HTMLElement): boolean {
  return (
    !!el && !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length)
  );
}

// Removes 'active' class on an element on clicking outside of it
export function hideOnClickOutside(
  element: HTMLElement,
  wrapper?: HTMLElement,
  callback?: () => void
) {
  let elWrapper = wrapper;

  if (!elWrapper) {
    elWrapper = element;
  }

  const outsideClickListener = (event: MouseEvent) => {
    if (!elWrapper) {
      return;
    }

    if (
      !elWrapper.contains(event.target as HTMLElement) &&
      isVisible(elWrapper)
    ) {
      // or use: event.target.closest(selector) === null
      // element.style.display = "none";
      element.classList.remove('active');
      if (typeof callback === 'function') {
        callback();
      }
      removeClickListener(); // eslint-disable-line no-use-before-define
    }
  };

  const removeClickListener = () => {
    document.removeEventListener('click', outsideClickListener);
  };

  document.addEventListener('click', outsideClickListener);
}
