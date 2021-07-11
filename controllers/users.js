const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ConflictError = require('../errors/conflict-error');
const BadRequestError = require('../errors/bad-request-error');

const JWT_KEY = 'dev-stage';
const SALT_ROUNDS = 10;

// Регистрация пользователя
const createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  bcrypt.hash(password, SALT_ROUNDS)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => {
      res.status(200).send({
        name: user.name,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000) {
        throw new ConflictError('Пользователь с таким email уже существует.');
      }
      if (err.errors.email) {
        throw new BadRequestError(err.errors.email.message);
      }
      if (err.name === 'ValidationError' || err.message === 'data and salt arguments required') {
        throw new BadRequestError('Переданы некорректные данные при создании пользователя.');
      }
    })
    .catch(next);
};

// Авторизация
const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id }, JWT_KEY, { expiresIn: '7d' },
      );
      res.send({ jwt: token });
    })
    .catch(next);
};

// Получить информацию о текущем пользователе
const getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      res.send({
        name: user.name,
        email: user.email,
      });
    })
    .catch(next);
};

module.exports = { createUser, login, getUserInfo };
