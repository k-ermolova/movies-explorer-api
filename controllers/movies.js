import Movie from '../models/movie.js';
import NotFoundError from '../errors/not-found-err.js';
import InternalServerError from '../errors/internal-server-error.js';
import BadRequestError from '../errors/bad-request-err.js';
import ForbiddenError from '../errors/forbidden-err.js';
import {
  castError,
  forbiddenMessage,
  movieAddingMessage,
  movieDeletingMessage,
  movieIdMessage,
  serverErrorMessage,
  validationError,
} from '../utils/constants.js';

const getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send(movies))
    .catch(() => {
      throw new InternalServerError(serverErrorMessage);
    })
    .catch(next);
};

const addMovie = (req, res, next) => {
  const owner = req.user._id;
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    owner,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === validationError) {
        throw new BadRequestError(movieAddingMessage);
      } else {
        throw new InternalServerError(serverErrorMessage);
      }
    })
    .catch(next);
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (movie && String(movie.owner) !== req.user._id) {
        next(new ForbiddenError(forbiddenMessage));
      }
      return movie;
    })
    .then((movie) => {
      if (movie) {
        res.send(movie);
        return Movie.findByIdAndRemove(
          req.params.movieId,
          { new: true },
        );
      }
      next(new NotFoundError(movieIdMessage));
      return movie;
    })
    .catch((err) => {
      if (err.name === castError) {
        throw new BadRequestError(movieDeletingMessage);
      } else {
        throw new InternalServerError(serverErrorMessage);
      }
    })
    .catch(next);
};

export { getMovies, addMovie, deleteMovie };
