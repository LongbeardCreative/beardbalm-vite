export default function tabsInit() {
  const tabContainers = document.querySelectorAll('.lb-tabs'); // tabs container class
  const activeClass = 'active';

  tabContainers.forEach((container) => {
    const tablist = container.querySelector('[role="tablist"]'); // Select the first one to avoid subtabs

    if (!tablist) {
      return;
    }

    let tabs: NodeListOf<Element> | Element[] =
      container.querySelectorAll<Element>('[role="tab"]');
    let tabPanels: NodeListOf<Element> | Element[] =
      container.querySelectorAll<Element>('[role="tabpanel"]');

    if (!tabs.length || !tabPanels.length) {
      return;
    }

    let useHash = false;
    const useHashAttr = container.getAttribute('data-use-hash');
    if (typeof useHashAttr !== typeof undefined && useHashAttr !== 'false') {
      useHash = true;
    }

    function isSameTabParent(el: Element) {
      return el.closest('.lb-tabs') === container;
    }

    function setActiveTab(id: string, focus: boolean = true) {
      tabs.forEach((tab) => {
        if (tab.getAttribute('aria-controls') === id) {
          tab.classList.add(`tab--${activeClass}`);
          tab.setAttribute('aria-selected', 'true');
          tab.setAttribute('tabindex', '0');
          if (focus) {
            (tab as HTMLElement).focus();
          }
          if (focus && useHash && typeof window.history !== 'undefined') {
            window.history.replaceState(undefined, '', `#${id}`);
          }
        } else {
          tab.classList.remove(`tab--${activeClass}`);
          tab.setAttribute('aria-selected', 'false');
          tab.setAttribute('tabindex', '-1');
          (tab as HTMLElement).blur();
        }
      });

      tabPanels.forEach((tabPanel) => {
        if (tabPanel.id === id) {
          tabPanel.classList.add(`tabpanel--${activeClass}`);
          tabPanel.setAttribute('aria-expanded', 'true');
        } else {
          tabPanel.classList.remove(`tabpanel--${activeClass}`);
          tabPanel.setAttribute('aria-expanded', 'false');
        }
      });

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
        if (el.classList.contains('tab--default')) {
          el.classList.remove('tab--default');
        }
      });

      // 2. Set active tab
      const ariaControls = currentTarget.getAttribute('aria-controls');
      if (
        ariaControls &&
        !currentTarget.classList.contains(`tab--${activeClass}`)
      ) {
        setActiveTab(ariaControls);
      }

      // 3. Slide clicked tab into view
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
      const activeTab = [...tabs].find((tab) =>
        tab.classList.contains(`tab--${activeClass}`)
      );

      switch (e.key) {
        case 'ArrowLeft':
        case 'ArrowUp': {
          e.preventDefault();
          const prev = activeTab?.previousElementSibling
            ? activeTab?.previousElementSibling.getAttribute('aria-controls')
            : tabs[tabs.length - 1].getAttribute('aria-controls');
          if (prev) {
            setActiveTab(prev);
          }
          break;
        }
        case 'ArrowRight':
        case 'ArrowDown': {
          e.preventDefault();
          const next = activeTab?.nextElementSibling
            ? activeTab?.nextElementSibling.getAttribute('aria-controls')
            : tabs[0].getAttribute('aria-controls');
          if (next) {
            setActiveTab(next);
          }
          break;
        }
        default:
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
    const urlParams = new URLSearchParams(window.location.search);
    const urlParamsTab = urlParams.get('tab');
    if (window.location.hash) {
      const hash = window.location.hash.substring(1);

      if ([...tabPanels].some((t) => t.id === hash)) {
        setActiveTab(hash, false);
      } else {
        // Check if any of the current tab has subtab that will be activated
        for (let i = 0; i < tabPanels.length; i += 1) {
          if (tabPanels[i].querySelector(`#${hash}`)) {
            setActiveTab(tabPanels[i].id, false);
            break;
          }
        }
      }
    } else if (
      urlParamsTab &&
      [...tabs].some((t) => t.getAttribute('aria-controls') === urlParamsTab)
    ) {
      setActiveTab(urlParamsTab, false);
    } else if (
      ![...tabs].some((t) => t.classList.contains(`tab--${activeClass}`))
    ) {
      const ariaControls = tabs[0].getAttribute('aria-controls');
      // 2. Set active the default tab
      if (ariaControls) {
        setActiveTab(ariaControls, false);
      }
    }

    // 3. Handle click
    tabs.forEach((tab) => tab.addEventListener('click', handleTabClick));

    // 4. Handle Keyboard navigation
    tablist.addEventListener('keyup', (e) => {
      handleKeyboardNavigation(e as KeyboardEvent);
    });

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
