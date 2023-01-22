const { Router } = require('express');
const { getAll, getDocumentCollection } = require('../controllers/searches');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();

router.get('/:search', validateJWT, getAll);
router.get('/collection/:document/:search', validateJWT, getDocumentCollection);

module.exports = router;
