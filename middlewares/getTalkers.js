const fs = require('fs').promises;

const getTalkers = async (req, _res, next) => {
  const talkers = await fs.readFile('./talker.json', 'utf-8')
    .then((content) => JSON.parse(content));
  req.talkers = talkers;
  next();
};

module.exports = getTalkers;
