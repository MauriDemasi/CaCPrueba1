const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3YzI1ZWJhMWQxYTM1OWUxYzRiMjZhOGM4ZGIzMzlmNyIsInN1YiI6IjY2MTkyOGYyYjlhMGJkMDE3YzExOGY4YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.jCNSUsqC_CQyv0dd2N3kT7OFl54WuHWR9dlmQ2iTOag",
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
    `https://cacprueba1-4lrw.onrender.com/trailer/${encodeURIComponent(
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
      </div>
    </div>`;

  const trailerContainer = document.getElementById("trailer-container");
  const trailerUrl = trailerUrls.find(
    (item) => item.title === movie.title
  )?.url;
  if (trailerUrl) {
    trailerContainer.innerHTML = `<iframe "class=embed-responsive-item" width="100%" height="100%" src="${trailerUrl}" frameborder="0" allowfullscreen></iframe>`;
  } else {
    getTrailerByTitle(movie.title);
  }

  const movieModal = new bootstrap.Modal(document.getElementById("movieModal"));
  movieModal.show();

  //Agregar un evento para frenar la reproduccion del video cuando se cierra el modal:
  movieModal._element.addEventListener("hidden.bs.modal", function () {
    // Detener la reproducción del video
    const trailerContainer = document.getElementById("trailer-container");
    if (trailerContainer) {
      const iframe = trailerContainer.querySelector("iframe");
      if (iframe) {
        // Detener el video estableciendo la URL del iframe como una cadena vacía
        iframe.src = "";
      }
    }
  });
}

function showTrailer(url) {
  const trailerContainer = document.getElementById("trailer-container");
  if (trailerContainer) {
    // Vaciar el contenido actual del contenedor del trailer
    trailerContainer.innerHTML = "";

    // Crear un nuevo iframe con la URL actualizada
    const iframe = document.createElement("iframe");
    iframe.setAttribute("width", "100%");
    iframe.setAttribute("height", "100%");
    iframe.setAttribute("src", url);
    iframe.setAttribute("frameborder", "0");
    iframe.setAttribute("allowfullscreen", "");

    // Agregar el iframe al contenedor del trailer
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

const estrenosUrl =
  "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=true&language=es-AR&page=1&sort_by=popularity.desc";
const estrenosContainerId = "movie-container";

fetchNewMovies(estrenosUrl, estrenosContainerId);

const documentalesUrl =
  "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=true&language=es-AR&page=1&sort_by=popularity.desc&with_genres=99";
const documentalesContainerId = "documentary-container";

fetchNewMovies(documentalesUrl, documentalesContainerId);

const animadasUrl =
  "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=true&language=es-AR&page=1&sort_by=popularity.desc&with_genres=16";
const animadasContainerId = "animated-container";

fetchNewMovies(animadasUrl, animadasContainerId);

/*--------------------------------------------------------------
# Login Popup
--------------------------------------------------------------*/
const modalLogin = document.getElementById("loginModal");

function createModalLogin() {
  // Crea el HTML del modal
  modalLogin.innerHTML = `
  <div class="container position-absolute top-50 start-50 translate-middle">
  <div class="row justify-content-center align-items-center">
    <div class="col-lg-12 "> 
      <div class="card rounded-3 text-black border border-0">
        <div class="row g-0">
          <div class="col-md-6">
            <div class="card-body p-md-5 mx-md-4">
              <form>
                <p class="text-center mb-4">Inicia Sesion para acceder al mejor contenido</p>
                <div class="form-outline mb-4">
                  <input type="email" id="form2Example11" class="form-control" placeholder="Usuario, Telefono o E-mail">
                </div>
                <div class="form-outline mb-4">
                  <input type="password" id="form2Example22" class="form-control" placeholder="Password">
                </div>
                <div class="d-flex flex-column align-items-center mb-4">
                  <button class="btn btn-outline-secondary btn-common" id="close-btn" type="button"onclick="login()" >Inicia Sesión</button>
                </div>
                <div class="d-flex flex-column align-items-center mb-4">
                  <p>O puedes iniciar sesion usando:</p>
                  <div>
                    <a href="#" class="twitter"><i class="bx bxl-twitter fs-3 m-3"></i></a>
                    <a href="#" class="facebook"><i class="bx bxl-facebook fs-3 m-3"></i></a>
                    <a href="#" class="instagram"><i class="bx bxl-instagram fs-3 m-3"></i></a>
                    <a href="#" class="google-plus"><i class="bx bxl-google fs-3 m-3"></i></a>
                  </div>                
                </div>
                <p class="text-center mb-0"><a href="#">Olvidaste tu password?</a></p>
              </form>
            </div>
          </div>
          <div class="col-md-6 z-2" class="form-container">
            <div class="d-flex align-items-center h-100" id="img-log">
              <div class="px-3 py-4 p-md-5 mx-md-4 z-1 text-white" >
              <div class="d-flex justify-content-end">
              <div class="position-absolute top-0 end-0 mt-2 me-4">
                <button class="btn btn-outline-secondary btn-close btn-common" id="close-btn" type="button"onclick="closeModal()" ></button>
              </div>
            </div>
                <h4 class="mb-4">We are more than just a company</h4>
                <p class="small mb-0">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
              </div>
            </div>
          </div>
       </div>
      </div>
    </div>
  </div>
</div>

 `;

 //Creamos un div para cubrir el contenido del body
  const overlay = document.createElement('div');
  overlay.classList.add('modal-overlay')
  document.body.appendChild(overlay);





  // Muestra el modal utilizando Bootstrap
  modalLogin.classList.add("show");
  modalLogin.style.display = "block";

}

function closeModal() {
  modalLogin.classList.remove("show");
  modalLogin.style.display = "none";
  
  //Remover el overlay
  const overlay = document.querySelector('.modal-overlay');
  if (overlay){
    document.body.removeChild(overlay);
  }

}

function login() {
  const url = "https://664a7f5fa300e8795d421f47.mockapi.io/api/v1/login";
  const data = {
    email: document.getElementById("form2Example11").value,
    password: document.getElementById("form2Example22").value,
  };

  fetch(url)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(users => {
    if (users) {
      const user = users.find(user => user.email === data.email && user.password === data.password);
      if (user) {
        alert('Sesión iniciada con éxito');
        closeModal();
      } else {
        alert('Error: credenciales incorrectas');
      }
    } else {
      alert('Error: respuesta inesperada del servidor');
    }
  })
  .catch((error) => {
    console.error("Error:", error);
    alert('Error de red o respuesta no válida');
  });
}

