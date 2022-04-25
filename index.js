const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

const getTalkers = async () => {
  const talkers = await fs.readFile('./talker.json', 'utf-8')
    .then((content) => JSON.parse(content));
  return talkers;
};

app.get('/talker', async (_req, res) => {
  const talkers = await getTalkers();
  console.log(talkers);
  return res.status(200).json(talkers);
});

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});
