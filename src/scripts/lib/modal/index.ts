import { getYoutubeID } from './helpers';
import './style.scss';

interface NodesProps {
  node: HTMLDivElement;
  innerNode: HTMLDivElement;
  closeNode?: HTMLButtonElement;
}

interface Props {
  target?: HTMLElement;
  youtube?: {
    videoID: string;
  };
  html?: string | HTMLElement;
}

declare global {
  interface Window {
    modal: (props: Props) => void;
  }
}

function createModalWrapper() {
  const section = document.createElement('section');
  section.classList.add('modal-section');

  document.body.append(section);

  return section;
}

const modalWrapper = createModalWrapper();

function animateModal({ node, innerNode }: NodesProps) {
  // 1. Animate wrapper
  node.animate([{ opacity: 0 }, { opacity: 1 }], {
    duration: 150,
    easing: 'ease-out',
  });

  // 2. Animate inner
  innerNode.animate(
    [{ transform: `translateY(1rem)` }, { transform: `translateY(0)` }],
    {
      duration: 250,
      easing: 'ease-out',
    }
  );

  return Promise.allSettled([
    ...node.getAnimations().map((animation) => animation.finished),
    ...innerNode.getAnimations().map((animation) => animation.finished),
  ]);
}

function createModal(props: Props): NodesProps {
  const { youtube, html } = props;

  const node = document.createElement('div');

  node.classList.add('modal');
  node.setAttribute('role', 'dialog');
  node.setAttribute('aria-modal', 'true');

  const innerNode = document.createElement('div');
  innerNode.classList.add('modal__inner');
  if (youtube) {
    innerNode.classList.add('modal__inner--video');
  }
  if (html) {
    innerNode.classList.add('modal__inner--html');
  }

  const headNode = document.createElement('div');
  headNode.classList.add('modal__head');
  innerNode.appendChild(headNode);

  const closeNode = document.createElement('button');
  closeNode.classList.add('modal__close');
  closeNode.setAttribute('type', 'button');
  closeNode.appendChild(document.createTextNode('\u00d7'));

  const bodyNode = document.createElement('div');
  bodyNode.classList.add('modal__body');
  const bodyInnerNode = document.createElement('div');
  bodyInnerNode.classList.add('modal__body__inner');

  if (youtube) {
    const iframeWrapperNode = document.createElement('div');
    iframeWrapperNode.classList.add('modal__video');
    const iframeNode = document.createElement('iframe');
    iframeNode.width = '560';
    iframeNode.height = '315';
    iframeNode.src = `https://www.youtube-nocookie.com/embed/${youtube.videoID}`;
    iframeNode.title = 'YouTube video player';
    iframeNode.allow =
      'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframeNode.allowFullscreen = true;
    iframeNode.style.border = '0';
    iframeWrapperNode.appendChild(iframeNode);
    bodyInnerNode.appendChild(iframeWrapperNode);
  }

  if (html) {
    const htmlWrapperNode = document.createElement('div');
    htmlWrapperNode.classList.add('modal__html');
    if (typeof html === 'string') {
      htmlWrapperNode.insertAdjacentHTML('beforeend', html);
    } else {
      const htmlNode = html.cloneNode(true) as HTMLElement;
      htmlNode.removeAttribute('id'); // Remove id to prevent duplicates within the document
      if (htmlNode.style.display === 'none') {
        htmlNode.style.display = '';
      }
      htmlWrapperNode.appendChild(htmlNode);
    }
    bodyInnerNode.appendChild(htmlWrapperNode);
  }

  bodyNode.appendChild(bodyInnerNode);

  innerNode.appendChild(closeNode);
  innerNode.appendChild(bodyNode);

  node.appendChild(innerNode);

  return { node, innerNode, closeNode };
}

async function removeModal({ node }: NodesProps) {
  document.documentElement.classList.remove('no-scroll');

  node.animate([{ opacity: 1 }, { opacity: 0 }], {
    duration: 150,
    easing: 'ease-out',
  });

  await Promise.allSettled(
    node.getAnimations().map((animation) => animation.finished)
  );

  modalWrapper.removeChild(node);
}

function setModalCloseListeners({ node, innerNode, closeNode }: NodesProps) {
  const handleModalClickOutside = (e: MouseEvent) => {
    const { target } = e;
    if (!innerNode.contains(target as Node)) {
      removeModal({ node, innerNode });
      return cleanupListeners();
    }
  };

  const handleKeyup = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      removeModal({ node, innerNode });
      return cleanupListeners();
    }
  };

  const handleCloseButtonClick = () => {
    removeModal({ node, innerNode });
    return cleanupListeners();
  };

  const cleanupListeners = () => {
    document.removeEventListener('click', handleModalClickOutside);
    document.removeEventListener('keyup', handleKeyup);
    if (closeNode) {
      closeNode.removeEventListener('click', handleCloseButtonClick);
    }
  };

  const setListeners = () => {
    document.addEventListener('click', handleModalClickOutside);
    document.addEventListener('keyup', handleKeyup);
    if (closeNode) {
      closeNode.addEventListener('click', handleCloseButtonClick);
    }
  };

  setListeners();
}

async function addModal({ node, innerNode, closeNode }: NodesProps) {
  // const { matches: motionOK } = window.matchMedia(
  //   '(prefers-reduced-motion: no-preference)'
  // );

  // 1. Add to DOM
  document.documentElement.classList.add('no-scroll');
  modalWrapper.appendChild(node);

  // 2. Animate
  await animateModal({ node, innerNode });

  // 3. Close modal listener
  setModalCloseListeners({ node, innerNode, closeNode });

  return node;
}

function initHTMLApi() {
  const elements = document.querySelectorAll('[data-modal]');
  elements.forEach((el) => {
    el.addEventListener('click', function (e) {
      const currentTarget = e.currentTarget as HTMLAnchorElement;
      const href =
        currentTarget.href || currentTarget.getAttribute('data-href');

      if (!href) {
        return;
      }

      // Parse href into props
      if (/youtu\.?be/.test(href)) {
        // Get Video ID
        const videoID = getYoutubeID(href);
        if (videoID) {
          e.preventDefault();
          init({ youtube: { videoID } });
        }
      }

      return;
    });
  });
}

function init(props: Props) {
  // const modalProps = props || inferProps
  const { node, innerNode, closeNode } = createModal(props);
  addModal({ node, innerNode, closeNode });

  return node;
}

export default function modal() {
  // 1. Attach init function to window
  window.modal = init;

  // 2. Init HTML API
  initHTMLApi();
}
