const Joi = require ('@hapi/joi');

// Register user validation
const registerValidation = data => {
  const schema = Joi.object ({
   // username: Joi.string ().min (3).required (),
    email: Joi.string ().min (6).required ().email (),
    password: Joi.string ().min (4).required (),
    passwordVerify: Joi.string().min (4).required (),
  });

  //return Joi.validate (data, schema);

  return schema.validate(data);

};

// login user validation
const loginValidation = data => {
  const schema = Joi.object ({
    email: Joi.string ().min (6).required ().email (),
    password: Joi.string ().min (4).required (),
  });

  return schema.validate(data);
};

module.exports = {registerValidation,loginValidation};
 