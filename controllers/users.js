import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/user.js';
import NotFoundError from '../errors/not-found-err.js';
import InternalServerError from '../errors/internal-server-error.js';
import BadRequestError from '../errors/bad-request-err.js';
import UnauthorizedError from '../errors/unauthorized-err.js';
import ConflictError from '../errors/conflict-err.js';
import {
  MONGO_DUPLICATE_ERROR_CODE,
  SALT_ROUNDS,
  serverErrorMessage,
  userCreatingMessage,
  userIdMessage,
  userUpdatingMessage,
  invalidIdMessage,
  castError,
  notFound,
  validationError,
  mongoError,
  emailDuplicateMessage,
} from '../utils/constants.js';

const { NODE_ENV, JWT_SECRET } = process.env;

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id, { __v: 0 })
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        next(new NotFoundError(userIdMessage));
      }
    })
    .catch((err) => {
      if (err.name === castError) {
        throw new BadRequestError(invalidIdMessage);
      } else {
        throw new InternalServerError(serverErrorMessage);
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
    .orFail(new Error(notFound))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === validationError) {
        throw new BadRequestError(userUpdatingMessage);
      } else if (err.name === err.message) {
        throw new NotFoundError(userIdMessage);
      } else {
        throw new InternalServerError(serverErrorMessage);
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
    .then((user) => {
      res.send({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.name === validationError) {
        throw new BadRequestError(userCreatingMessage);
      } else if (
        err.name === mongoError
        && err.code === MONGO_DUPLICATE_ERROR_CODE
      ) {
        throw new ConflictError(emailDuplicateMessage);
      } else {
        throw new InternalServerError(serverErrorMessage);
      }
    })
    .catch(next);
};

export {
  getCurrentUser, updateProfile, login, createUser,
};
