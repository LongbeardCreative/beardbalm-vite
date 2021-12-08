import {
  deviceHasTouchScreen,
  slideDown,
  slideToggle,
  slideUp,
  unwrap,
  wrapAll,
} from './helpers';
import { initNavigation } from './navigation';
// import { $, jQuery } from 'jquery';

// const $ = windnpmow.jQuery.noConflict();

export {};

// Initialize functions
document.addEventListener('DOMContentLoaded', () => {
  console.log('JMJ');
  initNavigation();
  accessibility();
  smoothScroll();
  accordions();
  tabs();
  readMoreInit();
  // horizontalScroll('.lb-tabs .tabs');
  // slickSlider('.some-slider');
  // aosIE();
});

// Initialize Gravity Forms functions
// $(document).bind('gform_post_render', function () {
//   // Gravity Forms JS
// });

/** *******************
DECLARED FUNCTIONS
******************** */

/**
 * Sets up accessibility listeners
 */
function accessibility() {
  // Remove focus from links
  document.body.classList.add('is-mouse');

  // Listen to tab events to enable outlines (accessibility improvement)
  document.body.addEventListener('keyup', (e) => {
    if (e.key === 'Tab') {
      document.body.classList.remove('is-mouse');
    }
  });

  // Let the document know when the mouse is being used
  document.body.addEventListener('mousedown', () => {
    document.body.classList.add('is-mouse');
  });

  // Check if this is touch device
  if (deviceHasTouchScreen()) {
    document.body.classList.add('is-touch-device');
  } else {
    document.body.classList.add('not-touch-device');
  }
}

// function slickSlider(slider) {
//   $(window).on('load resize orientationchange', () => {
//     $(slider).each(function () {
//       const $carousel = $(this);
//       /* Initializes a slick carousel only on mobile screens */
//       // slick on mobile
//       if ($(window).width() > 1025) {
//         if ($carousel.hasClass('slick-initialized')) {
//           $carousel.slick('unslick');
//         }
//       } else if (!$carousel.hasClass('slick-initialized')) {
//         $carousel.slick({
//           infinite: true,
//           speed: 400,
//           autoplay: false,
//           dots: false,
//           slidesToShow: 2,
//           slidesToScroll: 1,
//           prevArrow: '<div class="slick-arrow slick-prev">Prev</div>', // replace arrows
//           nextArrow: '<div class="slick-arrow slick-next">Next></div>', // replace arrows
//           responsive: [
//             {
//               breakpoint: 601,
//               settings: 'unslick',
//             },
//           ],
//         });
//       }
//     });
//   });
// }

/**
 * Initialize Smooth Scroll
 */
