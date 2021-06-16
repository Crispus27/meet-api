const Joi = require('joi')

exports.senatorValidation = (data) => {
	const schema = Joi.object({
		name: Joi.string().min(3).required(),
		phoneNumber: Joi.string().min(11).max(11).required().label('Phone number'),
		email: Joi.string().email().required(),
		state: Joi.number().required(),
	})

	return schema.validate(data, { abortEarly: false })
}
