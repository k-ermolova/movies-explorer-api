import jwt from 'jsonwebtoken';
import UnauthorizedError from '../errors/unauthorized-err.js';
import { authMessage } from '../utils/constants.js';

const { NODE_ENV, JWT_SECRET } = process.env;

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError(authMessage);
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    throw new UnauthorizedError(authMessage);
  }

  req.user = payload;

  next();
};

export default auth;
