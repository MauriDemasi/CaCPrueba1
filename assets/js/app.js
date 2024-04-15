// Lugar donde deseas mostrar las tarjetas de películas
const movieContainer = document.getElementById("movie-container");

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3YzI1ZWJhMWQxYTM1OWUxYzRiMjZhOGM4ZGIzMzlmNyIsInN1YiI6IjY2MTkyOGYyYjlhMGJkMDE3YzExOGY4YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.jCNSUsqC_CQyv0dd2N3kT7OFl54WuHWR9dlmQ2iTOag",
  },
};

// Hacer la solicitud a la API
fetch(
  "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=es-AR&page=1&sort_by=popularity.desc",
  options
)
  .then((response) => response.json())
  .then((data) => {
    // Iterar sobre los resultados de la API
    data.results.forEach((movie) => {
      // Crear elemento de tarjeta
      const card = document.createElement("div");
      card.classList.add(
        "card",
        "col-xl-3", // 4 tarjetas en pantallas extra grandes
        "col-lg-4", // 3 tarjetas en pantallas grandes
        "col-md-6", // 2 tarjetas en pantallas medianas
        "col-sm-12", // 1 tarjeta en pantallas pequeñas
        "w-100", // Asegura que la tarjeta ocupe todo el ancho disponible
        "booking-card",
        "v-2",
        "rounded-bottom"
      );

      // Construir contenido de la tarjeta
      card.innerHTML = `
        <div class="bg-image hover-overlay ripple ripple-surface ripple-surface-light" data-mdb-ripple-color="light">
          <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" class="img-thumbnail">
        </div>
        <div class="card-body">
          <h5 class="card-title font-weight-bold"><a>${movie.title}</a></h5>
          <ul class="list-unstyled list-inline mb-0">
            <li class="list-inline-item me-0">
              <i class="fas fa-star text-warning fa-xs"> </i>
            </li>
            <li class="list-inline-item me-0">
              <i class="fas fa-star text-warning fa-xs"></i>
            </li>
            <li class="list-inline-item me-0">
              <i class="fas fa-star text-warning fa-xs"></i>
            </li>
            <li class="list-inline-item me-0">
              <i class="fas fa-star text-warning fa-xs"></i>
            </li>
            <li class="list-inline-item">
              <i class="fas fa-star-half-alt text-warning fa-xs"></i>
            </li>
            <li class="list-inline-item">
              <p class="text-muted">${movie.vote_average} (${movie.vote_count})</p>
            </li>
          </ul>
          <p class="card-text">
            ${movie.overview}
          </p>
          <hr class="my-4" />
        </div>
      `;

      // Agregar la tarjeta al contenedor de películas
      movieContainer.appendChild(card);
    });
  })
  .catch((err) => console.error(err));
