const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const sc = require('./utils/statusCode');
const mw = require('./middlewares');
const errorConstructor = require('./utils/errorConstructor');
const md = require('./utils/messageDictionary');

const app = express();
app.use(bodyParser.json());

const PORT = '3000';

const setTalkers = (content) => {
  const talkers = fs.writeFile('./talker.json', JSON.stringify(content));
  return talkers;
};

app.get('/talker', mw.getTalkers, (req, res, next) => {
  try {
    const { talkers } = req;
    return res.status(sc.OK_STATUS).json(talkers);
  } catch (err) {
    next(err);
  }
});

app.get('/talker/search?', mw.validateToken, mw.getTalkers, (req, res, next) => {
  try {
    const { talkers, query: { q } } = req;
    if (!q) return res.status(sc.OK_STATUS).json(talkers);
    const filterTalker = talkers
      .filter(({ name }) => name.toLowerCase().includes(q.toLowerCase()));
    if (!filterTalker) return res.status(sc.OK_STATUS).json(talkers);
    return res.status(sc.OK_STATUS).json(filterTalker);
  } catch (err) {
    next(err);
  }
});

app.get('/talker/:id', mw.getTalkers, (req, res, next) => {
  try {
    const { talkers, params: { id } } = req;
    const talkerId = talkers.find((talker) => talker.id === Number(id));
    if (!talkerId) {
      next(errorConstructor(sc.NOT_FOUND, md.TALKER_NOT_FOUND));
    }
    return res.status(sc.OK_STATUS).json(talkerId);
  } catch (err) {
    next(err);
  }
});

app.post('/login', mw.validateEmail, mw.validatePassword, mw.generateToken, (req, res, next) => {
  try {
    const { token } = req;
    // console.log(token, 'token');
    return res.status(sc.OK_STATUS).json({ token });
  } catch (err) {
    next(err);
  }
});

app.post(
  '/talker',
  mw.validateToken,
  mw.validateName,
  mw.validateAge,
  mw.validateTalk,
  mw.validateDate,
  mw.validateRate,
  mw.getTalkers,
  async (req, res, next) => {
    try {
      const { talkers } = req;
      const newTalker = req.body;
      Object.assign(newTalker, { id: 5 });
      talkers.push(newTalker);
      await setTalkers(talkers);
      return res.status(sc.CREATED).json(newTalker);
    } catch (err) {
      next(err);
    }
  },
);

app.put(
  '/talker/:id',
  mw.validateToken,
  mw.validateName,
  mw.validateAge,
  mw.validateTalk,
  mw.validateDate,
  mw.validateRate,
  mw.getTalkers,
  async (req, res, next) => {
    try {
      const { talkers, params: { id } } = req;
      const newTalker = req.body;
      Object.assign(newTalker, { id: Number(id) });
      const filterTalker = talkers.filter((talker) => talker.id !== Number(id));
      filterTalker.push(newTalker);
      await setTalkers(filterTalker);
      return res.status(sc.OK_STATUS).json(newTalker);
    } catch (err) {
      next(err);
    }
  },
);

app.delete('/talker/:id', mw.validateToken, mw.getTalkers, async (req, res, next) => {
    try {
      const { talkers, params: { id } } = req;
      // console.log(talkers);
      const filterTalker = talkers.filter((talker) => talker.id !== Number(id));
      await setTalkers(filterTalker);
      return res.status(sc.NO_CONTENT).json(filterTalker);
    } catch (err) {
      next(err);
    }
});

app.use(mw.errors);

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(sc.OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});
