import express from 'express';
import usersRoutes from './users.js';
import moviesRoutes from './movies.js';

const indexRoute = express();

indexRoute.use('/api/users', usersRoutes);
indexRoute.use('/api/movies', moviesRoutes);

export default indexRoute;
