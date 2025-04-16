$(document).ready(() => {
  /* API Endpoints */
  const quotesAPI = 'https://smileschool-api.hbtn.info/quotes';
  const tutorialsAPI = 'https://smileschool-api.hbtn.info/popular-tutorials';
  const videosAPI = 'https://smileschool-api.hbtn.info/latest-videos';
  const coursesAPI = 'https://smileschool-api.hbtn.info/courses';
  /* Fallback API Endpoints (in case the API goes down again) */
  const fallbackQuotesAPI = 'https://zytronium.github.io/smileschool-api-placeholder/quotes.json';
  const fallbackTutorialsAPI = 'https://zytronium.github.io/smileschool-api-placeholder/popular-tutorials.json';
  const fallbackVideosAPI = 'https://zytronium.github.io/smileschool-api-placeholder/latest-videos.json';
  const fallbackCoursesAPI = 'https://zytronium.github.io/smileschool-api-placeholder/courses.json';

  /* Quotes Loading Vars */
  const quotesCarouselInner = $('#carousel-quotes');
  const qLoader = $('#quotes-loader');
  /* Tutorials Loading Vars */
  const tutorialsCarouselInner = $('#carousel-tutorials');
  const tLoader = $('#tutorials-loader');
  /* Videos Loading Vars */
  const videosCarouselInner = $('#carousel-videos');
  const vLoader = $('#videos-loader');
  /* Courses Loading Vars */
  const searchInput = $('#search-keywords-input');
  const topicDropdown = $('#topic-dropdown');
  const sortByDropdown = $('#sort-by-dropdown');
  const coursesContainer = $('#courses-container');
  const cLoader = $('#courses-loader');
  /* Course search, filter, & sort values */
  const searchValue = () => searchInput.value;
  const topicValue = () => topicDropdown.find('a > span').text();
  const sortValue = () => sortByDropdown.find('a > span').text();

  function getCardHTML(data) {
    return $(`
              <div class="swiper-slide">
                <div class="card m-auto">
                  <img src="${data.thumb_url}" class="card-img-top" alt="${data.title}" />
                  <div class="card-img-overlay text-center">
                    <img src="images/play.png" alt="Play" width="64px" class="align-self-center play-overlay" />
                  </div>
                  <div class="card-body">
                    <h5 class="card-title font-weight-bold">${data.title}</h5>
                    <p class="card-text text-muted">${data['sub-title']}</p>
                    <div class="creator d-flex align-items-center">
                      <img src="${data.author_pic_url}" alt="Creator of Video" width="30px" class="rounded-circle" />
                      <h6 class="pl-3 m-0 main-color">${data.author}</h6>
                    </div>
                    <div class="info pt-3 d-flex justify-content-between">
                      <div class="rating">
                        ${[...Array(5)].map((_, i) => (`
                          <img src="images/star_${i < data.star ? 'on' : 'off'}.png" alt="star" width="15px" />
                        `)).join('')}
                      </div>
                      <span class="main-color">${data.duration}</span>
                    </div>
                  </div>
                </div>
              </div>
            `);
  }

  function initializeSwiper(carouselSelector) {
    new Swiper(carouselSelector, {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: true,
      breakpoints: {
        768: {
          slidesPerView: 2,
        },
        992: {
          slidesPerView: 4,
        }
      },
      navigation: {
        nextEl: carouselSelector + '-next',
        prevEl: carouselSelector + '-prev'
      }
    });
  }

  function loadCarouselHelper(data, loader, carousel, swiperContainerID) {
    let maxCardsPerSlide = 4; // Future-proof: set to 4 instead of setting based on window size in case the user later resizes from mobile/tablet to desktop size
    let totalCards = 0;

    loader.remove();

    // Append all cards and THEN duplicate them until there are more cards than the max number of cards per slide to always allow looping
    do {
      data.forEach((item) => {
        carousel.append(getCardHTML(item));
      });

      totalCards += data.length;
    } while (totalCards <= maxCardsPerSlide);

    initializeSwiper(`#${swiperContainerID}`);
  }

  function loadCarousel(api, fallbackAPI, carousel, loader, swiperContainerID) {
    $.ajax({
      url: api,
      method: 'GET',
      dataType: 'json',
      error: () => $.ajax({
        url: fallbackAPI,
        method: 'GET',
        dataType: 'json',
        error: () => {
          console.error('Unable to fetch fallback API');
          loader.remove();

          const errorMessage = $(`<p class="text-danger text-center h4 pb-5 m-auto">:(<br>Sorry, something went wrong.<br>Please try again later.</p>`);

          carousel.append(errorMessage);
        }
      }).then((data) => {
        console.warn('Failed to fetch data from API. Trying fallback API.')
        loadCarouselHelper(data, loader, carousel, swiperContainerID);
      })
    }).then((data) => {
      loadCarouselHelper(data, loader, carousel, swiperContainerID);
    });
  }

  function loadQuotesCarousel (data) {
    qLoader.remove();

    data.forEach((quote, index) => {
      const item = $(`<div class="carousel-item${index === 0 ? ' active' : ''}">`);

      item.html(`
                <div class="row mx-auto align-items-center">
                  <div class="col-12 col-sm-2 col-lg-2 offset-lg-1 text-center">
                    <img
                      src="${quote.pic_url}"
                      class="d-block align-self-center"
                      alt="${quote.name}"
                    />
                  </div>
                  <div class="col-12 col-sm-7 offset-sm-2 col-lg-9 offset-lg-0">
                    <div class="quote-text">
                      <p class="text-white">${quote.text}</p>
                      <h4 class="text-white font-weight-bold">${quote.name}</h4>
                      <span class="text-white">${quote.title}</span>
                    </div>
                  </div>
                </div>
                `);

      quotesCarouselInner.append(item);
    });
  }

  /* Quotes Loader */
  $.ajax({
    method: 'GET',
    url: fallbackQuotesAPI,
    dataType: 'json',
    error: () => $.ajax({
      method: 'GET',
      url: quotesAPI,
      dataType: 'json',
      error: (xhr, status, error) => {
        console.error('Unable to fetch fallback quotes API: ', error);
        qLoader.remove();

        const errorMessage = $(`<p class="text-warning text-center h4">:(<br>Sorry, something went wrong.<br>Please try again later.</p>`);

        quotesCarouselInner.append(errorMessage);
      },
      success: (data) => {
        console.warn('Failed to fetch data from API. Trying fallback API.')
        loadQuotesCarousel(data);
      }
    }),
    success: (data) => {
      loadQuotesCarousel(data);
    }
  });
  /* Popular Tutorials Loader */
  loadCarousel(tutorialsAPI, fallbackTutorialsAPI, tutorialsCarouselInner, tLoader, 'swiper-tutorials');
  /* Latest Videos Loader */
  loadCarousel(videosAPI, fallbackVideosAPI, videosCarouselInner, vLoader, 'swiper-videos');

  /* ------------------------------- Courses ------------------------------- */

  // Converts a "snake_case" string to a "Title Case" string, as seen in this sentence.
  function snake_case_To_TitleCase(str) { // I am aware this is a highly unusual naming convention
    return str
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  function loadSearchFilters(data, callbackFn) {
    /* todo:
    *   Fetch and store the data from the API endpoint (data)
    *   Set the default search value to `q` from the API
    *   populate the `topic` dropdown and set the default value to `topic` from the API
    *   populate the `sort by` dropdown and set the default value to `sort` from the API
    *   set each dropdown menu item to set itself as that dropdown's value on click
    *   run the callback function (callbackFn)
    */

    // Populate topic dropdown items
    data.topics.forEach((topic) => {
      const dropdownItem = $(`<a class="dropdown-item" href="#">${snake_case_To_TitleCase(topic)}</a>`);
      topicDropdown.find('.dropdown-menu').append(dropdownItem);
    });

    // Populate sort by dropdown items
    data.sorts.forEach((sort) => {
      const dropdownItem = $(`<a class="dropdown-item" href="#">${snake_case_To_TitleCase(sort)}</a>`);
      sortByDropdown.find('.dropdown-menu').append(dropdownItem);
    });

    // Set the search bar's, topic dropdown's, and sort dropdown's default value based on API data
    searchInput.value = data.q;
    topicDropdown.find('a > span').text(snake_case_To_TitleCase(data.topic));
    sortByDropdown.find('a > span').text(snake_case_To_TitleCase(data.sort));

    if (callbackFn) {
      callbackFn(data.courses, sortValue());
    }
  }

  function loadVideos(courses, sort) {
    /* todo:
    *   Get array of videos from API data (courses)
    *   Filter the array of videos to account for the search query and topics filter
    *   Sort the array according to the selected sort order.
    *   Create and inject the HTML cards into the DOM
    *   Remove the loader
    */
  }

  function loadCourses(data) {
    /* todo:
    *    -SEARCH & DROPDOWNS-
    *   Set the default search value to `q` from the API
    *   populate the `topic` dropdown and set the default value to `topic` from the API
    *   populate the `sort by` dropdown and set the default value to `sort` from the API
    *   load the videos
    *   ----------
    *    -VIDEOS-
    *   Get array of videos from API data
    *   Filter the array of videos to account for the search query and topics filter
    *   Sort the array according to the selected sort order.
    *   Create and inject the HTML cards into the DOM
    *   Remove the loader
    */

    loadSearchFilters(data, loadVideos);
  }

  /* Courses Loader */
  $.ajax({
    method: 'GET',
    url: coursesAPI,
    dataType: 'json',
    error: () => $.ajax({
      method: 'GET',
      url: fallbackCoursesAPI,
      dataType: 'json',
      error: (xhr, status, error) => {
        console.error('Unable to fetch courses API or fallback API: ', error);
        // todo
      },
      success: (data) => {
        console.warn('Unable to fetch courses API. Fetched from fallback API instead.');
        loadCourses(data);
      }
    }),
    success: (data) => {
      loadCourses(data);
    }
  });

});
