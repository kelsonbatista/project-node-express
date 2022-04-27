const sc = require('../utils/statusCode');
const md = require('../utils/messageDictionary');

const validateName = (req, res, next) => {
  const { name } = req.body;
  if (!name) return res.status(sc.BAD_REQUEST).json({ message: md.REQUIRED_NAME });
  if (name.length < 3) {
    return res.status(sc.BAD_REQUEST)
    .json({ message: md.FORMAT_NAME });
  }
  next();
};

module.exports = validateName;
