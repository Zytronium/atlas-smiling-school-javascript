$(document).ready(() => {
    /* APIs (for placeholders while the real one is down) */
    const quotesAPI = 'placeholder-api/quotes.json' // online: 'https://smileschool-api.hbtn.info/quotes'
    const tutorialsAPI = 'placeholder-api/popular-tutorials.json' // online: 'https://smileschool-api.hbtn.info/popular-tutorials'
    const videosAPI = 'placeholder-api/latest-videos.json' // online: 'https://smileschool-api.hbtn.info/latest-videos'
    /* Quotes Loading Vars */
    const quotesCarousel = $('#carousel-quotes');
    const qLoader = $('#quotes-loader');
    /* Tutorials Loading Vars */
    const tutorialsCarousel = $('#carousel-tutorials');
    const tLoader = $('#tutorials-loader');

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

            console.log(`carousel ID: ${carouselInner[0].id}`);
            console.log($(`#${carouselInner[0].id} .carousel-item`));

            $(`#${carouselInner[0].id} .carousel-item`).each((index, item) => {
                // Select the row of cards
                const $cardsRow = $(item).find('.row.align-items-center.mx-auto');
                console.log($cardsRow);

                // Loop to add the clones.
                for (let i = 1; i <= clonesToAdd; i++) {
                    let cloneIndex = (index + i) % totalItems;

                    getData(api, cloneIndex)
                        .then(function (data) {
                            console.log(data);
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

    /* Quotes Loader */
    $.ajax({
        method: 'GET',
        url: quotesAPI,
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

                quotesCarousel.append(item);
            });
        },
        error: function (xhr, status, error) {
            console.error('Error loading the quotes: ', error);
            qLoader.remove();

            const errorMessage = $(`<p class="text-danger text-center h4">:(<br>Sorry, something went wrong.<br>Please try again later.</p>`);

            quotesCarousel.append(errorMessage);
        }
    })

    /* Tutorials Loader */
    $.ajax({
        method: 'GET',
        url: tutorialsAPI,
        dataType: 'json',
        success: function (data) {
            tLoader.remove();

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

                tutorialsCarousel.append(item);
            });

            addClones(tutorialsCarousel)
        },
        error: function (xhr, status, error) {
            console.error('Error loading the tutorials: ', error);
            tLoader.remove();

            const errorMessage = $(`<p class="text-danger text-center h4">:(<br>Sorry, something went wrong.<br>Please try again later.</p>`);

            tutorialsCarousel.append(errorMessage);
        }
    });
});
