const express = require("express");
const cors = require("cors");
const { tmdb_get, normalizeMovie } = require("./utils/movies");

const app = express();

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
	try {
		const rawMovies = (await tmdb_get("/movie/popular", {language: "fr-FR", page: 1})).results || [];
		const rawCredits = await Promise.all(rawMovies.map(movie => tmdb_get(`movie/${movie.id}/credits`)));

		const movies = rawMovies.map(movie => ({
			...normalizeMovie(movie, rawCredits)
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

// Export movies as JSON file
app.get("/export/movies.json", async (req, res) => {
	try {
		const rawMovies = (await tmdb_get("/movie/popular", {language: "fr-FR", page: 1})).results || [];
		const rawCredits = await Promise.all(rawMovies.map(movie => tmdb_get(`movie/${movie.id}/credits`)));

		const movies = rawMovies.map(movie => ({
			...normalizeMovie(movie, rawCredits)
		}));
		const limit = req.query.limit ? parseInt(req.query.limit) : movies.length;
		
		const stamp = new Date().toLocaleDateString("fr-FR").replace(/\//g, "-");
		
		const path = require("path");
		const fs = require("fs");

		const filename = `movies_${stamp}.json`;
		const filepath = path.join(__dirname, "exports", filename);

		fs.writeFileSync(filepath, JSON.stringify(movies.slice(0, limit)));
		res.download(filepath, (err) => {
			if (err) {
				console.error("Erreur de téléchargement :", err.message, filepath);
			}
			fs.unlinkSync(filepath); // Supprimer le fichier après le téléchargement
		});
	} catch (error) {
		console.error("Erreur API :", error.message);
		return res.status(500).json({ error: "Impossible de récupérer les films" });
	}
});


// Get movie image
app.use('/images', (express.static('images')));

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
