import { notFoundMessage } from '../utils/constants.js';

const notFound = (req, res) => {
  res.status(404).send({ message: notFoundMessage });
};

export default notFound;
