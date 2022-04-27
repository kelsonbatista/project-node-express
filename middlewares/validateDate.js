const sc = require('../utils/statusCode');

const validateDate = (req, res, next) => {
  const { talk: { watchedAt } } = req.body;
  const regexDate = /^\d{1,2}\/\d{1,2}\/\d{4}$/i;
  if (!regexDate.test(watchedAt)) {
    return res.status(sc.BAD_REQUEST)
      .json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
  }
  next();
};

module.exports = validateDate;
