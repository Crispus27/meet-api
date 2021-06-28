const express = require('express');
const multer  = require('multer');
const hp = require('../utils/helpers');
const path = require('path');
const {
	getOrganisations,
	getOneOrganisation,
    activateOrDeactivateOrg,
	getOrganisationsCount,
    assignFuncToUser,
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
let assignRules = [
    body('user_id').isNumeric(),
    body('organisation_id').isNumeric(),
    body('function_id').isNumeric(),
];
router.post('/upload/image',uploadOrganisationImage.single('image'),uploadImgRules,uploadImage)
router.route('/').get(getOrganisations).post(addRules,createOrganisation)
//router.route('/count').get(getOrganisationsCount)
router.route('/:id').get(getOneOrganisation).put(addRules,updateOrganisation).patch(activateOrDeactivateOrg).delete(deleteOrganisation)
router.route('/assign_function').post(assignRules,assignFuncToUser);

module.exports = router
