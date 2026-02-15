const axios = require("axios")
require("dotenv").config();
const TMDB_TOKEN= process.env.TMDB_TOKEN;
const TMDB_BASE = "https://api.themoviedb.org/3";
const TMDB_IMG_BASE = "https://image.tmdb.org/t/p/w500";

function findDirector(data) {
    const crews = data.crew || [];
    for (const crew of crews) {
        if (crew.job === "Director") {
            return crew.name;
        }
    }
    return "N/A";
}

async function tmdb_get(path, params = {}) {
    if (!TMDB_TOKEN) {
        throw new Error("TMDB_TOKEN manquant. Ajoutez-le dans backend/.env");
    }
    const url = `${TMDB_BASE}/${path}`;
    const response = await axios.get(url,{
    headers: {
        Authorization: `Bearer ${TMDB_TOKEN}`,
        accept: "application/json"
    },
    params: params
    });

    return response.data;
}

function normalizeMovie(movie, credits) {
    return {
        title: movie.title,
        director: findDirector(credits.find(m => m.id === movie.id)),
        description: movie.overview,
        image_url: movie.poster_path ? TMDB_IMG_BASE + movie.poster_path: null, 
        id: movie.id,
        year: movie.release_date ? movie.release_date.substring(0, 4) : "N/A"
    }
}

exports.tmdb_get = tmdb_get;
exports.normalizeMovie = normalizeMovie;