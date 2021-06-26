const path = require('path')

const express = require('express')
const dotenv = require('dotenv')
const colors = require('colors')
const morgan = require('morgan')
const helmet = require('helmet')
const xss = require('xss-clean')
const hpp = require('hpp')
const cors = require('cors')

const errorHandler = require('./middleware/error')

dotenv.config({ path: './config/.env' })

const DBConnection = require('./config/db')

const senatorRoutes = require('./routes/senators')
const stateRoutes = require('./routes/states')

const app = express()

app.use(express.json())

if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'))
}

// Set security headers
app.use(helmet())

// Prevent XSS attacks
app.use(xss())

// Enable CORS
app.use(cors())

// Prevent http param pollution
app.use(hpp())

app.use('/api/v1/senators', senatorRoutes)
app.use('/api/v1/states', stateRoutes)

app.use(errorHandler)

const PORT = process.env.PORT

/*const server = app.listen(PORT, () => {
	console.log(
		`We are live on ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
	)
})*/

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
	console.log(`Error: ${err.message}`.red)
	// Close server & exit process
	server.close(() => process.exit(1))
})
