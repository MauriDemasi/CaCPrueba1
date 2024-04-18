// Lugar donde deseas mostrar las tarjetas de películas
const movieContainer = document.getElementById("movie-container");
const MAX_RESULTS = 12; // Número máximo de películas a mostrar

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
  "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=true&language=es-AR&page=1&sort_by=popularity.desc",
  options
)
  .then((response) => response.json())
  .then((data) => {
    // Iterar sobre los resultados de la API
    data.results.forEach((movie) => {
      const cardColumn = document.createElement("div");
      cardColumn.classList.add("col-lg-3", "col-md-4", "col-sm-6", "mb-4");

      if (movieContainer.children.length < MAX_RESULTS) {
        // Crear elemento de tarjeta
        const card = document.createElement("div");
        card.classList.add("card", "booking-card", "v-2", "rounded-bottom");

        // Construir contenido de la tarjeta
        card.innerHTML = `
        <div class="bg-image hover-overlay ripple ripple-surface ripple-surface-light" data-mdb-ripple-color="light">
          <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" class="img-thumbnail card-img">
        </div>
        <div class="card-body">
          <h4 class="card-title font-weight-bold movie-title"><a>${movie.title}</a></h4>
          <ul class="list-unstyled list-inline mb-2">
            <li class="list-inline-item me-0">
              <i class="fas fa-star text-warning fa-xs"> </i>
            </li>
            <li class="list-inline-item me-0">
              <i class="fas fa-star text-warning fa-xs"> </i>
            </li>
            <li class="list-inline-item me-0">
              <i class="fas fa-star text-warning fa-xs"> </i>
            </li>
            <li class="list-inline-item me-0">
              <i class="fas fa-star text-warning fa-xs"> </i>
            </li>
            <li class="list-inline-item me-0">
              <i class="fas fa-star text-warning fa-xs"> </i>
            </li>
          </ul>
          <p class="card-text overview">
            ${movie.overview}
          </p>
          <hr class="my-4" />
        </div>
      `;

        // Agregar la tarjeta al contenedor de películas
        cardColumn.appendChild(card);
        document.getElementById("movie-container").appendChild(cardColumn);
      }
    });
  })

  .catch((err) => console.error(err));
