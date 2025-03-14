import { useState, useEffect } from "react";
import { getPopularMovies, getMoviesByGenres } from "../services/tmdb";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import "../styles.css";

function Home() {
  const [popularMovies, setPopularMovies] = useState([]);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [loadingPopular, setLoadingPopular] = useState(true);
  const [loadingRecommended, setLoadingRecommended] = useState(true);
  const [error, setError] = useState("");

  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem("favorites");
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    const fetchPopularMovies = async () => {
      try {
        const movies = await getPopularMovies(1);
        setPopularMovies(movies.results || movies);
      } catch (err) {
        setError("Erro ao carregar filmes populares.");
      } finally {
        setLoadingPopular(false);
      }
    };
    fetchPopularMovies();
  }, []);

  useEffect(() => {
    const fetchRecommendedMovies = async () => {
      if (favorites.length === 0) {
        setRecommendedMovies([]);
        setLoadingRecommended(false);
        return;
      }

      try {
        const genreIds = [
          ...new Set(favorites.flatMap((movie) => movie.genre_ids || [])),
        ].slice(0, 3);

        if (genreIds.length > 0) {
          const movies = await getMoviesByGenres(genreIds, 1);
          setRecommendedMovies(movies.results || movies);
        } else {
          setRecommendedMovies([]);
        }
      } catch (err) {
        setError("Erro ao carregar recomendações.");
      } finally {
        setLoadingRecommended(false);
      }
    };

    fetchRecommendedMovies();
  }, [favorites]);

  const handleFavorite = (movie) => {
    setFavorites((prevFavorites) => {
      const isFavorited = prevFavorites.some((fav) => fav.id === movie.id);
      return isFavorited
        ? prevFavorites.filter((fav) => fav.id !== movie.id)
        : [...prevFavorites, movie];
    });
  };

  // Configuração do Carrossel
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 3,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } }
    ]
  };

  return (
    <div className="home-container">
      <h2>Filmes Populares</h2>
      {loadingPopular && <p>Carregando...</p>}
      {error && <p>{error}</p>}

      <Slider {...settings}>
        {popularMovies.map((movie) => (
          <div key={movie.id} className="movie-card">
            <Link to={`/movie/${movie.id}`}>
              <img
                src={movie.poster_path 
                  ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                  : "https://via.placeholder.com/300x450?text=No+Image"}
                alt={movie.title}
                className="movie-poster"
              />
            </Link>
            <h3 className="movie-title">{movie.title}</h3>
            <button onClick={() => handleFavorite(movie)}
              className={`favorite-btn ${favorites.some(fav => fav.id === movie.id) ? 'favorited' : ''}`}>
              {favorites.some(fav => fav.id === movie.id) ? "★" : "☆"}
            </button>
          </div>
        ))}
      </Slider>

      <h2>Filmes Favoritos</h2>
      {favorites.length === 0 ? (
        <p>Nenhum favorito ainda.</p>
      ) : (
        <Slider {...settings}>
          {favorites.map((movie) => (
            <div key={movie.id} className="movie-card">
              <Link to={`/movie/${movie.id}`}>
                <img
                  src={movie.poster_path 
                    ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                    : "https://via.placeholder.com/300x450?text=No+Image"}
                  alt={movie.title}
                  className="movie-poster"
                />
              </Link>
              <h3 className="movie-title">{movie.title}</h3>
              <button onClick={() => handleFavorite(movie)}
                className="favorite-btn favorited">
                ★
              </button>
            </div>
          ))}
        </Slider>
      )}

      <h2>Filmes Recomendados</h2>
      {loadingRecommended && <p>Carregando recomendações...</p>}
      {!loadingRecommended && recommendedMovies.length === 0 && <p>Sem recomendações no momento.</p>}

      <Slider {...settings}>
        {recommendedMovies.map((movie) => (
          <div key={movie.id} className="movie-card">
            <Link to={`/movie/${movie.id}`}>
              <img
                src={movie.poster_path 
                  ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                  : "https://via.placeholder.com/300x450?text=No+Image"}
                alt={movie.title}
                className="movie-poster"
              />
            </Link>
            <h3 className="movie-title">{movie.title}</h3>
            <button onClick={() => handleFavorite(movie)}
                className="favorite-btn favorited">
                ★
              </button>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default Home;
