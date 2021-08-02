import User from '../models/user.js';
import NotFoundError from '../errors/not-found-err.js';
import InternalServerError from '../errors/internal-server-error.js';
import BadRequestError from '../errors/bad-request-err.js';

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id, { __v: 0 })
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        next(new NotFoundError('Пользователь по указанному _id не найден.'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Передан невалидный _id.');
      } else {
        throw new InternalServerError('На сервере произошла ошибка.');
      }
    })
    .catch(next);
};

const updateProfile = (req, res, next) => {
  const { email, name } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { email, name },
    { new: true, runValidators: true },
  )
    .orFail(new Error('NotFound'))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError(
          'Переданы некорректные данные при обновлении профиля.',
        );
      } else if (err.name === err.message) {
        throw new NotFoundError('Пользователь по указанному _id не найден.');
      } else {
        throw new InternalServerError('На сервере произошла ошибка.');
      }
    })
    .catch(next);
};

export { getCurrentUser, updateProfile };
