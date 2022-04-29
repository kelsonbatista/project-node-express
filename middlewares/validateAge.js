// const Joi = require('joi');
// const errorConstructor = require('../utils/errorConstructor');
const sc = require('../utils/statusCode');
const md = require('../utils/messageDictionary');
// const errorConstructor = require('../utils/errorConstructor');

// error messages
// https://stackoverflow.com/questions/48720942/node-js-joi-how-to-display-a-custom-error-messages

const validateAge = (req, res, next) => {
  const { age } = req.body;
  // const ageSchema = Joi.object({
  //   age: Joi.number().integer().min(18).required()
  //   .messages({
  //     'integer.min': md.FORMAT_AGE,
  //     'any.required': md.REQUIRED_AGE,
  //   }),
  // });
  // const { error } = ageSchema.validate(age);
  // console.log(error, '<---- error');
  // if (error) next(errorConstructor(sc.BAD_REQUEST, error.message));

  if (!age) return res.status(sc.BAD_REQUEST).json({ message: md.REQUIRED_AGE });
  if (!(Number.isInteger(age) && age >= 18)) {
    return res.status(sc.BAD_REQUEST)
      .json({ message: md.FORMAT_AGE });
  }
  next();
};

module.exports = validateAge;
