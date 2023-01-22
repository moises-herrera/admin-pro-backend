const { response } = require('express');
const bcrypt = require('bcryptjs');

const User = require('../models/user');
const { generateJWT } = require('../helpers/jwt');

const getUsers = async (req, res) => {
  const from = Number(req.query.from) || 0;
  const limitUsers = Number(req.query.limit) || 5;

  const [users, total] = await Promise.all([
    User.find({}, 'name email role google').skip(from).limit(limitUsers),
    User.count(),
  ]);

  res.json({
    ok: true,
    users,
    total,
  });
};

const createUser = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const existsEmail = await User.findOne({ email });

    if (existsEmail) {
      return res.status(400).json({
        ok: false,
        msg: 'Email already exists',
      });
    }

    const user = new User(req.body);

    // Encrypt password
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);

    // Save user
    await user.save();

    // Generate JWT
    const token = await generateJWT(user.id);

    res.json({
      ok: true,
      user,
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

const updateUser = async (req, res = response) => {
  const { id: uid } = req.params;

  try {
    const userDB = await User.findById(uid);

    if (!userDB) {
      return res.status(404).json({
        ok: false,
        msg: 'User not found',
      });
    }

    // Update user
    const { password, google, email, ...fields } = req.body;

    if (userDB.email !== email) {
      const existsEmail = await User.findOne({ email });
      if (existsEmail) {
        return res.status(400).json({
          ok: false,
          msg: 'There is already an account with the email',
        });
      }
    }

    const userUpdated = await User.findByIdAndUpdate(uid, fields, {
      new: true,
    });

    res.json({
      ok: true,
      user: userUpdated,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error unexpected',
    });
  }
};

const deleteUser = async (req, res = response) => {
  const { id: uid } = req.params;

  try {
    const userDB = await User.findById(uid);

    if (!userDB) {
      return res.status(404).json({
        ok: false,
        msg: 'User not found',
      });
    }

    await User.findByIdAndDelete(uid);

    res.json({
      ok: true,
      msg: 'User deleted',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error deleting user',
    });
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
};
