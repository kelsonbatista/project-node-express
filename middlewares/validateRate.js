const sc = require('../utils/statusCode');
const md = require('../utils/messageDictionary');

const validateRate = (req, res, next) => {
  const { talk: { rate } } = req.body;
  // console.log(rate, 'rate');
  if (!Number.isInteger(rate) || !(rate >= 1 && rate <= 5) || rate === 0) {
    return res.status(sc.BAD_REQUEST)
      .json({ message: md.FORMAT_RATE });
  }
  next();
};

module.exports = validateRate;
