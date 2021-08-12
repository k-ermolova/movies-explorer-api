import express from 'express';
import mongoose from 'mongoose';
import { errors } from 'celebrate';
import cors from 'cors';
import { createUser, login } from './controllers/users.js';
import auth from './middlewares/auth.js';
import notFound from './controllers/notFound.js';
import { loginValidator, registrationValidator } from './middlewares/validation.js';
import { requestLogger, errorLogger } from './middlewares/logger.js';
import indexRoute from './routes/index.js';
import limiter from './middlewares/limiter.js';
import errorHandler from './middlewares/errorHandler.js';

const { PORT = 3000, NODE_ENV, DB_ADDRESS } = process.env;

const app = express();

mongoose.connect(NODE_ENV === 'production' ? DB_ADDRESS : 'mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(express.json());

app.use(cors());

app.use(requestLogger);

app.use(limiter);

app.post('/api/signup', registrationValidator, createUser);
app.post('/api/signin', loginValidator, login);

app.use('/api', auth);

app.use(indexRoute);

app.use('*', notFound);

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT);
