import { Router } from 'express';
import { getMovies, addMovie, deleteMovie } from '../controllers/movies.js';
import { idValidator, movieValidator } from '../middlewares/validation.js';

const router = Router();

router.get('/', getMovies);

router.post('/', movieValidator, addMovie);

router.delete('/:movieId', idValidator, deleteMovie);

export default router;
