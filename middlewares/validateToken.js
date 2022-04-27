const sc = require('../utils/statusCode');

const validateToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(sc.UNAUTHORIZED).json({ message: 'Token não encontrado' });
  if ((token.toString()).length !== 16) {
    return res.status(sc.UNAUTHORIZED).json({ message: 'Token inválido' });
  }
  next();
};

module.exports = validateToken;
