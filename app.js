import express from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import { errors } from 'celebrate';
import cors from 'cors';
import notFound from './controllers/notFound.js';
import { requestLogger, errorLogger } from './middlewares/logger.js';
import indexRoute from './routes/index.js';
import limiter from './middlewares/limiter.js';
import errorHandler from './middlewares/errorHandler.js';
import config from './config/config.js';

const { PORT = config.port, NODE_ENV, DB_ADDRESS } = process.env;

const app = express();

mongoose.connect(NODE_ENV === 'production' ? DB_ADDRESS : config.db, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(helmet());

app.use(express.json());

app.use(cors());

app.use(requestLogger);

app.use(limiter);

app.use(indexRoute);

app.use('*', notFound);

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT);
