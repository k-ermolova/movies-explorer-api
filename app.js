import express from 'express';
import mongoose from 'mongoose';
import { errors } from 'celebrate';
import cors from 'cors';
import usersRoutes from './routes/users.js';
import moviesRoutes from './routes/movies.js';
import { createUser, login } from './controllers/users.js';
import auth from './middlewares/auth.js';
import notFound from './controllers/notFound.js';
import { loginValidator, registrationValidator } from './middlewares/validation.js';
import { requestLogger, errorLogger } from './middlewares/logger.js';

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(express.json());

app.use(cors());

app.use(requestLogger);

app.post('signup', registrationValidator, createUser);
app.post('signin', loginValidator, login);

app.use(auth);

app.use('users', usersRoutes);
app.use('movies', moviesRoutes);
app.use('*', notFound);

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  res.status(err.statusCode).send({ message: err.message });
  next();
});

app.listen(PORT);
