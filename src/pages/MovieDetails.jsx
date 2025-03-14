import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieDetails } from '../services/tmdb';
import { useAuth } from '../contexts/AuthContext';
import '../styles.css';
import { FaArrowLeft, FaStar, FaRegStar } from 'react-icons/fa';

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [favorites, setFavorites] = useState(() => {
    return JSON.parse(localStorage.getItem('favorites')) || [];
  });

  const fetchMovieDetails = useCallback(async () => {
    try {
      const data = await getMovieDetails(id);
      setMovie(data);
    } catch {
      setError('Não foi possível carregar os detalhes do filme.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchMovieDetails();
  }, [fetchMovieDetails]);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const handleFavorite = () => {
    if (!user) {
      alert('Por favor, faça login para favoritar filmes!');
      navigate('/login');
      return;
    }
    setFavorites((prev) => {
      const isFavorited = prev.some((fav) => fav.id === movie.id);
      return isFavorited ? prev.filter((fav) => fav.id !== movie.id) : [...prev, movie];
    });
  };

  if (loading) return <p className="loading">Carregando detalhes...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!movie) return <p className="error">Filme não encontrado.</p>;

  return (
    <div className="movie-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <FaArrowLeft /> Voltar
      </button>

      <div className="movie-card">
        <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} className="movie-poster" />
        
        <div className="movie-info">
          <h1>{movie.title}</h1>
          <p><strong>Gêneros:</strong> {movie.genres.map((genre) => genre.name).join(', ')}</p>
          <p><strong>Sinopse:</strong> {movie.overview || 'Sinopse não disponível.'}</p>
          <p><strong>Lançamento:</strong> {new Date(movie.release_date).toLocaleDateString('pt-BR')}</p>
          <p><strong>Avaliação:</strong> {movie.vote_average}/10</p>

          <button onClick={handleFavorite} className="favorite-btn">
            {favorites.some((fav) => fav.id === movie.id) ? <FaStar className="favorited" /> : <FaRegStar />} Favoritar
          </button>
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;
