document.addEventListener('DOMContentLoaded', () => {
  /* APIs (for placeholders while the real one is down) */
  const quotesAPI = 'placeholder-api/quotes.json' // online: 'https://smileschool-api.hbtn.info/quotes'
  const tutorialsAPI = 'placeholder-api/popular-tutorials.json' // online: 'https://smileschool-api.hbtn.info/popular-tutorials'
  const videosAPI = 'placeholder-api/latest-videos.json' // online: 'https://smileschool-api.hbtn.info/latest-videos'
  /* Quotes Loading Vars */
  const quotesCarousel = document.getElementById('carousel-quotes');
  const qLoader = document.getElementById('quotes-loader');
  /* Tutorials Loading Vars */
  const tutorialsCarousel = document.getElementById('carousel-tutorials');
  const tLoader = document.getElementById('tutorials-loader');

  /* Quotes Loader */
  fetch(quotesAPI)
    .then((response) => response.json())
    .then((data) => {
      qLoader.remove();

      data.forEach((quote, index) => {
        const item = document.createElement('div');

        item.className = "carousel-item"
        if (index === 0)
          item.classList.add("active");

        item.innerHTML = `
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
        `;

        quotesCarousel.appendChild(item);
      });
    })
    .catch((error) => {
      console.error('Error loading the quotes: ', error);
      qLoader.remove();

      const errorMessage = document.createElement('p');

      errorMessage.innerHTML = `:(<br>Sorry, something went wrong.<br>Please try again later.`;
      errorMessage.className = 'text-danger text-center h4';
      quotesCarousel.appendChild(errorMessage);
    });

  /* Tutorials Loader */
  fetch(tutorialsAPI)
    .then((response) => response.json())
    .then((data) => {
      tLoader.remove();

      data.forEach((tutorial, index) => {
        const item = document.createElement('div');

        item.className = "carousel-item"
        if (index === 0)
          item.classList.add("active");

        item.innerHTML = `
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
        `;

        tutorialsCarousel.appendChild(item);
      });
    })
    .catch((error) => {
      console.error('Error loading the tutorials: ', error);
      tLoader.remove();

      const errorMessage = document.createElement('p');

      errorMessage.innerHTML = `:(<br>Sorry, something went wrong.<br>Please try again later.`;
      errorMessage.className = 'text-danger text-center h4';
      tutorialsCarousel.appendChild(errorMessage);
    });
});
