const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3YzI1ZWJhMWQxYTM1OWUxYzRiMjZhOGM4ZGIzMzlmNyIsInN1YiI6IjY2MTkyOGYyYjlhMGJkMDE3YzExOGY4YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.jCNSUsqC_CQyv0dd2N3kT7OFl54WuHWR9dlmQ2iTOag`
  },
};

const MAX_RESULTS = 12;
const trailerUrls = [];

function fetchNewMovies(apiUrl, containerId) {
  fetch(apiUrl, options)
    .then((response) => response.json())
    .then((data) => {
      const movieContainer = document.getElementById(containerId);
      const cardColumn = document.createElement("div");
      cardColumn.classList.add(
        "row",
        "row-cols-1",
        "row-cols-md-2",
        "row-cols-lg-4"
      );

      data.results.forEach((movie, index) => {
        const handleClick = () => {
          getMovieById(movie.id);

          // Comprobar si ya existe la URL del trailer en trailerUrls
          const trailerIndex = trailerUrls.findIndex(
            (item) => item.title === movie.title
          );

          if (trailerIndex !== -1) {
            const trailerUrl = trailerUrls[trailerIndex].url;
            showTrailer(trailerUrl);
          } else {
            getTrailerByTitle(movie.title);
          }
          showModal(movie);
        };

        if (index < MAX_RESULTS) {
          const card = document.createElement("div");
          card.classList.add("col", "mb-4");

          card.innerHTML = `
            <div class="card booking-card v-2 rounded-bottom">
              <div class="bg-image hover-overlay ripple ripple-surface ripple-surface-light" data-mdb-ripple-color="light">
                <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" class="img-thumbnail card-img">
              </div>
              <div class="card-body">
                <h4 class="card-title font-weight-bold movie-title"><a>${movie.title}</a></h4>
                <ul class="list-unstyled list-inline mb-2">
                  <li class="list-inline-item me-0"><i class="fas fa-star text-warning fa-xs"></i></li>
                  <li class="list-inline-item me-0"><i class="fas fa-star text-warning fa-xs"></i></li>
                  <li class="list-inline-item me-0"><i class="fas fa-star text-warning fa-xs"></i></li>
                  <li class="list-inline-item me-0"><i class="fas fa-star text-warning fa-xs"></i></li>
                  <li class="list-inline-item me-0"><i class="fas fa-star text-warning fa-xs"></i></li>
                </ul>
                <p class="card-text overview">${movie.overview}</p>
                <hr class="my-4" />
              </div>
            </div>`;

          card.addEventListener("click", handleClick);
          cardColumn.appendChild(card);
        }
      });

      movieContainer.appendChild(cardColumn);
    })
    .catch((err) => console.error(err));
}

function getMovieById(idMovie) {
  fetch(
    `https://api.themoviedb.org/3/movie/${idMovie}?include_adult=false&include_video=true&language=es-AR&page=1&sort_by=popularity.desc`,
    options
  )
    .then((response) => response.json())
    .then((data) => {})
    .catch((error) => {
      console.error("Error fetching movie:", error);
    });
}

async function getTrailerByTitle(movieTitle) {
  const response = await fetch(
    `http://localhost:3000/trailer/${encodeURIComponent(
      movieTitle
    )}+trailer`
  );
  const data = await response.json();

  if (response.ok) {
    let { url } = data;
    const videoId = getVideoId(url);
    url = `https://www.youtube.com/embed/${videoId}`;
    trailerUrls.push({ title: movieTitle, url: url });
    showTrailer(url);
  } else {
    console.error("Error:", data.error);
    showTrailer("assets/video/404.mp4");
  }
}

function showModal(movie) {
  const modalTitle = document.getElementById("modalTitle");
  const modalBody = document.getElementById("modalBody");

  modalTitle.textContent = movie.title;
  modalBody.innerHTML = `
  <div class="col">
    <div class="row">
      <div class="bg-image hover-overlay ripple ripple-surface ripple-surface-light col-12 col-md-4 col-lg-5 col-xl-3 d-none d-md-block">
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" class="card-img h-100">
      </div> 
      <div class="hover-overlay ripple ripple-surface ripple-surface-light col-12 col-md-8 col-lg-7 col-xl-9">
        <div class="ratio ratio-16x9 embed-responsive embed-responsive-16by9 h-100" id="trailer-container"></div>
      </div>
    </div>
  </div>
  <div class="card-body">
    <ul class="list-unstyled list-inline mb-2">
      <li class="list-inline-item me-0"><i class="fas fa-star text-warning fa-xs"></i></li>
      <li class="list-inline-item me-0"><i class="fas fa-star text-warning fa-xs"></i></li>
      <li class="list-inline-item me-0"><i class="fas fa-star text-warning fa-xs"></i></li>
      <li class="list-inline-item me-0"><i class="fas fa-star text-warning fa-xs"></i></li>
      <li class="list-inline-item me-0"><i class="fas fa-star text-warning fa-xs"></i></li>
    </ul>
    <p class="card-text overview">${movie.overview}</p>
  </div>`;

  const trailerContainer = document.getElementById("trailer-container");
  const trailerUrl = trailerUrls.find(
    (item) => item.title === movie.title
  )?.url;

  if (trailerUrl) {
    trailerContainer.innerHTML = `<iframe class="embed-responsive-item" width="100%" height="100%" src="${trailerUrl}" frameborder="0" allowfullscreen></iframe>`;
  } else {
    getTrailerByTitle(movie.title);
  }

  const movieModal = new bootstrap.Modal(document.getElementById("movieModal"));
  movieModal.show();

  // Detener el video cuando el modal se cierra
  movieModal._element.addEventListener("hidden.bs.modal", function () {
    const trailerContainer = document.getElementById("trailer-container");
    if (trailerContainer) {
      const iframe = trailerContainer.querySelector("iframe");
      if (iframe) {
        iframe.src = "";
      }
    }
  });
}

function showTrailer(url) {
  const trailerContainer = document.getElementById("trailer-container");
  if (trailerContainer) {
    trailerContainer.innerHTML = "";

    const iframe = document.createElement("iframe");
    iframe.setAttribute("width", "100%");
    iframe.setAttribute("height", "100%");
    iframe.setAttribute("src", url);
    iframe.setAttribute("frameborder", "0");
    iframe.setAttribute("allowfullscreen", "");

    trailerContainer.appendChild(iframe);
  } else {
    console.error("Trailer container not found.");
  }
}

function getVideoId(url) {
  const startIndex = url.indexOf("v=");
  if (startIndex !== -1) {
    let videoId = url.substring(startIndex + 2);
    const endIndex = videoId.indexOf("&");
    if (endIndex !== -1) {
      videoId = videoId.substring(0, endIndex);
    }
    return videoId;
  }
  return null;
}

// Cargar los estrenos y otros géneros
const estrenosUrl = "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=true&language=es-AR&page=1&sort_by=popularity.desc";
fetchNewMovies(estrenosUrl, "movie-container");

const documentalesUrl = "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=true&language=es-AR&page=1&sort_by=popularity.desc&with_genres=99";
fetchNewMovies(documentalesUrl, "documentary-container");

const animadasUrl = "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=true&language=es-AR&page=1&sort_by=popularity.desc&with_genres=16";
fetchNewMovies(animadasUrl, "animated-container");
