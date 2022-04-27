const sc = require('../utils/statusCode');

const validateAge = (req, res, next) => {
  const { age } = req.body;
  if (!age) return res.status(sc.BAD_REQUEST).json({ message: 'O campo "age" é obrigatório' });
  if (!(Number.isInteger(age) && age >= 18)) {
    return res.status(sc.BAD_REQUEST)
      .json({ message: 'A pessoa palestrante deve ser maior de idade' });
  }
  next();
};

module.exports = validateAge;
