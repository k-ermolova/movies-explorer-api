import express from 'express';
import usersRoutes from './users.js';
import moviesRoutes from './movies.js';
import { createUser, login } from '../controllers/users.js';
import { loginValidator, registrationValidator } from '../middlewares/validation.js';
import auth from '../middlewares/auth.js';

const indexRoute = express();

indexRoute.post('/api/signup', registrationValidator, createUser);
indexRoute.post('/api/signin', loginValidator, login);

indexRoute.use('/api', auth);

indexRoute.use('/api/users', usersRoutes);
indexRoute.use('/api/movies', moviesRoutes);

export default indexRoute;
