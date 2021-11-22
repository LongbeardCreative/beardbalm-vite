var $ = jQuery.noConflict();

// Initialize functions
document.addEventListener("DOMContentLoaded", function () {
  console.log("JMJ");
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

/*********************
DECLARED FUNCTIONS
*********************/

/**
 * Sets up accessibility listeners
 */
function accessibility() {
  // Remove focus from links
  document.body.classList.add("is-mouse");

  // Listen to tab events to enable outlines (accessibility improvement)
  document.body.addEventListener("keyup", function (e) {
    if (e.key === "Tab") {
      document.body.classList.remove("is-mouse");
    }
  });

  // Let the document know when the mouse is being used
  document.body.addEventListener("mousedown", () => {
    document.body.classList.add("is-mouse");
  });

  // Check if this is touch device
  if (deviceHasTouchScreen()) {
    document.body.classList.add("is-touch-device");
  } else {
    document.body.classList.add("not-touch-device");
  }
}

function slickSlider(slider) {
  $(window).on("load resize orientationchange", function () {
    $(slider).each(function () {
      var $carousel = $(this);
      /* Initializes a slick carousel only on mobile screens */
      // slick on mobile
      if ($(window).width() > 1025) {
        if ($carousel.hasClass("slick-initialized")) {
          $carousel.slick("unslick");
        }
      } else {
        if (!$carousel.hasClass("slick-initialized")) {
          $carousel.slick({
            infinite: true,
            speed: 400,
            autoplay: false,
            dots: false,
            slidesToShow: 2,
            slidesToScroll: 1,
            prevArrow: '<div class="slick-arrow slick-prev">Prev</div>', //replace arrows
            nextArrow: '<div class="slick-arrow slick-next">Next></div>', //replace arrows
            responsive: [
              {
                breakpoint: 601,
                settings: "unslick",
              },
            ],
          });
        }
      }
    });
  });
}

/**
 * Initialize Smooth Scroll
 */
function smoothScroll() {
  // Smooth scroll for direct-to-anchor external links
  // if (window.location.hash) {
  //   $("html, body").animate(
  //     {
  //       scrollTop: $(window.location.hash).offset().top - 100,
  //     },
  //     1000
  //   );
  // }
  // Select all links with hashes, same page
  $('a[href*="#"][data-smooth-scroll]').click(function (event) {
    // On-page links
    if (
      location.pathname.replace(/^\//, "") ==
        this.pathname.replace(/^\//, "") &&
      location.hostname == this.hostname
    ) {
      // Figure out element to scroll to
      var hash = this.hash;
      var target = $(hash);
      target = target.length ? target : $("[name=" + this.hash.slice(1) + "]");
      // Does a scroll target exist?
      if (target.length) {
        // Only prevent default if animation is actually gonna happen
        event.preventDefault();
        $("html, body").animate(
          {
            scrollTop:
              target.attr("role") === "tabpanel"
                ? target.parent().offset().top
                : target.offset().top,
          },
          1000,
          function () {
            // Callback after animation
            // Must change focus!
            var $target = $(target);
            $target.focus();
            if ($target.is(":focus")) {
              // Checking if the target was focused
              return false;
            } else {
              // $target.attr("tabindex", "-1"); // Adding tabindex for elements not focusable
              // $target.focus(); // Set focus again
            }
          }
        );
      }
      if (window.location.hash === hash) {
        $(window).trigger("hashchange");
      } else {
        window.location.hash = hash;
      }
    }
  });
}

/**
 * Initialize Tabs
 */
function tabs() {
  var tabs = $(".lb-tabs"); // tabs container class
  var activeClass = "active";

  tabs.each(function () {
    var container = $(this);
    var tablist = $(this).find('[role="tablist"]')[0]; // Select the first one to avoid subtabs
    var tab = $(this).find('[role="tab"]');
    var tabContent = $(this).find('[role="tabpanel"]');
    var useHash = false;
    var useHashAttr = $(this).attr("data-use-hash");
    if (typeof useHashAttr !== typeof undefined && useHashAttr !== false) {
      useHash = true;
    }

    function isSameTabParent(_, element) {
      return element.closest(".lb-tabs") === container[0];
    }

    function setActiveTab(id, focus = true) {
      tab.each(function () {
        if ($(this).attr("aria-controls") === id) {
          $(this).addClass(activeClass).attr({ "aria-selected": true });
          if (focus) {
            $(this).focus();
          }
        } else {
          $(this)
            .removeClass(activeClass)
            .attr({ "aria-selected": false })
            .blur();
        }
      });

      tabContent.each(function () {
        if ($(this).attr("id") === id) {
          $(this).addClass(activeClass).attr({ "aria-expanded": true });
        } else {
          $(this).removeClass(activeClass).attr({ "aria-expanded": false });
        }
      });

      // EDGE Case for Support - Foundation where there are subtabs
      // 1. Check if this has subtabs
      // 2. Show Subtabs
      var subtabs = $(`#${id}`).closest(".lb-tabs").find(".subtabs");
      if (subtabs.length) {
        subtabs.each(function () {
          if ($(this).attr("aria-labelledby") === `tab-${id}`) {
            $(this).addClass("active");
            $(this).attr("aria-expanded", true);
          } else {
            $(this).removeClass("active");
            $(this).attr("aria-expanded", false);
          }
        });
      }

      // Dispatch Event
      const event = new Event("changeTab");
      window.dispatchEvent(event);
    }

    function handleTabClick(e) {
      e.preventDefault();

      // 1. Remove pre-selected default tabs classes
      tab.filter(".tab-default").removeClass("tab-default");
      tabContent.filter(".tab-default").removeClass("tab-default");

      // 2. Set active tab
      if (!$(this).hasClass(activeClass)) {
        setActiveTab($(this).attr("aria-controls"));
      }

      // 3. Update URL (if required)
      // if (useHash) {
      //   history.replaceState({}, '', $(this).attr("href"));
      // }

      // 4. Slide clicked tab into view
      if (!$(this).hasClass("slick-slide")) {
        // slide to view
        var buffer = 50; // gradient
        var container = $(this).closest(".tabs");
        var frame = container.closest(".overflow-wrapper");
        var offset;

        if (
          $(this).position().left <= buffer ||
          $(this).position().left + $(this).width() >= frame.width() - buffer
        ) {
          if ($(this).position().left > frame.width() / 2) {
            // scroll to right
            offset =
              container.scrollLeft() +
              ($(this).position().left -
                container.width() +
                $(this).width() +
                50);
          } else {
            // scroll to left
            offset = container.scrollLeft() + ($(this).position().left - 50);
          }
        }

        container.animate(
          {
            scrollLeft: offset,
          },
          250
        );
      }
    }

    function handleKeyboardNavigation(e) {
      switch (e.key) {
        case "ArrowLeft": // left arrow
        case "ArrowUp": // up arrow
          e.preventDefault();
          var prev = tab.filter("." + activeClass).prev().length
            ? tab
                .filter("." + activeClass)
                .prev()
                .attr("aria-controls")
            : tab.last().attr("aria-controls");
          setActiveTab(prev);
          break;
        case "ArrowRight": // right arrow
        case "ArrowDown": // down arrow
          e.preventDefault();
          var next = tab.filter("." + activeClass).next().length
            ? tab
                .filter("." + activeClass)
                .next()
                .attr("aria-controls")
            : tab.first().attr("aria-controls");
          setActiveTab(next);
          break;
      }
    }

    // 1. Filter tabs to exclude sub tabs / parent tabs
    tab = tab.filter(isSameTabParent).filter(':not([id*="slick"])');
    tabContent = tabContent.filter(isSameTabParent);

    // 2. Defaults - activate the first tab
    // 1. Check if default tab should be specified by the URL
    var targetTabID;
    var urlParams = new URLSearchParams(window.location.search);
    if (window.location.hash) {
      var hash = window.location.hash.substring(1);
      if (tab.filter('[aria-controls="' + hash + '"]').length) {
        targetTabID = hash;
        setActiveTab(targetTabID, false);
        // setTimeout(() => {
        //   document.getElementById(hash).closest("section").scrollIntoView();
        // }, 50);
      }
    } else if (
      urlParams &&
      urlParams.get("tab") &&
      tab.filter('[aria-controls="' + urlParams.get("tab") + '"]').length
    ) {
      setActiveTab(urlParams.get("tab"), false);
    } else if (!tab.filter("." + activeClass).length) {
      targetTabID = tab.first().attr("aria-controls");
      // 2. Set active the default tab
      setActiveTab(targetTabID, false);
    }

    // 3. Handle click
    tab.on("click", handleTabClick);

    // 4. Handle Keyboard navigation
    $(tablist).on("keyup", handleKeyboardNavigation);

    $(window).on("hashchange", function () {
      if (useHash && window.location.hash) {
        var hash = window.location.hash.substring(1);
        if (tab.filter('[aria-controls="' + hash + '"]').length) {
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
function horizontalScroll(element) {
  $(element)
    .each(function () {
      if (!$(this).closest(".overflow-wrapper").length) {
        $(this).wrap('<div class="overflow-wrapper"></div>');
      }
      if (!$(this).hasClass("overflow-ready")) {
        $(this).addClass("overflow-ready--x");
      }
      scrollOverflow($(this));
    })
    .scroll(function () {
      scrollOverflow($(this));
    });

  $(window).on("resize", function () {
    setTimeout(function () {
      $(element).each(function () {
        scrollOverflow($(this));
      });
    }, 500);
  });

  function scrollOverflow(el) {
    var wrap = el.closest(".overflow-wrapper");
    if (el[0].scrollWidth > el[0].clientWidth) {
      // your element have overflow
      wrap.addClass("overflow--x");

      if (el.scrollLeft() > 0) {
        wrap.addClass("overflow--left");
      } else {
        wrap.removeClass("overflow--left");
      }

      if (el.scrollLeft() < el.get(0).scrollWidth - el.outerWidth() - 10) {
        wrap.addClass("overflow--right");
      } else {
        wrap.removeClass("overflow--right");
      }
    } else {
      // your element doesn't have overflow
      wrap.removeClass("overflow--x");
    }
  }
}

/**
 * Initializes Accordions
 * @param {string} [el = .accordions] - Element selector
 */

function accordions(el = ".accordions") {
  const elements = document.querySelectorAll(el);

  // 1. Loop through all accordion sets (accordions)
  for (let i = 0; i < elements.length; i++) {
    const accordionGroup = elements[i];

    if (accordionGroup.classList.contains("accordions-initialized")) return;

    const allowMultiple = accordionGroup.hasAttribute("data-allow-multiple");
    const accordions = accordionGroup.querySelectorAll(".accordion");

    // 2. Loop through all accordion within the set
    for (let j = 0; j < accordions.length; j++) {
      let accordion = accordions[j];
      const trigger = accordion.querySelector("[aria-controls]");
      if (trigger && !trigger.hasAttribute("aria-expanded"))
        trigger.setAttribute("aria-expanded", "false");

      // 3. Handle click event on the accordion head
      trigger.addEventListener("click", function (e) {
        e.preventDefault();
        const body = accordion.querySelector(
          "#" + e.currentTarget.getAttribute("aria-controls")
        );

        if (!allowMultiple) {
          // 4. Close all other accordions if necessary
          for (let k = 0; k < accordions.length; k++) {
            if (
              accordions[k] !== e.currentTarget.closest(".accordion") &&
              accordions[k].classList.contains("active")
            ) {
              const accordionTrigger =
                accordions[k].querySelector("[aria-controls]");
              const accordionBody =
                accordions[k].querySelector("[aria-labelledby]");
              accordions[k].classList.remove("active");
              accordionTrigger.setAttribute("aria-expanded", "false");
              accordionBody.removeAttribute("role");
              slideUp(accordionBody);
            }
          }
        }

        // 4. Toggle clicked accordion
        accordion.classList.toggle("active");

        if (accordion.classList.contains("active")) {
          slideDown(body);
          trigger.setAttribute("aria-expanded", "true");
          body.setAttribute("role", "region");
        } else {
          slideUp(body);
          trigger.setAttribute("aria-expanded", "false");
          body.removeAttribute("role");
        }
      });
    }

    accordionGroup.classList.add("accordions-initialized");
  }
}

/**
 * Read More by Elements
 */
function readMoreInit() {
  const elements = document.querySelectorAll("[data-rm]");
  for (let i = 0; i < elements.length; i++) {
    const el = elements[i];

    const xs = el.getAttribute("data-rm-xs");
    const sm = el.getAttribute("data-rm-sm");
    const md = el.getAttribute("data-rm-md");
    const lg = el.getAttribute("data-rm-lg");
    const moreText = el.getAttribute("data-rm-more") || "Read More";
    const lessText = el.getAttribute("data-rm-less") || "View Less";

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
  }
}

function readMore(eleWrapper, arrayOfObjects, readMore, readLess) {
  // sort from smallest to largest
  var sortedSizes = arrayOfObjects.sort(function (a, b) {
    return a.viewportSize < b.viewportSize ? -1 : 1;
  });

  var readMoreLabelInactive = readMore;
  var readMoreLabelActive = readLess;

  // get all the sizes from the object
  var sizes = [];
  sortedSizes.forEach(function (_ref) {
    var numberToShow = _ref.numberToShow,
      viewportSize = _ref.viewportSize;
    sizes.push(viewportSize);
  });

  // each ele so everything is relative to each item we call this on
  window.addEventListener("load", () => readMoreInit(eleWrapper));
  window.addEventListener("resize", () => readMoreInit(eleWrapper));

  function readMoreInit(eleWrapper) {
    var sizeToUse = sizes.filter((num) => window.innerWidth <= num)[0];

    // get the viewport size needed
    if (sizeToUse !== undefined) {
      var numberOfElementsToShow = sortedSizes.find(
        (item) => item.viewportSize == sizeToUse
      );
    }

    // if out of size range and read more is active
    if (!sizeToUse && eleWrapper.classList.contains("active")) {
      deconstructReadMore(eleWrapper);
    }

    // if inside of size range and read more is active
    if (!sizeToUse && eleWrapper.classList.contains("active")) {
      // check to see if current size is same as before or if changed sizes
      if (!eleWrapper.classList.contains(sizeToUse)) {
        deconstructReadMore(eleWrapper);
        constructReadMore(
          eleWrapper,
          numberOfElementsToShow.numberToShow,
          sizeToUse
        );
      }
    }

    // if size is in range and read more isn't active
    if (sizeToUse !== undefined && !eleWrapper.classList.contains("active")) {
      constructReadMore(
        eleWrapper,
        numberOfElementsToShow.numberToShow,
        sizeToUse
      );
    }
  }

  function constructReadMore(eleWrapper, num, className) {
    eleWrapper.classList.add("active");
    eleWrapper.classList.add(className);

    // get set of children
    const children = eleWrapper.children;

    if (children.length <= num) {
      return;
    }

    const childrenArray = Array.from(children);

    // break them up into their own seperate parts
    // TODO: this is still in jQuery
    var shownEles = childrenArray.slice(0, num);
    $(shownEles).wrapAll('<div class="shown-elements"></div>');

    // break them up into their own seperate parts
    var hiddenEles = childrenArray.slice(num);
    $(hiddenEles).wrapAll(
      '<div class="hidden-elements"><div class="hidden-elements-wrapper"></div></div>'
    );
    eleWrapper.querySelector(".hidden-elements").style.display = "none";

    // wrap the rest with the container and add button
    // TODO: this is still in jQuery
    $(eleWrapper).children().wrapAll('<div class="read-more-container"></div>');

    eleWrapper.querySelector(".read-more-container").insertAdjacentHTML(
      "beforeend",
      `<div class="view-more-container end-xs">
        <button type="button" class="button button--icon button--icon--after m-t read-more">
          <span>${readMoreLabelInactive}</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="13.707" height="7.561" viewBox="0 0 13.707 7.561" aria-hidden="true" role="presentation"><path d="M133.08,255.5l6.5,6.5,6.5-6.5" transform="translate(-132.726 -255.146)" fill="none" stroke="#f8bc2b" stroke-width="1"></path></svg>
        </button>
      </div>`
    );

    function handleButtonClick(e) {
      e.preventDefault();
      eleWrapper
        .querySelector(".read-more-container")
        .classList.toggle("active");
      slideToggle(eleWrapper.querySelector(".hidden-elements"));
      e.currentTarget.classList.toggle("active");

      if (e.currentTarget.classList.contains("active")) {
        e.currentTarget.querySelector("span").innerText = readMoreLabelActive;
      } else {
        e.currentTarget.querySelector("span").innerText = readMoreLabelInactive;
      }
    }

    eleWrapper
      .querySelector(".view-more-container button")
      .addEventListener("click", handleButtonClick);
  }

  function deconstructReadMore(eleWrapper) {
    // TODO: In jQuery
    $(eleWrapper).find(".hidden-elements-wrapper").children().unwrap();
    $(eleWrapper).find(".hidden-elements").children().unwrap();
    $(eleWrapper).find(".shown-elements").children().unwrap();
    $(eleWrapper).find(".read-more-container").children().unwrap();
    $(eleWrapper).find(".view-more-container").remove();
    sizes.map(function (item) {
      $(eleWrapper).removeClass("" + item);
    });
    $(eleWrapper).removeClass("active");
  }
}

/**
 * Fix for AOS scroll animation library on IE <= 10 browsers
 * Enable this if AOS is used on site.
 */

function aosIE() {
  var ua = window.navigator.userAgent;
  var msie = ua.indexOf("MSIE ");

  if (msie > 0) {
    $("[data-aos^=fade][data-aos^=fade]").css("opacity", "1");
  }
}

/*********************
HELPER METHODS
*********************/

/**
 * Format number to USD format
 * @param {number} number
 * @returns {string} Formatted currency
 */
function formatCurrency(number) {
  if (number && !isNaN(parseInt(number))) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(number);
  }
}

/**
 * Vanilla JS slide up animation
 * @param {ELement} target  Element to animate
 * @param {number} [duration = 250] Animation duration in milliseconds
 */
function slideUp(target, duration = 250) {
  target.style.transitionProperty = "height, margin, padding";
  target.style.transitionDuration = duration + "ms";
  target.style.boxSizing = "border-box";
  target.style.height = target.offsetHeight + "px";
  target.offsetHeight;
  target.style.overflow = "hidden";
  target.style.height = 0;
  target.style.paddingTop = 0;
  target.style.paddingBottom = 0;
  target.style.marginTop = 0;
  target.style.marginBottom = 0;
  window.setTimeout(() => {
    target.style.display = "none";
    target.style.removeProperty("height");
    target.style.removeProperty("padding-top");
    target.style.removeProperty("padding-bottom");
    target.style.removeProperty("margin-top");
    target.style.removeProperty("margin-bottom");
    target.style.removeProperty("overflow");
    target.style.removeProperty("transition-duration");
    target.style.removeProperty("transition-property");
  }, duration);
}

/**
 * Vanilla JS slide down animation
 * @param {ELement} target  Element to animate
 * @param {number} [duration = 250] Animation duration in milliseconds
 */
function slideDown(target, duration = 250) {
  target.style.removeProperty("display");
  let display = window.getComputedStyle(target).display;
  if (display === "none") display = "block";
  target.style.display = display;
  let height = target.offsetHeight;
  target.style.overflow = "hidden";
  target.style.height = 0;
  target.style.paddingTop = 0;
  target.style.paddingBottom = 0;
  target.style.marginTop = 0;
  target.style.marginBottom = 0;
  target.offsetHeight;
  target.style.boxSizing = "border-box";
  target.style.transitionProperty = "height, margin, padding";
  target.style.transitionDuration = duration + "ms";
  target.style.height = height + "px";
  target.style.removeProperty("padding-top");
  target.style.removeProperty("padding-bottom");
  target.style.removeProperty("margin-top");
  target.style.removeProperty("margin-bottom");
  window.setTimeout(() => {
    target.style.removeProperty("height");
    target.style.removeProperty("overflow");
    target.style.removeProperty("transition-duration");
    target.style.removeProperty("transition-property");
  }, duration);
}

/**
 * Vanilla JS slide toggle animation
 * @param {ELement} target  Element to animate
 * @param {number} [duration = 250] Animation duration in milliseconds
 */
function slideToggle(target, duration = 250) {
  if (window.getComputedStyle(target).display === "none") {
    return slideDown(target, duration);
  } else {
    return slideUp(target, duration);
  }
}

/**
 * Checks if the user's device has touch screen
 * @returns {Boolean}
 */
function deviceHasTouchScreen() {
  let hasTouchScreen = false;
  if (typeof window !== "undefined") {
    if ("maxTouchPoints" in navigator) {
      hasTouchScreen = navigator.maxTouchPoints > 0;
    } else if ("msMaxTouchPoints" in navigator) {
      hasTouchScreen = navigator.msMaxTouchPoints > 0;
    } else {
      const mQ = window.matchMedia && matchMedia("(pointer:coarse)");
      if (mQ && mQ.media === "(pointer:coarse)") {
        hasTouchScreen = !!mQ.matches;
      } else if ("orientation" in window) {
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
 * Debounce helper
 * @param {Function} func Callback function
 * @param {number} [wait = 500] Debounce wait interval in milliseconds
 * @return {Function} Callback function
 */
function debounce(func, wait = 500) {
  let timeout;

  // This is the function that is returned and will be executed many times
  // We spread (...args) to capture any number of parameters we want to pass
  return function executedFunction(...args) {
    // The callback function to be executed after
    // the debounce time has elapsed
    const later = () => {
      // null timeout to indicate the debounce ended
      timeout = null;

      // Execute the callback
      func(...args);
    };
    // This will reset the waiting every function execution.
    // This is the step that prevents the function from
    // being executed because it will never reach the
    // inside of the previous setTimeout
    clearTimeout(timeout);

    // Restart the debounce waiting period.
    // setTimeout returns a truthy value (it differs in web vs Node)
    timeout = setTimeout(later, wait);
  };
}

/**
 * Efficiently removes children of a parent element
 * @param {Element} el Parent element whose children will be removed
 */
function removeChildren(el) {
  while (el.firstChild) {
    el.removeChild(el.lastChild);
  }
}

/**
 * Removes 'active' class on an element on clicking outside of it
 * @param {Element} element Element which will lose the 'active' class
 * @param {Element} [wrapper] Wrapper element where clicks inside will be ignored. Optional
 */
function hideOnClickOutside(element, wrapper) {
  if (!wrapper) {
    wrapper = element;
  }
  const outsideClickListener = (event) => {
    // console.log(isVisible(element));
    if (!wrapper.contains(event.target) && isVisible(wrapper)) {
      // or use: event.target.closest(selector) === null
      // element.style.display = "none";
      element.classList.remove("active");
      removeClickListener();
    }
  };

  const removeClickListener = () => {
    document.removeEventListener("click", outsideClickListener);
  };

  document.addEventListener("click", outsideClickListener);
}

/**
 * Check if an element is visible
 * @param {Element} el Element to check
 * @returns {Boolean}
 */
function isVisible(el) {
  return (
    !!el && !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length)
  );
}
