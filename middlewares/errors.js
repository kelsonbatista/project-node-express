const sc = require('../utils/statusCode');

const errors = (err, _req, res, _next) => {
  if (err) {
    return res.status(sc.INTERNAL_SERVER_ERROR)
      .json({ message: 'Error 500 - Internal Server Error' });
  }
};

module.exports = errors;
