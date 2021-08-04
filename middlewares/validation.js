import { celebrate, Joi } from 'celebrate';
import validator from 'validator';

const registrationValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
  }),
});

const loginValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const movieValidator = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().custom(
      (value, helpers) => {
        if (validator.isURL(value, {
          require_protocol: true,
        })) {
          return value;
        }
        return helpers.message('Некорректный формат ссылки.');
      },
    ),
    trailer: Joi.string().custom(
      (value, helpers) => {
        if (validator.isURL(value, {
          require_protocol: true,
        })) {
          return value;
        }
        return helpers.message('Некорректный формат ссылки.');
      },
    ),
    thumbnail: Joi.string().custom(
      (value, helpers) => {
        if (validator.isURL(value, {
          require_protocol: true,
        })) {
          return value;
        }
        return helpers.message('Некорректный формат ссылки.');
      },
    ),
    movieId: Joi.string().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

const idValidator = celebrate({
  params: Joi.object().keys({
    id: Joi.string(),
  }),
});

export {
  registrationValidator,
  loginValidator,
  movieValidator,
  idValidator,
};
