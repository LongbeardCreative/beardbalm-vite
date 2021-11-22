/**
 * File navigation.js.
 *
 * Handles toggling the navigation menu for small screens and enables TAB key
 * navigation support for dropdown menus.
 */
(function () {
  var html, container, button, menu, links, i, len;

  html = document.documentElement;

  container = document.getElementById("mobile-navigation");

  button = document.getElementById("mobile-menu-toggle");

  if (!container || !button) return;

  menu = container.getElementsByTagName("ul")[0];

  // Hide menu toggle button if menu is empty and return early.
  if (typeof menu === "undefined") {
    button.style.display = "none";
    return;
  }

  if (!menu.classList.contains("nav-menu")) {
    menu.classList.add("nav-menu");
  }

  function openMenu() {
    container.classList.add("toggled");
    button.setAttribute("aria-expanded", "true");
    button.querySelector(".menu-toggle__label--menu").style.display = "none";
    button.querySelector(".menu-toggle__label--close").style.display = "";
    html.classList.add("no-scroll");
  }

  function closeMenu() {
    container.classList.remove("toggled");
    button.setAttribute("aria-expanded", "false");
    button.querySelector(".menu-toggle__label--menu").style.display = "";
    button.querySelector(".menu-toggle__label--close").style.display = "none";
    html.classList.remove("no-scroll");
  }

  button.onclick = function () {
    if (container.classList.contains("toggled")) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  // Close mobile menu when user clicks outside
  document.addEventListener("click", function (event) {
    var isClickInside =
      container.contains(event.target) || button.contains(event.target);

    if (!isClickInside) {
      closeMenu();
    }
  });

  // Close mobile menu when use presses Escape
  document.body.addEventListener("keyup", function (e) {
    if (e.key === "Escape") {
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

  window.addEventListener("load", mobileMenuResponsive);
  window.addEventListener("resize", mobileMenuResponsive);

  // Get all the link elements within the menu.
  links = menu.getElementsByTagName("a");

  // Each time a menu link is focused or blurred, toggle focus.
  // for ( i = 0, len = links.length; i < len; i++ ) {
  // 	links[i].addEventListener( 'focus', toggleFocus, true );
  // 	links[i].addEventListener( 'blur', toggleFocus, true );
  // }

  /**
   * Sets or removes .focus class on an element.
   */
  function toggleFocus() {
    var self = this;

    // Move up through the ancestors of the current link until we hit .nav-menu.
    while (-1 === self.className.indexOf("nav-menu")) {
      // On li elements toggle the class .focus.
      if ("li" === self.tagName.toLowerCase()) {
        if (-1 !== self.className.indexOf("focus")) {
          self.className = self.className.replace(" focus", "");
        } else {
          self.className += " focus";
        }
      }
      self = self.parentElement;
    }
  }

  /**
   * Toggles `focus` class to allow submenu access on tablets.
   */
  (function () {
    var touchStartFn,
      parentLink = container.querySelectorAll(
        ".menu-item-has-children > a, .page_item_has_children > a"
      );

    // if ( 'ontouchstart' in window ) {
    touchStartFn = function (e) {
      var menuItem = this.parentNode;
      e.preventDefault();
      e.stopPropagation();

      menuItem.classList.toggle("expanded");
      toggleDropdown(menuItem);
      // if ( ! menuItem.classList.contains( 'focus' ) ) {
      // 	if (e.cancelable) {
      // 		e.preventDefault();
      // 		e.stopPropagation();
      //  	}
      // 	console.log('if', menuItem, console.log(e.cancelable));
      // 	var menuItems = menuItem.closest('.nav-menu').querySelectorAll('.menu-item');
      // 	for ( i = 0; i < menuItems.length; ++i ) {
      // 		if ( menuItem === menuItems[i] ) {
      // 			continue;
      // 		}
      // 		// console.log(menuItems[i], e.currentTarget.parentNode)
      // 		if (
      // 			menuItems[i].classList.contains( 'focus' ) &&
      // 			menuItems[i].classList.contains( 'menu-item-has-children' ) &&
      // 			menuItems[i] !== e.currentTarget
      // 		) {
      // 			menuItems[i].classList.remove( 'focus' );
      // 			toggleDropdown(menuItems[i]);
      // 		}
      // 		menuItems[i].classList.remove( 'focus' );
      // 	}
      // 	menuItem.classList.add( 'focus' );
      // 	toggleDropdown(menuItem);
      // } else {
      // 	console.log('else', menuItem);
      // 	menuItem.classList.remove( 'focus' );
      // }
    };

    for (i = 0; i < parentLink.length; ++i) {
      // parentLink[i].addEventListener( 'click', touchStartFn, {passive: false} );
    }
    // }
  })(container);

  function toggleDropdown(el) {
    var submenu = el.querySelector(".sub-menu");
    if (el.classList.contains("expanded")) {
      slideDown(submenu);
    } else {
      slideUp(submenu);
    }
  }
})();
