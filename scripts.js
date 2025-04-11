document.addEventListener('DOMContentLoaded', () => {
  const quotesCarousel = document.getElementById('carousel-quotes');
  const loader = document.getElementById('quotes-loader');

  fetch('https://smileschool-api.hbtn.info/quotes')
    .then((response) => response.json())
    .then((data) => {
      loader.remove();

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
      loader.remove();

      const errorMessage = document.createElement('p');

      errorMessage.innerHTML = `:(<br>Sorry, something went wrong.<br>Please try again later.`;
      errorMessage.className = 'text-danger text-center h4';
      quotesCarousel.appendChild(errorMessage);
    });
});
