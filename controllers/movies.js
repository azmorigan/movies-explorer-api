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
    nameRu,
    nameEn,
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
    nameRu,
    nameEn,
  })
    .then((card) => {
      res.status(200).send(card);
    })
    .catch(next);
};

// Получить все фильмы
const getMovies = (req, res, next) => {
  Movie.find({})
    .populate('owner')
    .then((movies) => res.status(200).send(movies))
    .catch(next);
};

// Удалить фильм по _id
const deleteMovie = (req, res, next) => {
  const { id } = req.params;
  Movie.findById(id)
    .then((movie) => {
      if (movie.owner._id.toString() !== req.user._id) {
        throw new ForbiddenError('Нельзя удалить чужой фильм.');
      }
      Movie.findByIdAndRemove(id)
        .then((deletingMovie) => {
          res.status(200).send(deletingMovie);
        });
    })
    .catch((err) => {
      if (err.name === 'TypeError') {
        throw new NotFoundError('Фильм с указанным _id не найден.');
      }
      if (err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные.');
      }
      next(err);
    })
    .catch(next);
};

module.exports = { createMovie, getMovies, deleteMovie };
