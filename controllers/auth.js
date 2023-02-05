const { response } = require('express');
const bcrypt = require('bcryptjs');

const User = require('../models/user');
const { generateJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');
const { getMenuFrontend } = require('../helpers/menu-frontend');

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
      menu: getMenuFrontend(userDB.role),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error unexpected',
    });
  }
};

const googleSignIn = async (req, res = response) => {
  try {
    const { email, name, picture } = await googleVerify(req.body.token);

    const userDB = await User.findOne({ email });
    let user;

    if (!userDB) {
      user = new User({
        name,
        email,
        password: 'dhwf@',
        img: picture,
        google: true,
      });
    } else {
      user = userDB;
      user.google = true;
    }

    // Save user
    await user.save();

    // Generate JWT
    const token = await generateJWT(user.id);

    res.json({
      ok: true,
      token,
      menu: getMenuFrontend(user.role),
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      ok: false,
      msg: 'Google token invalid',
    });
  }
};

const renewToken = async (req, res = response) => {
  const { uid } = req;

  try {
    // Generate JWT
    const token = await generateJWT(uid);

    const user = await User.findById(uid);

    res.json({
      ok: true,
      token,
      user,
      menu: getMenuFrontend(user.role),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Something went wrong',
    });
  }
};

module.exports = {
  login,
  googleSignIn,
  renewToken,
};
