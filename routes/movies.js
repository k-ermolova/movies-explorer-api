import { Router } from 'express';
import { getMovies, addMovie, deleteMovie } from '../controllers/movies.js';

const router = Router();

router.get('/', getMovies);

router.post('/', addMovie);

router.delete('/:movieId', deleteMovie);

export default router;