function smoothScroll() {
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

/**
 * Initialize Tabs
 */
function tabs() {
  const tabContainers = document.querySelectorAll('.lb-tabs'); // tabs container class
  const activeClass = 'active';

  tabContainers.forEach(function (container) {
    const tablist = container.querySelector('[role="tablist"]'); // Select the first one to avoid subtabs

    if (!tablist) {
      return;
    }

    let tabs = container.querySelectorAll('[role="tab"]');
    let tabPanels = container.querySelectorAll('[role="tabpanel"]');
    let useHash = false;
    const useHashAttr = container.getAttribute('data-use-hash');
    if (typeof useHashAttr !== typeof undefined && useHashAttr !== 'false') {
      useHash = true;
    }

    function isSameTabParent(el: Element) {
      return el.closest('.lb-tabs') === container;
    }

    function setActiveTab(id: string, focus: boolean = true) {
      tabs.forEach(function (tab) {
        if (tab.getAttribute('aria-controls') === id) {
          tab.classList.add(activeClass);
          tab.setAttribute('aria-selected', 'true');
          if (focus) {
            (tab as HTMLElement).focus();
          }
        } else {
          tab.classList.remove(activeClass);
          tab.setAttribute('aria-selected', 'false');
          (tab as HTMLElement).blur();
        }
      });

      tabPanels.forEach(function (tabPanel) {
        if (tabPanel.getAttribute('id') === id) {
          tabPanel.classList.add(activeClass);
          tabPanel.setAttribute('aria-expanded', 'true');
        } else {
          tabPanel.classList.remove(activeClass);
          tabPanel.setAttribute('aria-expanded', 'false');
        }
      });

      // EDGE Case where there are subtab
      // 1. Check if this has subtabs
      // 2. Show Subtabs
      // const subtabs = $(`#${id}`).closest('.lb-tabs').find('.subtabs');
      // if (subtabs.length) {
      //   subtabs.each(function () {
      //     if ($(this).attr('aria-labelledby') === `tab-${id}`) {
      //       $(this).addClass('active');
      //       $(this).attr('aria-expanded', true);
      //     } else {
      //       $(this).removeClass('active');
      //       $(this).attr('aria-expanded', false);
      //     }
      //   });
      // }

      // Dispatch Event
      const event = new Event('changeTab');
      window.dispatchEvent(event);
    }

    function handleTabClick(e: Event) {
      e.preventDefault();

      const currentTarget = e.currentTarget as HTMLElement;

      if (!currentTarget) {
        return;
      }

      // 1. Remove pre-selected default tabs classes
      [...tabs, ...tabPanels].forEach((el) => {
        if (el.classList.contains('tab-default')) {
          el.classList.remove('tab-default');
        }
      });

      // 2. Set active tab
      const ariaControls = currentTarget.getAttribute('aria-controls');
      if (ariaControls && !currentTarget.classList.contains(activeClass)) {
        setActiveTab(ariaControls);
      }

      // 3. Update URL (if required)
      // if (useHash) {
      //   history.replaceState({}, '', currentTarget.getAttribute("href"));
      // }

      // 4. Slide clicked tab into view
      if (!currentTarget.classList.contains('slick-slide')) {
        // slide to view
        const buffer = 50; // gradient
        const thisContainer = currentTarget.closest('.tabs');
        const frame = thisContainer?.closest('.overflow-wrapper');

        if (!thisContainer || !frame) {
          return;
        }

        let offset;

        if (
          currentTarget.offsetLeft <= buffer ||
          currentTarget.offsetLeft + currentTarget.clientWidth >=
            frame.clientWidth - buffer
        ) {
          if (currentTarget.offsetLeft > frame.clientWidth / 2) {
            // scroll to right
            offset =
              thisContainer.scrollLeft +
              (currentTarget.offsetLeft -
                thisContainer.clientWidth +
                currentTarget.clientWidth +
                50);
          } else {
            // scroll to left
            offset = thisContainer.scrollLeft + (currentTarget.offsetLeft - 50);
          }
        }

        thisContainer.scroll({
          left: offset,
          behavior: 'smooth',
        });
      }
    }

    function handleKeyboardNavigation(e: KeyboardEvent) {
      // 1. Get active tab
      const activeTab = [...tabs].find((tab) => {
        return tab.classList.contains(activeClass);
      });

      switch (e.key) {
        case 'ArrowLeft': // left arrow
        case 'ArrowUp': // up arrow
          e.preventDefault();
          const prev = activeTab?.previousElementSibling
            ? activeTab?.previousElementSibling.getAttribute('aria-controls')
            : tabs[tabs.length - 1].getAttribute('aria-controls');
          if (prev) {
            setActiveTab(prev);
          }
          break;
        case 'ArrowRight': // right arrow
        case 'ArrowDown': // down arrow
          e.preventDefault();
          const next = activeTab?.nextElementSibling
            ? activeTab?.nextElementSibling.getAttribute('aria-controls')
            : tabs[0].getAttribute('aria-controls');
          if (next) {
            setActiveTab(next);
          }
          break;
      }
    }

    // 1. Filter tabs to exclude sub tabs / parent tabs
    tabs = [...tabs]
      .filter(isSameTabParent)
      .filter((tab) => !tab.id.includes('slick'));
    tabPanels = [...tabPanels].filter(isSameTabParent);

    // 2. Defaults - activate the first tab
    // 1. Check if default tab should be specified by the URL
    let targetTabID;
    const urlParams = new URLSearchParams(window.location.search);
    const urlParamsTab = urlParams.get('tab');
    if (window.location.hash) {
      const hash = window.location.hash.substring(1);

      if ([...tabs].some((t) => t.getAttribute('aria-controls') === hash)) {
        targetTabID = hash;
        setActiveTab(targetTabID, false);
        // setTimeout(() => {
        //   document.getElementById(hash).closest("section").scrollIntoView();
        // }, 50);
      }
    } else if (
      urlParamsTab &&
      [...tabs].some((t) => t.getAttribute('aria-controls') === urlParamsTab)
    ) {
      setActiveTab(urlParamsTab, false);
    } else if (![...tabs].some((t) => t.classList.contains(activeClass))) {
      targetTabID = tabs[0].getAttribute('aria-controls');
      // 2. Set active the default tab
      if (targetTabID) {
        setActiveTab(targetTabID, false);
      }
    }

    // 3. Handle click
    tabs.forEach((tab) => tab.addEventListener('click', handleTabClick));

    // 4. Handle Keyboard navigation
    tablist.addEventListener('keyup', handleKeyboardNavigation);

    window.addEventListener('hashchange', () => {
      if (useHash && window.location.hash) {
        const hash = window.location.hash.substring(1);
        if ([...tabs].some((t) => t.getAttribute('aria-controls') === hash)) {
          setActiveTab(hash);
        }
      }
    });
  });
}

/**
 * Initializes Horizontal scroll
 * @param {string} element - Element selector
 */
function horizontalScroll(selector: string) {
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

  const elements = document.querySelectorAll(selector);

  if (!elements.length) {
    return;
  }

  elements.forEach((el) => {
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

function accordions(el: string = '.accordions') {
  const elements = document.querySelectorAll(el);

  // 1. Loop through all accordion sets (accordions)
  for (let i = 0; i < elements.length; i++) {
    const accordionGroup = elements[i];

    if (accordionGroup.classList.contains('accordions-initialized')) return;

    const allowMultiple = accordionGroup.hasAttribute('data-allow-multiple');
    const accordions = accordionGroup.querySelectorAll('.accordion');

    // 2. Loop through all accordion within the set
    for (let j = 0; j < accordions.length; j++) {
      const accordion = accordions[j];
      const trigger = accordion.querySelector('[aria-controls]');

      if (!trigger) {
        return;
      }

      if (trigger && !trigger.hasAttribute('aria-expanded'))
        trigger.setAttribute('aria-expanded', 'false');

      // 3. Handle click event on the accordion head
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const target = e.currentTarget as HTMLElement;

        if (!target) {
          return;
        }

        const body = accordion.querySelector(
          `#${target.getAttribute('aria-controls')}`
        );

        if (!body) {
          return;
        }

        if (!allowMultiple) {
          // 4. Close all other accordions if necessary
          for (let k = 0; k < accordions.length; k++) {
            if (
              accordions[k] !== target.closest('.accordion') &&
              accordions[k].classList.contains('active')
            ) {
              const accordionTrigger =
                accordions[k].querySelector('[aria-controls]');
              const accordionBody =
                accordions[k].querySelector('[aria-labelledby]');

              if (!accordionTrigger || !accordionBody) {
                return;
              }
              accordions[k].classList.remove('active');
              accordionTrigger.setAttribute('aria-expanded', 'false');
              accordionBody.removeAttribute('role');
              slideUp(accordionBody as HTMLElement);
            }
          }
        }

        // 4. Toggle clicked accordion
        accordion.classList.toggle('active');

        if (accordion.classList.contains('active')) {
          slideDown(body as HTMLElement);
          trigger.setAttribute('aria-expanded', 'true');
          body.setAttribute('role', 'region');
        } else {
          slideUp(body as HTMLElement);
          trigger.setAttribute('aria-expanded', 'false');
          body.removeAttribute('role');
        }
      });
    }

    accordionGroup.classList.add('accordions-initialized');
  }
}

/**
 * Read More by Elements
 */
function readMoreInit() {
  const elements = document.querySelectorAll(
    '[data-rm]'
  ) as NodeListOf<HTMLElement>;
  elements.forEach((el) => {
    const xs = el.getAttribute('data-rm-xs');
    const sm = el.getAttribute('data-rm-sm');
    const md = el.getAttribute('data-rm-md');
    const lg = el.getAttribute('data-rm-lg');
    const moreText = el.getAttribute('data-rm-more') || 'Read More';
    const lessText = el.getAttribute('data-rm-less') || 'View Less';

    const options = [];

    if (xs) {
      options.push({
        numberToShow: parseInt(xs),
        viewportSize: 767,
      });
    }
    if (sm) {
      options.push({
        numberToShow: parseInt(sm),
        viewportSize: 1024,
      });
    }
    if (md) {
      options.push({
        numberToShow: parseInt(md),
        viewportSize: 1749,
      });
    }
    if (lg) {
      options.push({
        numberToShow: parseInt(lg),
        viewportSize: 9999,
      });
    }

    if (options.length) {
      readMore(el, options, moreText, lessText);
    }
  });
}

function readMore(
  eleWrapper: HTMLElement,
  options: { numberToShow: number; viewportSize: number }[],
  readMore?: string,
  readLess?: string
) {
  // sort from smallest to largest
  const sortedSizes = options.sort((a, b) =>
    a.viewportSize < b.viewportSize ? -1 : 1
  );

  const readMoreLabelInactive = readMore;
  const readMoreLabelActive = readLess;

  // get all the sizes from the object
  const sizes: number[] = [];
  sortedSizes.forEach((_ref) => {
    // const { numberToShow } = _ref;
    const { viewportSize } = _ref;
    sizes.push(viewportSize);
  });

  // each ele so everything is relative to each item we call this on
  window.addEventListener('load', () => readMoreInit(eleWrapper));
  window.addEventListener('resize', () => readMoreInit(eleWrapper));

  function readMoreInit(eleWrapper: HTMLElement) {
    const sizeToUse = sizes.filter((num) => window.innerWidth <= num)[0];

    // get the viewport size needed
    if (sizeToUse !== undefined) {
      var numberOfElementsToShow = sortedSizes.find(
        (item) => item.viewportSize == sizeToUse
      );
    }

    // if out of size range and read more is active
    if (!sizeToUse && eleWrapper.classList.contains('active')) {
      deconstructReadMore(eleWrapper);
    }

    // if inside of size range and read more is active
    if (!sizeToUse && eleWrapper.classList.contains('active')) {
      // check to see if current size is same as before or if changed sizes
      if (
        !eleWrapper.classList.contains(sizeToUse.toString()) &&
        numberOfElementsToShow
      ) {
        deconstructReadMore(eleWrapper);
        constructReadMore(
          eleWrapper,
          numberOfElementsToShow.numberToShow,
          sizeToUse.toString()
        );
      }
    }

    // if size is in range and read more isn't active
    if (
      sizeToUse !== undefined &&
      !eleWrapper.classList.contains('active') &&
      numberOfElementsToShow
    ) {
      constructReadMore(
        eleWrapper,
        numberOfElementsToShow.numberToShow,
        sizeToUse.toString()
      );
    }
  }

  function constructReadMore(
    eleWrapper: HTMLElement,
    num: number,
    className: string
  ) {
    eleWrapper.classList.add('active');
    eleWrapper.classList.add(className);

    // get set of children
    const { children } = eleWrapper;

    if (children.length <= num) {
      return;
    }

    const childrenArray = Array.from(children);

    // break them up into their own seperate parts
    const shownEles = childrenArray.slice(0, num);
    const shownElesWrapper = document.createElement('div');
    shownElesWrapper.classList.add('shown-elements');
    wrapAll(shownEles, shownElesWrapper);

    const shownElementsWrapper = eleWrapper.querySelector(
      '.shown-elements'
    ) as HTMLDivElement;

    // break them up into their own seperate parts
    const hiddenEles = childrenArray.slice(num);
    const hiddenElesWrapper = document.createElement('div');
    hiddenElesWrapper.classList.add('hidden-elements');
    const hiddenElesInnerWrapper = document.createElement('div');
    hiddenElesInnerWrapper.classList.add('hidden-elements-wrapper');
    wrapAll(hiddenEles, hiddenElesInnerWrapper);
    wrapAll([hiddenElesInnerWrapper], hiddenElesWrapper);

    const hiddenElementsWrapper = eleWrapper.querySelector(
      '.hidden-elements'
    ) as HTMLDivElement;
    if (!hiddenElementsWrapper) {
      return;
    }
    hiddenElementsWrapper.style.display = 'none';

    // wrap the rest with the container and add button
    const rmContainer = document.createElement('div');
    rmContainer.classList.add('read-more-container');
    wrapAll([shownElementsWrapper, hiddenElementsWrapper], rmContainer);

    const readMoreContainer = eleWrapper.querySelector(
      '.read-more-container'
    ) as HTMLDivElement;
    if (!readMoreContainer) {
      return;
    }

    readMoreContainer.insertAdjacentHTML(
      'beforeend',
      `<div class="view-more-container end-xs">
        <button type="button" class="button button--icon button--icon--after m-t read-more">
          <span>${readMoreLabelInactive}</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="13.707" height="7.561" viewBox="0 0 13.707 7.561" aria-hidden="true" role="presentation"><path d="M133.08,255.5l6.5,6.5,6.5-6.5" transform="translate(-132.726 -255.146)" fill="none" stroke="#f8bc2b" stroke-width="1"></path></svg>
        </button>
      </div>`
    );

    function handleButtonClick(e: Event) {
      e.preventDefault();

      const currentTarget = e.currentTarget as HTMLButtonElement;

      if (!currentTarget) {
        return;
      }

      const textWrapper = currentTarget.querySelector('span') || currentTarget;

      readMoreContainer.classList.toggle('active');
      slideToggle(hiddenElementsWrapper);
      currentTarget.classList.toggle('active');

      if (currentTarget.classList.contains('active')) {
        textWrapper.innerText = readMoreLabelActive || 'Read More';
      } else {
        textWrapper.innerText = readMoreLabelInactive || 'View Less';
      }
    }

    const viewMoreButton = eleWrapper.querySelector(
      '.view-more-container button'
    );

    if (!viewMoreButton) {
      return;
    }

    viewMoreButton.addEventListener('click', handleButtonClick);
  }

  function deconstructReadMore(eleWrapper: HTMLElement) {
    unwrap(eleWrapper.querySelector('.hidden-elements-wrapper'));
    unwrap(eleWrapper.querySelector('.hidden-elements'));
    unwrap(eleWrapper.querySelector('.shown-elements'));
    unwrap(eleWrapper.querySelector('.read-more-container'));

    const viewMoreContainer = eleWrapper.querySelector('.view-more-container');
    if (viewMoreContainer) {
      viewMoreContainer.parentNode?.removeChild(viewMoreContainer);
    }

    sizes.forEach((item) => {
      eleWrapper.classList.remove(item.toString());
    });
    eleWrapper.classList.remove('active');
  }
}
