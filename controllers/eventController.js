const asyncHandler = require('../middleware/async')
const ErrorResponse = require('../utils/errorResponse')
const Event = require('../models/Event')
//const { eventValidation } = require('../utils/validations')
// const sendEmail = require('../utils/sendEmail')
//const postmark = require('postmark')
//const client = new postmark.ServerClient('a25eb8b2-e370-4b61-8138-da4581ec16d5')

// @desc    Get all events
// @route   GET /api/v1/events
// @access  Public
exports.getEvents = asyncHandler(async (req, res, next) => {
	const [events] = await Event.getEvents()
	res.status(200).json({ success: true, data: events, nbr: events.length })
})

// @desc    Get single event
// @route   GET /api/v1/event/:id
// @access  Public
exports.getEvent = asyncHandler(async (req, res, next) => {
	const [event] = await Event.findById(req.params.id)
	if (!event.length)
		return next(
			new ErrorResponse(`No event with that id of ${req.params.id}`)
		)
	res.status(200).json({ success: true, data: event })
})

// @desc    Get event count
// @route   GET /api/v1/events/count
// @access  Public
exports.getEventsCount = asyncHandler(async (req, res, next) => {
	const [[total]] = await Event.counts()

	res.status(200).json({ success: true, data: total.total })
})

// @desc    Create event
// @route   POST /api/v1/events
// @access  Public
exports.createEvent = asyncHandler(async (req, res, next) => {
	const { name, description, email, is_active,is_publish } = req.body

	const { error } = senatorValidation(req.body)

	if (error) {
		const errors = error.details.map((err) => {
			return {
				path: err.path[0],
				message: err.message,
			}
		})
		return next(new ErrorResponse(null, 400, errors))
	}

	let [findEmail] = await Event.findByEmail(email)

	if (findEmail.length) {
		return next(new ErrorResponse(null, 400, { Email: 'Email already taken' }))
	}

	let [findPhoneNumber] = await Event.findByPhoneNumber(phoneNumber)

	if (findPhoneNumber.length)
		return next(
			new ErrorResponse(null, 400, {
				'Phone Number': 'Phone numer already taken',
			})
		)

	let event = new Event(null, name, description, email, is_active, is_publish)
	event.save()

	delete event.id
	res.status(201).json({ success: true, data: event })
})

// @desc    Update senator
// @route   PUT /api/v1/senators/:id
// @access  Senators
exports.updateEvent = asyncHandler(async (req, res, next) => {
	const { name, phoneNumber, email, state } = req.body

	let [event] = await Event.findById(req.params.id)

	if (!event.length)
		return next(
			new ErrorResponse(`No senator with that id of ${req.params.id}`)
		)

	const { error } = senatorValidation(req.body)

	if (error) {
		const errors = error.details.map((err) => {
			return {
				path: err.path[0],
				message: err.message,
			}
		})
		return next(new ErrorResponse(null, 400, errors))
	}

	let [findEmail] = await Senator.findByEmail(email)

	if (findEmail.length && email !== senator[0].email) {
		return next(new ErrorResponse(null, 400, { Email: 'Email already taken' }))
	}

	let [findPhoneNumber] = await Senator.findByPhoneNumber(phoneNumber)

	if (findPhoneNumber.length && phoneNumber !== senator[0].phoneNumber) {
		return next(
			new ErrorResponse(null, 400, {
				'Phone Number': 'Phone numer already taken',
			})
		)
	}

	senator = new Event(req.params.id, name, phoneNumber, email, state)
	const reagan = await event.save()
	console.log(reagan)
	res.status(200).json({ success: true, data: senator })
})

// @desc    Send email to senator
// @route   POST /api/v1/senators/:id/send-email
// @access  Public
exports.sendEventEmail = asyncHandler(async (req, res, next) => {
	const [senator] = await Senator.findById(req.params.id)

	if (!senator.length)
		return next(
			new ErrorResponse(`No senator with that id of ${req.params.id}`)
		)

	try {
		// client.sendEmail({
		// 	From: 'techreagan@egbape.com',
		// 	To: senator[0].email,
		// 	Subject: req.body.subject,
		// 	TextBody: req.body.message,
		// 	MessageStream: 'outbound',
		// })
		res.status(200).json({ success: true, data: 'Email sent' })
	} catch (err) {
		return next(new ErrorResponse('Email could not be sent', 500))
	}
	// try {
	// 	await sendEmail({
	// 		email: senator[0].email,
	// 		subject: req.body.subject,
	// 		message: req.body.message,
	// 	})
	// 	res.status(200).json({ success: true, data: 'Email sent' })
	// } catch (err) {
	// 	return next(new ErrorResponse('Email could not be sent', 500))
	// }
})
// @desc    Delete senator
// @route   DELETE /api/v1/senators/:id
// @access  Public
exports.deleteEvent = asyncHandler(async (req, res, next) => {
	const [senator] = await Senator.findById(req.params.id)

	if (!senator.length)
		return next(
			new ErrorResponse(`No senator with that id of ${req.params.id}`)
		)

	await Senator.deleteById(req.params.id)

	res.status(200).json({ success: true, data: {} })
})
