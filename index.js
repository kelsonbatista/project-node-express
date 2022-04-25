const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const crypto = require('crypto');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

const getTalkers = async () => {
  const talkers = await fs.readFile('./talker.json', 'utf-8')
    .then((content) => JSON.parse(content));
  return talkers;
};

const generateToken = () => {
  return crypto.randomBytes(8).toString('hex');
};

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

app.get('/talker', async (_req, res) => {
  const talkers = await getTalkers();
  console.log(talkers);
  return res.status(200).json(talkers);
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

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});
