const Movie = require('../models/movie');
const ForbiddenError = require('../errors/forbidden-error');
const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');

// Создать фильм
const createMovie = (req, res, next) => {
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
    owner: req.user._id,
    movieId,
    nameRU,
    nameEN,
  })
    .then((card) => {
      res.send(card);
    })
    .catch(next);
};

// Получить все фильмы
const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send(movies))
    .catch(next);
};

// Удалить фильм по _id
const deleteMovie = (req, res, next) => {
  const { id } = req.params;
  Movie.findById(id)
    .then((movie) => {
      if (movie.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Нельзя удалять чужой фильм.');
      }
      return movie.remove()
        .then((deletingMovie) => res.send(deletingMovie));
    })
    .catch((err) => {
      if (err.name === 'TypeError') {
        throw new NotFoundError('Фильм с указанным _id не найден.');
      }
      if (err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные.');
      }
      throw err;
    })
    .catch(next);
};

module.exports = { createMovie, getMovies, deleteMovie };
