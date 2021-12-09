import { slideDown, slideUp } from '../utils/helpers';

export default function accordions(el: string = '.accordions') {
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
