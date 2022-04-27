const sc = require('../utils/statusCode');

const validateEmail = (req, res, next) => {
  const { email } = req.body;
  if (!(email)) {
    return res.status(sc.BAD_REQUEST).json({ message: 'O campo "email" é obrigatório' });
  }
  const regexEmail = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})$/;
  const validate = regexEmail.test(email);
  if (!validate) {
    return res.status(sc.BAD_REQUEST)
    .json({ message: 'O "email" deve ter o formato "email@email.com"' });
  }
  next();
};

module.exports = validateEmail;
