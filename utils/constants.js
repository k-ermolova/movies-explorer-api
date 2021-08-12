const MONGO_DUPLICATE_ERROR_CODE = 11000;
const SALT_ROUNDS = 10;

const castError = 'CastError';
const notFound = 'NotFound';
const validationError = 'ValidationError';
const mongoError = 'MongoError';

const serverErrorMessage = 'На сервере произошла ошибка.';
const forbiddenMessage = 'Невозможно удалить чужой фильм.';
const movieAddingMessage = 'Переданы некорректные данные при добавлении фильма.';
const movieDeletingMessage = 'Переданы некорректные данные для удаления фильма.';
const userUpdatingMessage = 'Переданы некорректные данные при обновлении профиля.';
const userCreatingMessage = 'Переданы некорректные данные при создании пользователя.';
const movieIdMessage = 'Фильм с указанным _id не найден.';
const userIdMessage = 'Пользователь по указанному _id не найден.';
const invalidIdMessage = 'Передан невалидный _id.';
const emailDuplicateMessage = 'Пользователь с указанным email уже существует.';
const urlErrorMessage = 'Некорректный формат ссылки.';

export {
  MONGO_DUPLICATE_ERROR_CODE,
  SALT_ROUNDS,
  castError,
  notFound,
  validationError,
  mongoError,
  serverErrorMessage,
  forbiddenMessage,
  movieAddingMessage,
  movieDeletingMessage,
  userUpdatingMessage,
  userCreatingMessage,
  movieIdMessage,
  userIdMessage,
  invalidIdMessage,
  emailDuplicateMessage,
  urlErrorMessage,
};
