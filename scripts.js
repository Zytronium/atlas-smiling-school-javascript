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

  function loadCarousel(api, fallbackAPI, carousel, loader, swiperContainerID) {
    $.ajax({
      url: api,
      method: 'GET',
      dataType: 'json',
      error: () => $.ajax({
        url: fallbackAPI,
        method: 'GET',
        dataType: 'json'
      })
    }).then((data) => {
      let maxCardsPerSlide = 4; // Future-proof: set to 4 instead of setting based on window size in case the user later resizes from mobile/tablet to desktop size
      let totalCards = 0;

      loader.remove();

      // Append all cards and THEN duplicate them until there are more cards than the max number of cards per slide to always allow looping
      do {
        data.forEach((item) => {
          carousel.append(getCardHTML(item));
        });

        totalCards += data.length;
      } while(totalCards <= maxCardsPerSlide);

      initializeSwiper(`#${swiperContainerID}`);
    });
  }

  /* Quotes Loader */
  $.ajax({
    method: 'GET',
    url: fallbackQuotesAPI,
    dataType: 'json',
    success: function (data) {
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
    },
    error: function (xhr, status, error) {
      console.error('Error loading the quotes: ', error);
      qLoader.remove();

      const errorMessage = $(`<p class="text-danger text-center h4">:(<br>Sorry, something went wrong.<br>Please try again later.</p>`);

      quotesCarouselInner.append(errorMessage);
    }
  });
  /* Popular Tutorials Loader */
  loadCarousel(tutorialsAPI, fallbackTutorialsAPI, tutorialsCarouselInner, tLoader, 'swiper-tutorials');
  /* Latest Videos Loader */
  loadCarousel(videosAPI, fallbackVideosAPI, videosCarouselInner, vLoader, 'swiper-videos');
});
