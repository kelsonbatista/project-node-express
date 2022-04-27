const sc = require('../utils/statusCode');
const md = require('../utils/messageDictionary');

const validateTalk = (req, res, next) => {
  const { talk } = req.body;
  if (!talk) {
    return res.status(sc.BAD_REQUEST)
    .json({ message: md.REQUIRED_TALK });
  }
  if (talk.rate === 0) {
    return res.status(sc.BAD_REQUEST)
    .json({ message: md.FORMAT_RATE });
  }
  if (!talk.watchedAt || !talk.rate) {
    return res.status(sc.BAD_REQUEST)
    .json({ message: md.REQUIRED_TALK });
  }
  next();
};

module.exports = validateTalk;
