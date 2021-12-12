import debounce from 'just-debounce-it';
import './style.scss';

interface InitProps {
  sliderSelector: string;
  sliderInnerSelector: string;
  arrowPrevSelector: string;
  arrowNextSelector: string;
}

interface Props {
  sliderSelector?: string;
  sliderInnerSelector?: string;
  arrowPrevSelector?: string;
  arrowNextSelector?: string;
}

const defaultProps = {
  sliderSelector: '[data-slider]',
  sliderInnerSelector: '[data-slider-inner]',
  arrowPrevSelector: '[data-slider-prev]',
  arrowNextSelector: '[data-slider-next]',
};

function initSlider(slider: HTMLElement, options: InitProps) {
  const { sliderInnerSelector, arrowPrevSelector, arrowNextSelector } = options;
  const sliderInner = slider.querySelector(sliderInnerSelector);
  const arrowPrev = slider.querySelectorAll(arrowPrevSelector);
  const arrowNext = slider.querySelectorAll(arrowNextSelector);

  if (!sliderInner) {
    console.warn(
      `Cannot find slider inner by the selector ${sliderInnerSelector}`
    );
    return;
  }

  function updateArrowStatus() {
    if (!sliderInner) {
      return;
    }

    const { scrollWidth, clientWidth, scrollLeft } = sliderInner;
    const errorMargin = 5; // sometimes clientWidth + scrollLeft won't ever add up to scrollWidth

    const hasNext = scrollWidth - errorMargin > clientWidth + scrollLeft;
    const hasPrev = scrollLeft > 0;

    arrowNext.forEach((el) => {
      if (hasNext) {
        el.removeAttribute('disabled');
      } else {
        el.setAttribute('disabled', '');
      }
    });

    arrowPrev.forEach((el) => {
      if (hasPrev) {
        el.removeAttribute('disabled');
      } else {
        el.setAttribute('disabled', '');
      }
    });
  }

  function handleArrowClick(direction: 'next' | 'prev') {
    if (!sliderInner) {
      return;
    }

    const allSlides = sliderInner.children;

    const currentSlideIndex = [...allSlides].findIndex(
      (el) => el.getBoundingClientRect().left > 0
    );
    const previousSlideIndex =
      currentSlideIndex === 0 ? allSlides.length - 1 : currentSlideIndex - 1;

    const { scrollLeft } = sliderInner;

    if (direction === 'next') {
      sliderInner.scrollTo({
        left: scrollLeft + allSlides[currentSlideIndex].clientWidth,
        behavior: 'smooth',
      });
    } else if (direction === 'prev') {
      sliderInner.scrollTo({
        left: scrollLeft - allSlides[previousSlideIndex].clientWidth,
        behavior: 'smooth',
      });
    }
  }

  const handleWindowResize = debounce(() => updateArrowStatus(), 500);
  const handleScroll = debounce(() => updateArrowStatus(), 250);

  updateArrowStatus();

  arrowPrev.forEach((el) =>
    el.addEventListener('click', () => handleArrowClick('prev'))
  );
  arrowNext.forEach((el) =>
    el.addEventListener('click', () => handleArrowClick('next'))
  );
  sliderInner.addEventListener('scroll', handleScroll);
  window.addEventListener('resize', handleWindowResize);
}

export default function slider(props?: Props) {
  // 1. Merge passed props with default props
  const options = {
    ...defaultProps,
    ...props,
  };

  // 2. Init sliders
  const sliders = document.querySelectorAll(options.sliderSelector);
  sliders.forEach((slider) => initSlider(slider as HTMLElement, options));
}
