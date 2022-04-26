const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const crypto = require('crypto');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

const getTalkers = () => {
  const talkers = fs.readFile('./talker.json', 'utf-8')
    .then((content) => JSON.parse(content));
  return talkers;
};

const setTalkers = (content) => {
  const talkers = fs.writeFile('./talker.json', JSON.stringify(content));
  return talkers;
};

const generateToken = () => {
  const token = crypto.randomBytes(8).toString('hex');
  return token;
};

// const generateId = () => {
//   const talkers = getTalkers();
// };

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  if (!(email)) return res.status(400).json({ message: 'O campo "email" é obrigatório' });
  const regexEmail = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})$/;
  const validateEmail = regexEmail.test(email);
  if (!validateEmail) {
    return res.status(400)
    .json({ message: 'O "email" deve ter o formato "email@email.com"' });
  }

  if (!password) return res.status(400).json({ message: 'O campo "password" é obrigatório' }); 
  const validatePassword = (password.toString()).length > 5;
  if (!validatePassword) {
    return res.status(400)
    .json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
  }
  next();
};

const validateToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: 'Token não encontrado' });
  if ((token.toString()).length !== 16) return res.status(401).json({ message: 'Token inválido' });
  next();
};

const validateName = (req, res, next) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'O campo "name" é obrigatório' });
  if (name.length < 3) {
    return res.status(400)
    .json({ message: 'O "name" deve ter pelo menos 3 caracteres' });
  }
  next();
};

const validateAge = (req, res, next) => {
  const { age } = req.body;
  if (!age) return res.status(400).json({ message: 'O campo "age" é obrigatório' });
  if (!(Number.isInteger(age) && age >= 18)) {
    return res.status(400).json({ message: 'A pessoa palestrante deve ser maior de idade' });
  }
  next();
};

const validateDate = (req, res, next) => {
  const { talk: { watchedAt } } = req.body;
  const regexDate = /^\d{1,2}\/\d{1,2}\/\d{4}$/i;
  if (!regexDate.test(watchedAt)) {
    return res.status(400).json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
  }
  next();
};

const validateRate = (req, res, next) => {
  const { talk: { rate } } = req.body;
  // console.log(rate, 'rate');
  if (!Number.isInteger(rate) || !(rate >= 1 && rate <= 5) || rate === 0) {
    return res.status(400).json({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
  }
  next();
};

const validateTalk = (req, res, next) => {
  const { talk } = req.body;
  if (!talk) {
    return res.status(400)
    .json({ message: 'O campo "talk" é obrigatório e "watchedAt" e "rate" não podem ser vazios' });
  }
  if (talk.rate === 0) {
    return res.status(400).json({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
  }
  if (!talk.watchedAt || !talk.rate) {
    return res.status(400)
    .json({ message: 'O campo "talk" é obrigatório e "watchedAt" e "rate" não podem ser vazios' });
  }
  next();
};

app.get('/talker', async (_req, res) => {
  const talkers = await getTalkers();
  // console.log(talkers);
  return res.status(200).json(talkers);
});

app.get('/talker/search', validateToken, async (req, res) => {
  const talkers = await getTalkers();
  const { q } = req.query;
  if (!q) return res.status(200).json(talkers);
  const filterTalker = talkers
    .filter(({ name }) => name.toLowerCase().includes(q.toLowerCase()));
  if (!filterTalker) return res.status(200).json(talkers);
  return res.status(200).json(filterTalker);
});

app.get('/talker/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const talkers = await getTalkers();
    const talkerId = talkers.find((talker) => talker.id === Number(id));
    if (!talkerId) return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
    return res.status(200).json(talkerId);
  } catch (err) {
    return res.status(500).json({ message: `Error found: ${err}` });
  }
});

app.post('/login', validateLogin, (req, res) => {
  const token = generateToken();
  return res.status(200).json({ token });
});

app.post(
  '/talker',
  validateToken,
  validateName,
  validateAge,
  validateTalk,
  validateDate,
  validateRate,
  async (req, res) => {
    const newTalker = req.body;
    Object.assign(newTalker, { id: 5 });
    const talkers = await getTalkers();
    talkers.push(newTalker);
    await setTalkers(talkers);
    return res.status(201).json(newTalker);
  },
);

app.put(
  '/talker/:id',
  validateToken,
  validateName,
  validateAge,
  validateTalk,
  validateDate,
  validateRate,
  async (req, res) => {
    const { id } = req.params;
    const newTalker = req.body;
    Object.assign(newTalker, { id: Number(id) });
    const talkers = await getTalkers();
    const filterTalker = talkers.filter((talker) => talker.id !== Number(id));
    filterTalker.push(newTalker);
    await setTalkers(filterTalker);
    return res.status(200).json(newTalker);
  },
);

app.delete('/talker/:id', validateToken, async (req, res) => {
    const { id } = req.params;
    const talkers = await getTalkers();
    const filterTalker = talkers.filter((talker) => talker.id !== Number(id));
    await setTalkers(filterTalker);
    return res.status(204).json(filterTalker);
});

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});
