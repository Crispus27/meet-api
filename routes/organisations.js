const express = require('express');
const multer  = require('multer');
const hp = require('../utils/helpers');
const path = require('path');
const {
	getOrganisations,
	getOrganisation,
	getOrganisationsCount,
	createOrganisation,
	sendOrganisationEmail,
	updateOrganisation,
	uploadImage,
	deleteOrganisation,
	all,
} = require('../controllers/organisationController')

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, process.env.FILE_BASE_URL)
    },
    filename: function (req, file, cb) {
        let name = file.fieldname+'-'+hp.generateString()+ '-' + Date.now()+path.extname(file.originalname);
        cb(null,name)
    }
});
let uploadOrganisationImage = multer({ storage: storage });
const router = express.Router();
const { body} = require('express-validator');

let uploadImgRules = [
    body('slug').isString(),
    body('type').isString().isIn(['logo','cover']),
];
let addRules = [
    body('name').isString(),
    body('email').isString().isEmail(),
];
router.post('/upload/image',uploadOrganisationImage.single('image'),uploadImgRules,uploadImage)
router.route('/').get(getOrganisations).post(addRules,createOrganisation)

//router.route('/count').get(getOrganisationsCount)

//router.route('/:id').get(getOrganisation).put(updateOrganisation).delete(deleteOrganisation)


module.exports = router
