const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validate-fields');
const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/users');
const {
  validateJWT,
  validateAdminRole,
  validateUserSelfPermissions,
} = require('../middlewares/validate-jwt');

const router = Router();

router.get('/', validateJWT, getUsers);

router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Email is required').isEmail(),
    check('password', 'Password is required').not().isEmpty(),
    validateFields,
  ],
  createUser
);

router.put(
  '/:id',
  [
    validateJWT,
    validateUserSelfPermissions,
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Email is required').isEmail(),
    check('role', 'Role is required').not().isEmpty(),
    validateFields,
  ],
  updateUser
);

router.delete('/:id', [validateJWT, validateAdminRole], deleteUser);

module.exports = router;
