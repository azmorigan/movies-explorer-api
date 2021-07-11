const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-error');

const JWT_KEY = 'dev-stage';

// Проверяет наличие токена в headers: authorization,
// сравнивает с базой данных и пропускает при совпадении.
// Защищает api от незалогиненных пользователей
const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('Необходима авторизация');
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, JWT_KEY);
  } catch (err) {
    throw new UnauthorizedError('Необходима авторизация');
  }
  // в req.user записывается - {_id: id пользователя}
  req.user = payload;
  next();
};

module.exports = auth;
