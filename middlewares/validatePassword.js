const sc = require('../utils/statusCode');

const validatePassword = (req, res, next) => {
  const { password } = req.body;
  if (!password) {
    return res.status(sc.BAD_REQUEST).json({ message: 'O campo "password" é obrigatório' });
  }
  const validatePass = (password.toString()).length > 5;
  if (!validatePass) {
    return res.status(sc.BAD_REQUEST)
    .json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
  }
  next();
};

module.exports = validatePassword;
