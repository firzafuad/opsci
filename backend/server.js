const express = require("express");
const cors = require("cors");
const axios = require("axios")
require("dotenv").config();


const app = express();
const TMDB_TOKEN= process.env.TMDB_TOKEN;
const TMDB_BASE = "https://api.themoviedb.org/3";
const TMDB_IMG_BASE = "https://image.tmdb.org/t/p/w500";

const PORT = 5000;

// Middleware to parse JSON
app.use(express.json());
app.use(cors());

// Basic route
app.get("/", (req, res) => {
  res.send("I'm Alive!");
});


app.get("/hello", (req, res) => {
  res.json({ message: "Hello World!" });
});

// Movies route
app.get("/movies", async (req, res) => {

	if(!TMDB_TOKEN){
		return res.status(500).json({error : "TMDB_TOKEN manquant. Ajoutez-le dans backend/.env"});
	}
	try {
		const url = `${TMDB_BASE}/movie/popular?language=fr-FR&page=1`;
		const response = await axios.get(url,{
      	headers: {
        	Authorization: `Bearer ${TMDB_TOKEN}`,
        	accept: "application/json"
      	}
    });

	const rawMovies = response.data.results;

	const movies = rawMovies.map(movie => ({
		title: movie.title,
    	description: movie.overview,
    	image_url: movie.poster_path ? TMDB_IMG_BASE + movie.poster_path: null, 
      	id: movie.id,
      	year: movie.release_date ? movie.release_date.substring(0, 4) : "N/A"
    }));

	const limit = req.query.limit ? parseInt(req.query.limit) : 20;
  	if (limit) {
    	return res.json(movies.slice(0, limit));
  	}
  	res.json(movies);
	} catch (error) {
		console.error("Erreur API :", error.message);
    	res.status(500).json({ error: "Impossible de récupérer les films" });
	}
  
});


// Get movie image
app.use('/images', (express.static('images')));

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
