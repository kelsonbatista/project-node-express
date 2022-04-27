const sc = require('../utils/statusCode');
const md = require('../utils/messageDictionary');

const validateAge = (req, res, next) => {
  const { age } = req.body;
  if (!age) return res.status(sc.BAD_REQUEST).json({ message: md.REQUIRED_AGE });
  if (!(Number.isInteger(age) && age >= 18)) {
    return res.status(sc.BAD_REQUEST)
      .json({ message: md.FORMAT_AGE });
  }
  next();
};

module.exports = validateAge;
