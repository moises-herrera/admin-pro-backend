const jwt = require('jsonwebtoken');
const User = require('../models/user');

const validateJWT = (req, res, next) => {
  // Read token
  const token = req.header('x-token');

  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: 'Access denied',
    });
  }

  try {
    const { uid } = jwt.verify(token, process.env.JWT_SECRET);
    req.uid = uid;

    next();
  } catch (error) {
    return res.status(401).json({
      ok: false,
      msg: 'Invalid token',
    });
  }
};

const validateAdminRole = async (req, res, next) => {
  const { uid } = req;

  try {
    const userDB = await User.findById(uid);

    if (!userDB) {
      return res.status(404).json({
        ok: false,
        msg: 'User not found',
      });
    }

    if (userDB.role !== 'ADMIN_ROLE') {
      return res.status(403).json({
        ok: false,
        msg: 'Access denied',
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: 'Something went wrong',
    });
  }
};

const validateUserSelfPermissions = async (req, res, next) => {
  const {
    uid,
    params: { id },
  } = req;

  try {
    const userDB = await User.findById(uid);

    if (!userDB) {
      return res.status(404).json({
        ok: false,
        msg: 'User not found',
      });
    }

    if (userDB.role !== 'ADMIN_ROLE' && uid !== id) {
      return res.status(403).json({
        ok: false,
        msg: 'Access denied',
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: 'Something went wrong',
    });
  }
};

module.exports = {
  validateJWT,
  validateAdminRole,
  validateUserSelfPermissions,
};
