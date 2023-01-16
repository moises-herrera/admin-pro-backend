const { response } = require('express');
const bcrypt = require('bcryptjs');

const User = require('../models/user');
const { generateJWT } = require('../helpers/jwt');

const login = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    // Verify email
    const userDB = await User.findOne({ email });

    if (!userDB) {
      return res.status(404).json({
        ok: false,
        msg: 'Email or password are invalid',
      });
    }

    // Verify password
    const isPasswordValid = bcrypt.compareSync(password, userDB.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        ok: false,
        msg: 'Invalid password',
      });
    }

    // Generate JWT
    const token = await generateJWT(userDB.id);

    res.json({
      ok: true,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error unexpected',
    });
  }
};

module.exports = {
  login,
};
