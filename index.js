const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const crypto = require('crypto');
const sc = require('./utils/statusCode');
const mw = require('./middlewares');

const app = express();
app.use(bodyParser.json());

const PORT = '3000';

const setTalkers = (content) => {
  const talkers = fs.writeFile('./talker.json', JSON.stringify(content));
  return talkers;
};

const generateToken = () => {
  const token = crypto.randomBytes(8).toString('hex');
  return token;
};

app.get('/talker', mw.getTalkers, (req, res) => {
  try {
    console.log(mw.getTalkers, 'get');
    const { talkers } = req;
    return res.status(sc.OK_STATUS).json(talkers);
  } catch (error) {
    return res.status(sc.INTERNAL_SERVER_ERROR)
      .json({ message: 'Error 500 - Internal Server Error' });
  }
});

app.get('/talker/search?', mw.validateToken, mw.getTalkers, (req, res) => {
  try {
    const { talkers, query: { q } } = req;
    if (!q) return res.status(sc.OK_STATUS).json(talkers);
    const filterTalker = talkers
      .filter(({ name }) => name.toLowerCase().includes(q.toLowerCase()));
    if (!filterTalker) return res.status(200).json(talkers);
    return res.status(sc.OK_STATUS).json(filterTalker);
  } catch (error) {
    return res.status(sc.INTERNAL_SERVER_ERROR)
      .json({ message: 'Error 500 - Internal Server Error' });
  }
});

app.get('/talker/:id', mw.getTalkers, (req, res) => {
  try {
    const { talkers, params: { id } } = req;
    const talkerId = talkers.find((talker) => talker.id === Number(id));
    if (!talkerId) return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
    return res.status(sc.OK_STATUS).json(talkerId);
  } catch (error) {
    return res.status(sc.INTERNAL_SERVER_ERROR)
      .json({ message: 'Error 500 - Internal Server Error' });
  }
});

app.post('/login', mw.validateEmail, mw.validatePassword, (_req, res) => {
  const token = generateToken();
  return res.status(sc.OK_STATUS).json({ token });
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
  async (req, res) => {
    const { talkers } = req;
    const newTalker = req.body;
    Object.assign(newTalker, { id: 5 });
    talkers.push(newTalker);
    await setTalkers(talkers);
    return res.status(sc.CREATED).json(newTalker);
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
  async (req, res) => {
    const { talkers, params: { id }} = req;
    const newTalker = req.body;
    Object.assign(newTalker, { id: Number(id) });
    const filterTalker = talkers.filter((talker) => talker.id !== Number(id));
    filterTalker.push(newTalker);
    await setTalkers(filterTalker);
    return res.status(sc.OK_STATUS).json(newTalker);
  },
);

app.delete('/talker/:id', mw.validateToken, mw.getTalkers, async (req, res) => {
    try {
      const { talkers, params: { id } } = req;
      console.log(talkers);
      const filterTalker = talkers.filter((talker) => talker.id !== Number(id));
      await setTalkers(filterTalker);
      return res.status(sc.NO_CONTENT).json(filterTalker);
    } catch (error) {
      return res.status(sc.INTERNAL_SERVER_ERROR)
        .json({ message: `${error}` });
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
