const crypto = require('crypto');

const generateToken = (req, _res, next) => {
  req.token = crypto.randomBytes(8).toString('hex');
  next();
};

module.exports = generateToken;
