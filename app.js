import express from 'express';
import mongoose from 'mongoose';
import usersRoutes from './routes/users.js';
import moviesRoutes from './routes/movies.js';

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/movieExplorerDB', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use('/users', usersRoutes);
app.use('/movies', moviesRoutes);

app.listen(PORT);
