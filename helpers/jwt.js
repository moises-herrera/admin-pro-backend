const jwt = require('jsonwebtoken');

const generateJWT = async (uid) => {
  return new Promise((resolve, reject) => {
    const payload = {
      uid,
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
        expiresIn: '12h',
      },
      (err, token) => {
        if (err) {
          console.log(err);
          reject('Error creating JWT');
        } else {
          resolve(token);
        }
      }
    );
  });
};

module.exports = {
  generateJWT,
};
