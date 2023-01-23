const { Router } = require('express');
const expressFileUpload = require('express-fileupload');

const { uploadFile, getImage } = require('../controllers/uploads');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();

router.use(expressFileUpload());

router.put('/:type/:id', validateJWT, uploadFile);
router.get('/:type/:photo', getImage);

module.exports = router;
