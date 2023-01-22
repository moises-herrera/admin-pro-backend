const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');
const {
  getDoctors,
  createDoctor,
  updateDoctor,
  deleteDoctor,
} = require('../controllers/doctors');

const router = Router();

router.get('/', validateJWT, getDoctors);

router.post(
  '/',
  [
    validateJWT,
    check('name', 'Name is required').not().isEmpty(),
    check('hospital', 'Hospital id is invalid').isMongoId(),
    validateFields,
  ],
  createDoctor
);

router.put(
  '/:id',
  [
    validateJWT,
    check('name', 'Name is required').not().isEmpty(),
    check('hospital', 'Hospital id is invalid').isMongoId(),
    validateFields,
  ],
  updateDoctor
);

router.delete('/:id', validateJWT, deleteDoctor);

module.exports = router;
