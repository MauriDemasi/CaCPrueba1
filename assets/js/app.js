const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3YzI1ZWJhMWQxYTM1OWUxYzRiMjZhOGM4ZGIzMzlmNyIsInN1YiI6IjY2MTkyOGYyYjlhMGJkMDE3YzExOGY4YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.jCNSUsqC_CQyv0dd2N3kT7OFl54WuHWR9dlmQ2iTOag",
  },
};

// Lugar donde deseas mostrar las tarjetas de películas
const movieContainer = document.getElementById("movie-container");
const MAX_RESULTS = 12; // Número máximo de películas a mostrar

/// Variable para guardar el idMovie para luego buscar película por este parametro
let idMovie;

// Variable para almacenar el titulo de la pelicula y usar este valor como parametro para la funcion que busca por youtube
let movieTitle;

// Hacer la solicitud a la API para obtener las películas estreno
fetch(
  "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=true&language=es-AR&page=1&sort_by=popularity.desc",
  options
)
  .then((response) => response.json())
  .then((data) => {
    // Iterar sobre los resultados de la API
    data.results.forEach((movie) => {
      // Aquí creamos una función anónima que se ejecutará cuando se haga clic en una tarjeta
      const handleClick = () => {
        // Llamamos a la función getMovieById con el id de la película seleccionada
        getMovieById(movie.id);
        // Mostrar los detalles de la película en el modal
        const modalTitle = document.getElementById("modalTitle");
        const modalBody = document.getElementById("modalBody");

        modalTitle.textContent = movie.title;
        modalTitle.textContent = movie.title;
        modalBody.innerHTML = `
        <div class="col">
          <div class="row">

          <div class="bg-image hover-overlay ripple ripple-surface ripple-surface-light col-4" data-mdb-ripple-color="light">
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" class="card-img">
          </div> 
        
          <!-- Segundo elemento -->
          <div class="bg-image hover-overlay ripple ripple-surface ripple-surface-light col-8" data-mdb-ripple-color="light">
            <div class="ratio ratio-16x9" id="trailer-container">
            <iframe width="100%" height="100%" src="assets/video/404.mp4" frameborder="0" allowfullscreen></iframe>
            </div>
          </div>

        </div>
      
        <div class="card-body">
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
        `;

        // Mostrar el modal
        const movieModal = new bootstrap.Modal(
          document.getElementById("movieModal")
        );
        movieModal.show();
      };

      idMovie = movie.id;
      const cardColumn = document.createElement("div");
      cardColumn.classList.add("col-lg-3", "col-md-4", "col-sm-6", "mb-4");

      if (movieContainer.children.length < MAX_RESULTS) {
        // Crear elemento de tarjeta
        const card = document.createElement("div");
        card.classList.add("card", "booking-card", "v-2", "rounded-bottom");

        // Agregar el evento de clic a la tarjeta
        card.addEventListener("click", handleClick);

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
        //getTrailerByTitle(movie.title);
      }
    });
  })
  .catch((err) => console.error(err));

//Funcion para hacer los fetch por categorias y renderizar las card en su respectivo contenedor
function getResultsByGenre(genreId, containerId) {
  const documentaryContainer = document.getElementById(containerId);

  fetch(
    `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=true&language=es-AR&page=1&sort_by=popularity.desc&with_genres=${genreId}`,
    options
  )
    .then((response) => response.json())
    .then((data) => {
      // Iterar sobre los resultados de la API
      data.results.forEach((movie) => {
        // Aquí creamos una función anónima que se ejecutará cuando se haga clic en una tarjeta
        const handleClick = () => {
          // Llamamos a la función getMovieById con el id de la película seleccionada
          getMovieById(movie.id);
        };

        idMovie = movie.id;

        const cardColumn = document.createElement("div");
        cardColumn.classList.add("col-lg-3", "col-md-4", "col-sm-6", "mb-4");

        if (documentaryContainer.children.length < MAX_RESULTS) {
          // Crear elemento de tarjeta
          const card = document.createElement("div");
          card.classList.add("card", "booking-card", "v-2", "rounded-bottom");

          // Agregar el evento de clic al contenedor de la tarjeta
          card.addEventListener("click", handleClick);

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
          documentaryContainer.appendChild(cardColumn);
          getTrailerByTitle(movie.title);
        }
      });
    })
    .catch((error) => {
      console.error("Error fetching documentaries:", error);
    });
}
//Documentales -->
getResultsByGenre(99, "documentary-container");
//Animadas -->
getResultsByGenre(16, "animated-container");

//Funcion para buscar una pelicula por su id

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

// Función para obtener el trailer de una película por su título
// async function getTrailerByTitle(movieTitle) {
//   const response = await fetch(
//     `http://localhost:3000/trailer/${encodeURIComponent(movieTitle)}+trailer`
//   );
//   const data = await response.json();

//   if (response.ok) {
//     let { url } = data;

//     // Formatear la URL del video para obtener solo el ID del video
//     const videoId = obtenerIdVideo(url);

//     // Construir la URL del video con el formato de incrustación de YouTube
//     url = `https://www.youtube.com/embed/${videoId}`;

//     // Actualizar el contenido del contenedor del trailer con el reproductor de video
//     const trailerContainer = document.getElementById("trailer-container");
//     trailerContainer.innerHTML = `<iframe width="100%" height="100%" src="${url}" frameborder="0" allowfullscreen></iframe>`;

//     // Si no encuentra el trailer muestra un video generico
//     if (!url) {
//       trailerContainer.innerHTML = `<iframe width="100%" height="100%" src="./video/404.mp4" frameborder="0" allowfullscreen></iframe>`;
//     }
//   } else {
//     console.error("Error:", data.error);
//   }
// }

// function obtenerIdVideo(url) {
//   const startIndex = url.indexOf("v=");
//   if (startIndex !== -1) {
//     let videoId = url.substring(startIndex + 2);
//     const endIndex = videoId.indexOf("&");
//     if (endIndex !== -1) {
//       videoId = videoId.substring(0, endIndex);
//     }
//     return videoId;
//   }
//   return null;
//}
