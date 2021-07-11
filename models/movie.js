const mongoose = require('mongoose');
const { isUrl } = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: [isUrl, 'Некорректный url постера.'],
  },
  trailer: {
    type: String,
    required: true,
    validate: [isUrl, 'Некорректный url трейлера.'],
  },
  thumbnail: {
    type: String,
    required: true,
    validate: [isUrl, 'Некорректный url миниатюры.'],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRu: {
    type: String,
    required: true,
  },
  nameEn: {
    type: String,
    required: true,
  },
}, {
  versionKey: false,
});

module.exports = mongoose.model('movie', movieSchema);
