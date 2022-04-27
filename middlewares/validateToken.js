const sc = require('../utils/statusCode');
const md = require('../utils/messageDictionary');

const validateToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(sc.UNAUTHORIZED).json({ message: md.TOKEN_FOUND });
  if ((token.toString()).length !== 16) {
    return res.status(sc.UNAUTHORIZED).json({ message: md.TOKEN_INVALID });
  }
  next();
};

module.exports = validateToken;
