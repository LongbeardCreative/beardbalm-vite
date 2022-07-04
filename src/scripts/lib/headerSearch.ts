import debounce from 'just-debounce-it';
import { hideOnClickOutside, removeChildren } from '../utils/helpers';

declare const siteData: {
  siteUrl: string;
};

export default function headerSearch() {
  function initHeaderSearch(wrapper: HTMLElement) {
    const trigger = wrapper.querySelector(
      '[data-js="header-search-toggle"]'
    ) as HTMLButtonElement;
    const searchBox = wrapper.querySelector(
      '[data-js="header-search-box"]'
    ) as HTMLElement;
    const searchResults = wrapper.querySelector(
      '[data-js="header-search-results"]'
    ) as HTMLElement;
    const form = wrapper.querySelector<HTMLFormElement>('form');
    const input = form?.querySelector<HTMLInputElement>('input[type="search"]');

    if (!searchResults || !form || !input) {
      return;
    }

    function toggleSearchBox() {
      if (!searchBox || !input) {
        return;
      }

      searchBox.classList.toggle('active');

      if (searchBox.classList.contains('active')) {
        // Focus on the input
        input.focus();
        document.documentElement.classList.add('mobile-menu-open');
        hideOnClickOutside(searchBox, wrapper, () => {
          document.documentElement.classList.remove('mobile-menu-open');
        });
      } else {
        input.blur();
        document.documentElement.classList.remove('mobile-menu-open');
      }
    }

    function setSkeleton() {
      if (searchResults.querySelector('.skeleton-wrapper')) {
        return;
      }

      const skeletonHtml = `<ul class="skeleton-wrapper">
       <li><h5 class="skeleton">&nbsp;</h5>
        <ul>
         <li class="skeleton">&nbsp;</li>
         <li class="skeleton">&nbsp;</li>
         <li class="skeleton">&nbsp;</li>
        </ul>
       </li>
       <li><h5 class="skeleton">&nbsp;</h5>
        <ul>
         <li class="skeleton">&nbsp;</li>
         <li class="skeleton">&nbsp;</li>
        </ul>
       </li>
      </ul>`;
      // Delete current content
      removeChildren(searchResults);
      // Replace
      searchResults.insertAdjacentHTML(
        'afterbegin',
        `<div class="header__search__results__inner">${skeletonHtml}</div>`
      );
    }

    function processResults(
      results: {
        type?: string;
        full_name?: string;
        title: { rendered: string };
        link: string;
      }[]
    ) {
      let html = '';
      const types = ['Post', 'Page', 'Program', 'Faculty'];

      if (results.length) {
        for (let i = 0; i < types.length; i += 1) {
          // 1. Filter results according to type
          const filteredResults = results.filter((result) => {
            if (types[i] === 'Faculty') {
              return !!result.full_name;
            }
            return result.type === types[i].toLowerCase();
          });

          if (filteredResults.length > 0) {
            html += `<li><h5 class="post-type">${types[i]}</h5>`;
            html += `<ul>`;
            for (let j = 0; j < filteredResults.length; j += 1) {
              const { title, link, full_name: fullName } = filteredResults[j];
              html += `<li><a href="${link}">${
                title?.rendered || fullName
              }</a></li>`;
            }
            html += `</ul></li>`;
          }
        }
      }

      const finalHtml = html
        ? `<ul>${html}</ul>`
        : `<ul><li class="no-results">No results are found.</li></ul>`;

      // Delete current content
      removeChildren(searchResults);
      // Replace
      searchResults.insertAdjacentHTML(
        'afterbegin',
        `<div class="header__search__results__inner">${finalHtml}</div>`
      );
    }

    async function fetchSearchResults(query: string) {
      try {
        const results = await fetch(
          `${siteData.siteUrl}/wp-json/relevanssi/v1/search?search=${query}`
        ).then((res) => res.json());
        processResults(results);
      } catch (err) {
        console.error(
          `Error: ${err}\n\nEnsure that you have set up Relevanssi Pro plugin with a custom search REST API endpoint.`
        );
        removeChildren(searchResults);
        searchResults.insertAdjacentHTML(
          'afterbegin',
          `<div class="header__search__results__inner"><p>Error searching for posts</p></div>`
        );
      }
    }

    const getDebouncedInputValue = debounce(async () => {
      if (input.value) {
        await fetchSearchResults(input.value);
      } else {
        removeChildren(searchResults);
      }
    }, 500);

    const handleInputKeyup = () => {
      setSkeleton();
      getDebouncedInputValue();
    };

    const handleInputClear = () => {
      removeChildren(searchResults);
    };

    const handleFormSubmit = async () => {
      if (input.value) {
        await fetchSearchResults(input.value);
      } else {
        removeChildren(searchResults);
      }
    };

    if (trigger) {
      trigger.addEventListener('click', toggleSearchBox);
    }
    input.addEventListener('keyup', handleInputKeyup);
    input.addEventListener('search', handleInputClear);
    form.addEventListener('submit', handleFormSubmit);
  }

  const wrappers = document.querySelectorAll(
    '[data-js="header-search"]'
  ) as NodeListOf<HTMLElement>;
  for (let i = 0; i < wrappers.length; i += 1) {
    initHeaderSearch(wrappers[i]);
  }
}
