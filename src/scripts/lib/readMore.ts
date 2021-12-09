import { slideToggle, unwrap, wrapAll } from '../utils/helpers';

function readMoreInit(
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

export default function readMore() {
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
      readMoreInit(el, options, moreText, lessText);
    }
  });
}
