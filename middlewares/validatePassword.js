const sc = require('../utils/statusCode');
const md = require('../utils/messageDictionary');

const validatePassword = (req, res, next) => {
  const { password } = req.body;
  if (!password) {
    return res.status(sc.BAD_REQUEST).json({ message: md.REQUIRED_PASSWORD });
  }
  const validatePass = (password.toString()).length > 5;
  if (!validatePass) {
    return res.status(sc.BAD_REQUEST)
    .json({ message: md.FORMAT_PASSWORD });
  }
  next();
};

module.exports = validatePassword;
