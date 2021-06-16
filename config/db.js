const { createPool } = require('mysql2')
// const dotenv = require('dotenv')
// dotenv.config({ path: '.env' })
const pool = createPool({
	host: process.env.MYSQL_HOST,
	user: "root",
	password: "",
	database: "meet",
	//socketPath: '/var/run/mysqld/mysqld.sock',
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0,
})

module.exports = pool.promise()
