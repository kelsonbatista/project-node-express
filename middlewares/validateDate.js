const sc = require('../utils/statusCode');
const md = require('../utils/messageDictionary');

const validateDate = (req, res, next) => {
  const { talk: { watchedAt } } = req.body;
  const regexDate = /^\d{1,2}\/\d{1,2}\/\d{4}$/i;
  if (!regexDate.test(watchedAt)) {
    return res.status(sc.BAD_REQUEST)
      .json({ message: md.FORMAT_DATE });
  }
  next();
};

module.exports = validateDate;
