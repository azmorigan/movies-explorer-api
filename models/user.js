const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { isEmail } = require('validator');
const UnauthorizedError = require('../errors/unauthorized-error');
const BadRequestError = require('../errors/bad-request-error');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [isEmail, 'Некорректный email.'],
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
}, {
  versionKey: false,
});

// Найти пользователя по почте, потом сверить пароли
userSchema.statics.findUserByCredentials = function (email, password) {
  if (!email || !password) {
    throw new BadRequestError('Переданы некорректные данные при авторизации.');
  }
  if (!isEmail(email)) {
    throw new BadRequestError('Некорректная почта.');
  }
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неправильные почта или пароль.');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('Неправильные почта или пароль.');
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
