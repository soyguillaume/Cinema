const apiKey = "8ff3668026e98358e079555dd96ec7b2";
const listId = "8248492-ma-liste-1"; // Remplacez par l'ID de votre liste
let currentPage = 1; // Ajout de la variable currentPage pour la pagination

async function fetchMovies(page) {
  try {
    const apiUrl = `https://api.themoviedb.org/4/list/${listId}?api_key=${apiKey}&language=fr-FR&page=${page}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    const movies = data.results;

    const movieContainer = document.getElementById("movie-container");

    movies.forEach((movie) => {
      const movieCard = document.createElement("div");
      movieCard.classList.add("movie-card");

      const img = document.createElement("img");
      img.src = `https://image.tmdb.org/t/p/original${movie.backdrop_path || movie.poster_path}`;
      img.alt = movie.title;

      // Ajoutez un gestionnaire d'événements clic à l'image
      img.addEventListener("click", () => {
        // Appelez une fonction pour afficher la bande annonce lorsque l'image est cliquée
        showTrailer(movie.id);
      });

      const movieInfo = document.createElement("div");
      movieInfo.classList.add("movie-info");

      const title = document.createElement("div");
      title.classList.add("movie-title");
      title.textContent = movie.title;

      const summary = document.createElement("div");
      summary.classList.add("movie-summary");
      summary.textContent = movie.overview;

      const addToMyListButton = document.createElement("button");
      addToMyListButton.textContent = "Ajouter à ma liste";
      addToMyListButton.addEventListener("click", () => {
        // Appelez une fonction pour ajouter le film à la liste
        addToMyList(movie.id);
      });

      movieInfo.appendChild(title);
      movieInfo.appendChild(summary);
      movieInfo.appendChild(addToMyListButton);

      movieCard.appendChild(img);
      movieCard.appendChild(movieInfo);

      movieContainer.appendChild(movieCard);
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error);
  }
}

// Ajout de la détection du défilement pour charger plus de films lorsque l'utilisateur atteint le bas de la page
window.addEventListener('scroll', () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
    // L'utilisateur a atteint le bas de la page, chargez la page suivante.
    currentPage++;
    fetchMovies(currentPage);
  }
});

async function showTrailer(movieId) {
  try {
    const trailerUrl = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}&language=fr-FR`;
    const response = await fetch(trailerUrl);
    const data = await response.json();
    const trailers = data.results;

    if (trailers.length > 0) {
      // Si des bandes annonces sont disponibles, ouvrez la première dans une nouvelle fenêtre
      const trailerKey = trailers[0].key;
      window.open(`https://www.youtube.com/watch?v=${trailerKey}`);
    } else {
      console.log("Aucune bande annonce disponible pour ce film.");
    }
  } catch (error) {
    console.error("Erreur lors de la récupération de la bande annonce:", error);
  }
}

async function handleSearch() {
  // Récupérez la valeur de la zone de recherche
  const searchTerm = document.getElementById('searchInput').value;

  // Effacez le contenu actuel du conteneur de films
  const movieContainer = document.getElementById('movie-container');
  movieContainer.innerHTML = '';

  try {
    // Effectuez une recherche de films avec le terme spécifié
    const apiUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=fr-FR&query=${searchTerm}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    const movies = data.results;

    // Affichez les films résultants
    movies.forEach((movie) => {
      const movieCard = document.createElement('div');
      movieCard.classList.add('movie-card');

      const img = document.createElement('img');
      img.src = `https://image.tmdb.org/t/p/original${movie.poster_path}`;
      img.alt = movie.title;

      // Ajoutez un gestionnaire d'événements clic à l'image
      img.addEventListener('click', () => {
        // Appelez une fonction pour afficher la bande annonce lorsque l'image est cliquée
        showTrailer(movie.id);
      });

      const movieInfo = document.createElement('div');
      movieInfo.classList.add('movie-info');

      const title = document.createElement('div');
      title.classList.add('movie-title');
      title.textContent = movie.title;

      const summary = document.createElement('div');
      summary.classList.add('movie-summary');
      summary.textContent = movie.overview;

      const addToMyListButton = document.createElement('button');
      addToMyListButton.textContent = 'Ajouter à ma liste';
      addToMyListButton.addEventListener('click', () => {
        // Appelez une fonction pour ajouter le film à la liste
        addToMyList(movie.id);
      });

      movieInfo.appendChild(title);
      movieInfo.appendChild(summary);
      movieInfo.appendChild(addToMyListButton);

      movieCard.appendChild(img);
      movieCard.appendChild(movieInfo);

      movieContainer.appendChild(movieCard);
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des données de recherche :', error);
  }
}

// Ajoutez un gestionnaire d'événements clic au bouton de recherche
const searchButton = document.getElementById('searchButton');
searchButton.addEventListener('click', handleSearch);

// Fonction pour ajouter un film à la liste
async function addToMyList(movieId) {
  try {
    const addToListUrl = `https://api.themoviedb.org/4/list/${listId}/add_item?api_key=${apiKey}`;
    const response = await fetch(addToListUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer YOUR_ACCESS_TOKEN`, // Remplacez YOUR_ACCESS_TOKEN par votre jeton d'accès
      },
      body: JSON.stringify({
        media_id: movieId,
      }),
    });

    const data = await response.json();
    console.log('Film ajouté à la liste avec succès:', data);
  } catch (error) {
    console.error('Erreur lors de l\'ajout du film à la liste :', error);
  }
}

// Appel initial pour charger la première page de films
fetchMovies(currentPage);
