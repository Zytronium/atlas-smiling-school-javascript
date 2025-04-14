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
  const tCarousel = $('#carouselExampleControls2')
  const tutorialsCarouselInner = $('#carousel-tutorials');
  const tLoader = $('#tutorials-loader');
  let tutorialsLoaded = 0;
  let numbTutorials;
  /* Videos Loading Vars */
  const vCarousel = $('#carouselExampleControls3')
  const videosCarouselInner = $('#carousel-videos');
  const vLoader = $('#videos-loader');
  let videosLoaded = 0;
  let numbVideos;

  getDataLength(tutorialsAPI).then((totalItems) => {
    numbTutorials = totalItems;
  }).catch(function (error) {
    console.error("Error getting data length:", error);
  });

  getDataLength(videosAPI).then((totalItems) => {
    numbVideos = totalItems;
  }).catch(function (error) {
    console.error("Error getting data length:", error);
  });

  function getCardWidth(carouselInner) {
    return carouselInner.find('.card').outerWidth(true);
  }

  function animateCardScroll(carouselInner, direction) {
    if (carouselInner.is(':animated'))
      return;

    const items = carouselInner.find('.carousel-item');
    const currentIndex = items.index(items.filter('.active'));
    const cardWidth = getCardWidth(carouselInner);
    const shiftAmount = direction === 'next' ? -cardWidth : cardWidth;
    const row = carouselInner.find('.carousel-item.active .row.align-items-center.mx-auto');
    const newCard = $('<div class="col-12 col-sm-6 col-md-6 col-lg-3 d-flex justify-content-center justify-content-md-end justify-content-lg-center"></div>');
    // console.log(row);
    // row.css('background', 'red');

    if (direction === 'next') {
      const firstCard = carouselInner.find('.col-12.col-sm-6.col-md-6.col-lg-3').first();
      console.log(firstCard);
      newCard.html(firstCard.innerHTML);
      // firstCard.css('background', 'blue');
      row.append(newCard);
    } else {
      const lastCard = carouselInner.find('.col-12.col-sm-6.col-md-6.col-lg-3').last();
      console.log(lastCard);
      newCard.html(lastCard.innerHTML);
      // lastCard.css('background', 'blue');
      row.prepend(newCard);
    }
    carouselInner.css('left', `-=${shiftAmount}`);

    carouselInner.animate({ left: `+=${shiftAmount}` }, 500, () => {

    });
    items.removeClass('active');
    items.eq((direction === 'next' ? currentIndex + 1 : currentIndex - 1 + items.length) % items.length).addClass('active');
    carouselInner.css('left', 0);
    newCard.remove();
  }

  function getData(api, index) {
    return $.ajax({
      method: 'GET',
      url: api,
      dataType: 'json'
    }).then(function (data) {
      return data[index];
    }).catch(function (xhr, status, error) {
      return {text: error};
    });
  }

  function getDataLength(api) {
    return $.ajax({
      method: 'GET',
      url: api,
      dataType: 'json'
    }).then(function (data) {
      return data.length;
    }).catch(function (xhr, status, error) {
      return error;
    });
  }

  function addClones(carouselInner) {
    const api = carouselInner[0].id === 'carousel-tutorials' ? tutorialsAPI : videosAPI;

    getDataLength(api).then(function (totalItems) {
      // Determine number of items per slide:
      // Desktop: 4 | Tablet: 2 | Mobile: 1
      let cardsPerSlide;
      const winWidth = $(window).width();
      if (winWidth >= 992) {
        cardsPerSlide = 4;
      } else if (winWidth >= 768) {
        cardsPerSlide = 2;
      } else {
        cardsPerSlide = 1;
      }
      const clonesToAdd = cardsPerSlide - 1;

      $(`#${carouselInner[0].id} .carousel-item`).each((index, item) => {
        // Select the row of cards
        const $cardsRow = $(item).find('.row.align-items-center.mx-auto');

        // Loop to add the clones.
        for (let i = 1; i <= clonesToAdd; i++) {
          let cloneIndex = (index + i) % totalItems;

          getData(api, cloneIndex)
            .then(function (data) {
              // Create HTML for the clone card
              const newCard = $(`
                              <div class="col-12 col-sm-6 col-md-6 col-lg-3 d-flex justify-content-center justify-content-md-end justify-content-lg-center">
                                <div class="card">
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

              // Add the cloned card to the row of cards
              $cardsRow.append(newCard);

              // Increment counter for number of cards loaded and check if all are done loading
              if (carouselInner[0].id === 'carousel-tutorials') {
                tutorialsLoaded++;
                if (allTutorialsLoaded()) {
                  tLoader.remove();
                }
              } else {
                videosLoaded++;
                if (allVideosLoaded()) {
                  vLoader.remove();
                }
              }
            })
            .catch(function (error) {
              console.error("Error fetching clone data:", error);
            });
        }
      });
    }).catch(function (error) {
      console.error("Error getting data length:", error);
    });
  }

  function allTutorialsLoaded() {
    if (typeof numbTutorials === 'number') {
      // Determine number of items per slide:
      // Desktop: 4 | Tablet: 2 | Mobile: 1
      let cardsPerSlide;
      const winWidth = $(window).width();
      if (winWidth >= 992) {
        cardsPerSlide = 4;
      } else if (winWidth >= 768) {
        cardsPerSlide = 2;
      } else {
        cardsPerSlide = 1;
      }
      return cardsPerSlide * numbTutorials === tutorialsLoaded;
    } else {
      console.log(numbTutorials);
      return false;
    }
  }

  function allVideosLoaded() {
    if (typeof numbVideos === 'number') {
      // Determine number of items per slide:
      // Desktop: 4 | Tablet: 2 | Mobile: 1
      let cardsPerSlide;
      const winWidth = $(window).width();
      if (winWidth >= 992) {
        cardsPerSlide = 4;
      } else if (winWidth >= 768) {
        cardsPerSlide = 2;
      } else {
        cardsPerSlide = 1;
      }
      return cardsPerSlide * numbVideos === videosLoaded;
    } else {
      console.log(numbVideos);
      return false;
    }
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
  })

  /* Tutorials Loader */
  $.ajax({
    method: 'GET',
    url: tutorialsAPI,
    dataType: 'json',
    success: function (data) {
      data.forEach((tutorial, index) => {
        const item = $(`<div class="carousel-item${index === 0 ? ' active' : ''}">`);

        item.html(`
                <div class="row align-items-center mx-auto">
                  <div
                    class="col-12 col-sm-6 col-md-6 col-lg-3 d-flex justify-content-center justify-content-md-end justify-content-lg-center"
                  >
                    <div class="card">
                      <img
                        src="${tutorial.thumb_url}"
                        class="card-img-top"
                        alt="${tutorial.title}"
                      />
                      <div class="card-img-overlay text-center">
                        <img
                          src="images/play.png"
                          alt="Play"
                          width="64px"
                          class="align-self-center play-overlay"
                        />
                      </div>
                      <div class="card-body">
                        <h5 class="card-title font-weight-bold">
                          ${tutorial.title}
                        </h5>
                        <p class="card-text text-muted">
                          ${tutorial['sub-title']}
                        </p>
                        <div class="creator d-flex align-items-center">
                          <img
                            src="${tutorial.author_pic_url}"
                            alt="Creator of Video"
                            width="30px"
                            class="rounded-circle"
                          />
                          <h6 class="pl-3 m-0 main-color">${tutorial.author}</h6>
                        </div>
                        <div class="info pt-3 d-flex justify-content-between">
                          <div class="rating">
                          ${[...Array(5)].map((_, i) => (`
                            <img
                              src="images/star_${i < tutorial.star ? 'on' : 'off'}.png"
                              alt="star on"
                              width="15px"
                              />
                          `)).join('')}
                          </div>
                          <span class="main-color">${tutorial.duration}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                `);

        tutorialsCarouselInner.append(item);
        tutorialsLoaded++;
      });

      addClones(tutorialsCarouselInner);
    },
    error: function (xhr, status, error) {
      console.error('Error loading the tutorials: ', error);
      tLoader.remove();

      const errorMessage = $(`<p class="text-danger text-center h4 m-auto">:(<br>Sorry, something went wrong.<br>Please try again later.</p>`);

      tutorialsCarouselInner.append(errorMessage);
    }
  });
  /* Popular Videos Loader */
  $.ajax({
    method: 'GET',
    url: videosAPI,
    dataType: 'json',
    success: function (data) {
      data.forEach((video, index) => {
        const item = $(`<div class="carousel-item${index === 0 ? ' active' : ''}">`);

        item.html(`
                <div class="row align-items-center mx-auto">
                  <div
                    class="col-12 col-sm-6 col-md-6 col-lg-3 d-flex justify-content-center justify-content-md-end justify-content-lg-center"
                  >
                    <div class="card">
                      <img
                        src="${video.thumb_url}"
                        class="card-img-top"
                        alt="${video.title}"
                      />
                      <div class="card-img-overlay text-center">
                        <img
                          src="images/play.png"
                          alt="Play"
                          width="64px"
                          class="align-self-center play-overlay"
                        />
                      </div>
                      <div class="card-body">
                        <h5 class="card-title font-weight-bold">
                          ${video.title}
                        </h5>
                        <p class="card-text text-muted">
                          ${video['sub-title']}
                        </p>
                        <div class="creator d-flex align-items-center">
                          <img
                            src="${video.author_pic_url}"
                            alt="Creator of Video"
                            width="30px"
                            class="rounded-circle"
                          />
                          <h6 class="pl-3 m-0 main-color">${video.author}</h6>
                        </div>
                        <div class="info pt-3 d-flex justify-content-between">
                          <div class="rating">
                          ${[...Array(5)].map((_, i) => (`
                            <img
                              src="images/star_${i < video.star ? 'on' : 'off'}.png"
                              alt="star on"
                              width="15px"
                              />
                          `)).join('')}
                          </div>
                          <span class="main-color">${video.duration}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                `);

        videosCarouselInner.append(item);
        videosLoaded++;
      });

      addClones(videosCarouselInner);
    },
    error: function (xhr, status, error) {
      console.error('Error loading the videos: ', error);
      vLoader.remove();

      const errorMessage = $(`<p class="text-danger text-center h4 m-auto">:(<br>Sorry, something went wrong.<br>Please try again later.</p>`);

      videosCarouselInner.append(errorMessage);
    }
  });

  tCarousel.find('.carousel-control-next').click((event) => {
    event.preventDefault();
    animateCardScroll(tutorialsCarouselInner, 'next');
  });

  tCarousel.find('.carousel-control-prev').click((event) => {
    event.preventDefault();
    animateCardScroll(tutorialsCarouselInner, 'prev');
  });

  vCarousel.find('.carousel-control-next').click((event) => {
    event.preventDefault();
    animateCardScroll(videosCarouselInner, 'next');
  });

  vCarousel.find('.carousel-control-prev').click((event) => {
    event.preventDefault();
    animateCardScroll(videosCarouselInner, 'prev');
  });

});
