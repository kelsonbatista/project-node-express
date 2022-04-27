const sc = require('../utils/statusCode');

const validateRate = (req, res, next) => {
  const { talk: { rate } } = req.body;
  // console.log(rate, 'rate');
  if (!Number.isInteger(rate) || !(rate >= 1 && rate <= 5) || rate === 0) {
    return res.status(sc.BAD_REQUEST)
      .json({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
  }
  next();
};

module.exports = validateRate;
