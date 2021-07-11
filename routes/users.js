const usersRouter = require('express').Router();

const {
  getUserInfo,
  // editUser,
} = require('../controllers/users');

usersRouter.get('/me', getUserInfo);
// usersRouter.patch('/me', editUser);

module.exports = usersRouter;
