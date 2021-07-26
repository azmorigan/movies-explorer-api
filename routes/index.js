const router = require('express').Router();
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/not-found-error');

const userRouter = require('./users');
const moviesRouter = require('./movies');
const { createUser, login } = require('../controllers/users');
const { signUpValidation, signinValidation } = require('../middlewares/pre-validation');

router.post('/signup', signUpValidation, createUser);
router.post('/signin', signinValidation, login);

router.use(auth);

router.use('/users', userRouter);
router.use('/movies', moviesRouter);

router.use(() => { throw new NotFoundError('Страница не найдена.'); });

module.exports = router;
