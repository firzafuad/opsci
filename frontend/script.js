/**
 * Données "codés en dur" (locales) pour tester l'affichage.
 * IMPORTANT :
 * - Remplacez les champs "image" par les vrais noms de fichiers placés dans /images
 * - Exemple : images/inception.jpg
 */
 async function loadMovies(limit = 5) {
  const res = await fetch(`http://localhost:5000/movies?limit=${limit}`);
  const movies = await res.json();
  return movies;
}

async function init() {
  try {
    const movies = await loadMovies(10);
    const container = document.getElementById("movies");
    if (!container) {
      console.warn('Container #movies not found');
      return;
    }

    /**
     * Génère les cartes de films dans la page.
     */
    movies.forEach(movie => {
      const card = document.createElement("article");
      const API_BASE = "http://localhost:5000";
      const imageSrc = API_BASE + movie.image_url;
      card.className = "card";
      card.innerHTML = `
        <img src="${imageSrc}" alt="${movie.title}">
        <div class="card-content">
          <h2>${movie.title}</h2>
          <p class="meta"><strong>R&eacute;alisateur :</strong> ${movie.director}</p>
          <p class="desc">${movie.description}</p>
        </div>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    console.error('Failed to load movies', err);
  }
}

init();