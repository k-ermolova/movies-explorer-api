import express from 'express';
import mongoose from 'mongoose';
import usersRoutes from './routes/users.js';
import moviesRoutes from './routes/movies.js';
import { createUser, login } from './controllers/users.js';
import auth from './middlewares/auth.js';
import notFound from './controllers/notFound.js';

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/movieExplorerDB', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.post('/signup', createUser);
app.post('/signin', login);

app.use(auth);

app.use('/users', usersRoutes);
app.use('/movies', moviesRoutes);
app.use('*', notFound);

app.use((err, req, res, next) => {
  res.status(err.statusCode).send({ message: err.message });
  next();
});

app.listen(PORT);
