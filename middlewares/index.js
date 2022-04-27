const getTalkers = require('./getTalkers');
const errors = require('./errors');
const validateEmail = require('./validateEmail');
const validatePassword = require('./validatePassword');
const validateToken = require('./validateToken');
const validateName = require('./validateName');
const validateAge = require('./validateAge');
const validateDate = require('./validateDate');
const validateRate = require('./validateRate');
const validateTalk = require('./validateTalk');
const generateToken = require('./generateToken');

module.exports = {
  getTalkers,
  errors,
  validateEmail,
  validatePassword,
  validateToken,
  validateName,
  validateAge,
  validateDate,
  validateRate,
  validateTalk,
  generateToken,
};
