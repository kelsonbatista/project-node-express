const sc = require('../utils/statusCode');
const md = require('../utils/messageDictionary');

const errors = (err, _req, res, _next) => {
  if (err.status) {
    return res.status(err.status).json({ message: err.message });
  }
  if (err) {
    console.log(err.message);
    return res.status(sc.INTERNAL_SERVER_ERROR)
      .json({ message: md.INTERNAL_SERVER_ERROR });
  }
};

module.exports = errors;
