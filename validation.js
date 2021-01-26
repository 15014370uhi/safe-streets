const Joi = require ('@hapi/joi');

// Register user validation
const registerValidation = data => {
  const schema = {
    username: Joi.string ().min (3).required (),
    email: Joi.string ().min (6).required ().email (),
    password: Joi.string ().min (6).required (),
  };

  return Joi.validate (data, schema);
};

// login user validation
const loginValidation = data => {
  const schema = {
    email: Joi.string ().min (6).required ().email (),
    password: Joi.string ().min (6).required (),
  };

  return Joi.validate (data, schema);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
