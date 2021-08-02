import Movie from '../models/movie.js';
import NotFoundError from '../errors/not-found-err.js';
import InternalServerError from '../errors/internal-server-error.js';
import BadRequestError from '../errors/bad-request-err.js';

const getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send(movies))
    .catch(() => {
      throw new InternalServerError('На сервере произошла ошибка.');
    })
    .catch(next);
};

const addMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные при добавлении фильма.');
      } else {
        throw new InternalServerError('На сервере произошла ошибка.');
      }
    })
    .catch(next);
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (movie) {
        res.send(movie);
        return Movie.findByIdAndRemove(
          req.params.movieId,
          { new: true },
        );
      }
      next(new NotFoundError('Фильм с указанным _id не найден.'));
      return movie;
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные для удаления фильма.');
      } else {
        throw new InternalServerError('На сервере произошла ошибка.');
      }
    })
    .catch(next);
};

export { getMovies, addMovie, deleteMovie };
