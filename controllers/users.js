import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/user.js';
import NotFoundError from '../errors/not-found-err.js';
import InternalServerError from '../errors/internal-server-error.js';
import BadRequestError from '../errors/bad-request-err.js';
import UnauthorizedError from '../errors/unauthorized-err.js';
import ConflictError from '../errors/conflict-err.js';

const { NODE_ENV, JWT_SECRET } = process.env;
const MONGO_DUPLICATE_ERROR_CODE = 11000;
const SALT_ROUNDS = 10;

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

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );

      res.send({ token });
    })
    .catch((err) => {
      throw new UnauthorizedError(err.message);
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  bcrypt
    .hash(password, SALT_ROUNDS)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError(
          'Переданы некорректные данные при создании пользователя.',
        );
      } else if (
        err.name === 'MongoError'
        && err.code === MONGO_DUPLICATE_ERROR_CODE
      ) {
        throw new ConflictError(
          'Пользователь с указанным email уже существует.',
        );
      } else {
        throw new InternalServerError('На сервере произошла ошибка.');
      }
    })
    .catch(next);
};

export {
  getCurrentUser, updateProfile, login, createUser,
};
