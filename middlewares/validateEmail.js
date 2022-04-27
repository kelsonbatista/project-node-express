const sc = require('../utils/statusCode');
const md = require('../utils/messageDictionary');

const validateEmail = (req, res, next) => {
  const { email } = req.body;
  if (!(email)) {
    return res.status(sc.BAD_REQUEST).json({ message: md.REQUIRED_EMAIL });
  }
  const regexEmail = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})$/;
  const validate = regexEmail.test(email);
  if (!validate) {
    return res.status(sc.BAD_REQUEST)
    .json({ message: md.FORMAT_EMAIL });
  }
  next();
};

module.exports = validateEmail;
