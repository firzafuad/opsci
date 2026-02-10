const API_BASE = "http://127.0.0.1:5000";
const container = document.getElementById("movies");

/** R&eacute;cup&eacute;rer les films depuis le back-end */
async function loadMovies(limit = 12) {
  const res = await fetch(`${API_BASE}/movies?limit=${limit}`);
  if (!res.ok) {
    throw new Error(`Erreur API: ${res.status} ${res.statusText}`);
  }
  return await res.json();
}

function resolveImageUrl(movie) {
  // Si l'API renvoie une URL absolue (TMDB), on l'utilise telle quelle.
  // Sinon, on pr&eacute;fixe par l'API (cas TME2: "/images/xxx.jpg").
  const u = movie.image_url || "";
  if (u.startsWith("http://") || u.startsWith("https://")) return u;
  return `${API_BASE}${u}`;
}

function renderMovies(movies) {
  container.innerHTML = "";

  movies.forEach(movie => {
    const card = document.createElement("article");
    card.className = "card";

    const img = resolveImageUrl(movie);

    card.innerHTML = `
      <img src="${img}" alt="${movie.title}">
      <div class="card-content">
        <h2>${movie.title}</h2>
        <p class="meta"><strong>R&eacute;alisateur :</strong> ${movie.director ?? "N/A"}</p>
        <p class="desc">${movie.description ?? ""}</p>
      </div>
    `;

    container.appendChild(card);
  });
}

async function main() {
  try {
    const movies = await loadMovies(12);
    renderMovies(movies);
  } catch (err) {
    console.error(err);
    container.innerHTML = `<p>Erreur: ${err.message}</p>`;
  }
}

main();