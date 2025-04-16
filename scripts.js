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
  const searchValue = () => searchInput.val();
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

  function setTopicDropdownValue(value) {
    topicDropdown.find('a > span').text(value);
  }
  function setSortByDropdownValue(value) {
    sortByDropdown.find('a > span').text(value);
  }

  window.playVideo = function() {
    window.location.href = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
  }

  function getCourseCardHTML(course) {
    return $(`
      <div class="col-12 col-sm-4 col-lg-3 d-flex justify-content-center">
              <div class="card"">
                <img
                  src="${course.thumb_url}"
                  class="card-img-top"
                  alt="Video thumbnail"
                />
                <div class="card-img-overlay text-center">
                  <img
                    src="images/play.png"
                    alt="Play"
                    width="64px"
                    class="align-self-center play-overlay"
                    style="cursor: pointer;"
                    onclick="playVideo()"
                  />
                </div>
                <div class="card-body">
                  <h5 class="card-title font-weight-bold">${course.title}</h5>
                  <p class="card-text text-muted">
                    ${course['sub-title']}
                  </p>
                  <div class="creator d-flex align-items-center">
                    <img
                      src="${course.author_pic_url}"
                      alt="Creator of
                      Video"
                      width="30px"
                      class="rounded-circle"
                    />
                    <h6 class="pl-3 m-0 main-color">${course.author}</h6>
                  </div>
                  <div class="info pt-3 d-flex justify-content-between">
                    <div class="rating">
                      ${[...Array(5)].map((_, i) => (`
                          <img src="images/star_${i < course.star ? 'on' : 'off'}.png" alt="star" width="15px" />
                        `)).join('')}
                    </div>
                    <span class="main-color">${course.duration}</span>
                  </div>
                </div>
              </div>
            </div>`);
  }

  function populateDropdown(menu, items, onSelect) {
    items.forEach((item) => {
      const label = snake_case_To_TitleCase(item); // Convert the label to Title Case
      const dropdownItem = $(`<a class="dropdown-item" href="#">${label}</a>`); // Create dropdown item

      dropdownItem.click(() => onSelect(label)); // Run the given function on click
      menu.append(dropdownItem); // Add dropdown item to the dropdown menu
    });
  }

  function loadSearchFilters(data) {
    /*
    * Fetch and store the data from the API endpoint (data)
    * Set the default search value to `q` from the API
    * Populate the `topic` dropdown and set the default value to `topic` from the API
    * Populate the `sort by` dropdown and set the default value to `sort` from the API
    * Set each dropdown menu item to set itself as that dropdown's value on click
    * Run the callback function (callbackFn)
    */

    // Populate both dropdown menus' items
    populateDropdown(topicDropdown.find('.dropdown-menu'), data.topics, (val) => {
      // Apply topic filter and reload videos
      setTopicDropdownValue(val);
      reloadVideos(data.courses, data.sorts);
    });

    populateDropdown(sortByDropdown.find('.dropdown-menu'), data.sorts, (val) => {
      // Apply sort order  and reload videos
      setSortByDropdownValue(val);
      reloadVideos(data.courses, data.sorts);
    });

    // Apply search query and re-search (reload videos) when search input changes
    searchInput.change(() => {
      reloadVideos(data.courses, data.sorts); // I suspect this will cause issues reloading while already loading after a previous change if this runs every time a character is typed or deleted
    });

    // Set the search bar's, topic dropdown's, and sort dropdown's default value based on API data
    searchInput.val(data.q);
    setTopicDropdownValue(snake_case_To_TitleCase(data.topic));
    setSortByDropdownValue(snake_case_To_TitleCase(data.sort));
  }

  function reloadVideos(courses, sorts) {
    coursesContainer.empty()
    loadVideos(courses, sorts); // load all videos
  }

  function loadVideos(courses, sorts) {
    /*
    * Show the loader
    * Get array of videos from API data (courses)
    * Filter the array of videos to account for the search query and topics filter
    * Sort the array according to the selected sort order.
    * Create and inject the HTML cards into the DOM
    * Hide the loader
    */

    // Show the loader
    cLoader.show();

    // Filter the courses
    let filteredCourses = courses.filter((course) => {
      const matchesTopic = topicValue() === 'All' || snake_case_To_TitleCase(course.topic) === topicValue();
      const matchesQuery = searchValue() === "" || searchValue().toLowerCase().split(" ").every((word) => course.keywords.some((keyword) => keyword.toLowerCase().includes(word)));
      return matchesTopic && matchesQuery
    });

    // Sort the courses
    filteredCourses.sort((a, b) => {
      switch (sortValue()) {
        case 'Most Popular':
          return b.star - a.star;
        case 'Most Recent':
          return b.published_at - a.published_at; // Appears to be UNIX timestamps
        case 'Most Viewed':
          return b.views - a.views;
        default: // Unknown sort value - default to sorting by popularity
          console.warn(`Unknown sort value "${sortValue()}". Sorting by "Most Popular" instead.`);
          return b.star - a.star;
      }
    });

    // Create video cards
    filteredCourses.forEach(course => {
      // Create video card      // dang I wish I could just create video cards like that for my PC build. I could use a new GPU. \\
      const videoCard = getCourseCardHTML(course);

      // Inject the video card into he courses container
      coursesContainer.append(videoCard);
    });

    // Show the number of search results
    $('#video-count').text(`${filteredCourses.length} videos`);

    // If nothing matches the given search & filters, append a message saying so
    if (filteredCourses.length === 0) {
      const noResultsMessage = $(`<p class="text-center text-muted my-4 h4 m-auto">No results found.<br><small>Check for typos in your search query.</small></p>`);
      coursesContainer.append(noResultsMessage);
    }

    // Hide the loader
    cLoader.hide();
  }

  function loadCourses(data) {
    /*
    *  -SEARCH & DROPDOWNS-
    * Set the default search value to `q` from the API
    * populate the `topic` dropdown and set the default value to `topic` from the API
    * populate the `sort by` dropdown and set the default value to `sort` from the API
    * load the videos
    * ----------
    *  -VIDEOS-
    * Get array of videos from API data
    * Filter the array of videos to account for the search query and topics filter
    * Sort the array according to the selected sort order.
    * Create and inject the HTML cards into the DOM
    * Remove the loader
    */

    loadSearchFilters(data);
    loadVideos(data.courses, data.sorts);
  }

  /* Courses Loader */
  try { // only do this if Swiper is not defined, this avoids an error on other pages that have Swiper defined and don't have a courses section
    if (Swiper) {}
  } catch (e) {
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

          cLoader.hide();

          const errorMessage = $(`<p class="text-danger text-center h4 m-auto">:(<br>Sorry, something went wrong.<br>Please try again later.</p>`);

          coursesContainer.append(errorMessage);
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
  }
});
