const usersRouter = require('express').Router();

const { editUserValidation } = require('../middlewares/pre-validation');
const {
  getUserInfo,
  editUser,
} = require('../controllers/users');

usersRouter.get('/me', getUserInfo);
usersRouter.patch('/me', editUserValidation, editUser);

module.exports = usersRouter;
