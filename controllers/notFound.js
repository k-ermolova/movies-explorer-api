const notFound = (req, res) => {
  res.status(404).send({ message: 'Ресурс не найден.' });
};

export default notFound;
