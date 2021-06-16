const db = require('../config/db')

module.exports = class Event {
	constructor(id, name, description, email, is_active,is_publish) {
		this.id = id
		this.name = name
		this.description = description
		this.email = email
		this.is_active = is_active
        this.is_publish = is_publish
		console.log("event constructor")
	}

	save() {
		if (this.id) {
			 console.log('save')
			return db.execute(
				'UPDATE events SET name = ?, description = ?, email = ?, is_active = ?, is_publish = ? WHERE id = ?',
				[this.name, this.description, this.email, this.is_active, this.is_publish]
			)
		} else {
			 console.log('update')
			return db.execute(
				'INSERT INTO events(name, description, email, is_active, is_publish) VALUES(?, ?, ?, ?, ?)',
				[this.name, this.description, this.email, this.is_active, this.is_publish]
			)
		}
	}

	static fetchAll(query) {
		 console.log('query')
		const searchQuery =
			query.name || query.state
				? `WHERE events.name LIKE '%${query.name}%' OR states.state LIKE '%${query.state}%'`
				: ''

		return db.execute(
			`SELECT events.id, events.name, events.email, events.phoneNumber, states.state FROM events INNER JOIN states ON events.state = states.id ${searchQuery} ORDER BY states.id ASC LIMIT ${query.page}, ${query.limit}`
		)
	}
    static getEvents() {
        console.log('getEvents');
		return db.execute('SELECT *FROM events')
	}
	static counts() {
        console.log('count');
		return db.execute('SELECT COUNT(*) AS total FROM events')
	}

	static findById(id) {
        console.log('findbyid');
		return db.execute('SELECT * FROM events WHERE id = ?', [id])
	}

	static findByEmail(email) {
        console.log('findbyemail');
		return db.execute('SELECT email FROM events WHERE email = ?', [email])
	}

	static findByPhoneNumber(phoneNumber) {
		console.log('findByPhoneNumber')
		return db.execute(
			'SELECT phoneNumber FROM events WHERE phoneNumber = ?',
			[phoneNumber]
		)
	}

	static deleteById(id) {
        console.log('deletebyid');
		return db.execute('DELETE FROM events WHERE id = ? LIMIT 1', [id])
	}
}
