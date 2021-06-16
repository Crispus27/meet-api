const express = require('express')
const {
	getEvents,
	getEvent,
	getEventsCount,
	createEvent,
	sendEventEmail,
	updateEvent,
	deleteEvent,
	all,
} = require('../controllers/eventController')

const advancedResults = require('../middleware/advancedResults')
const Event = require('../models/Event')

const router = express.Router()

router.route('/').get(getEvents).post(createEvent)

router.route('/count').get(getEventsCount)

router.route('/:id').get(getEvent).put(updateEvent).delete(deleteEvent)

router.route('/:id/send-email').post(sendEventEmail)

module.exports = router
