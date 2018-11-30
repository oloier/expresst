const apiDal = require('./DAL/apiDAL')
const bcrypt = require('bcryptjs')

// instantiate our database driver and table
const driver = new apiDal('apiusers', 'userid')

class apiUser {

	static async getOne(email) {
		const sql = 'SELECT * FROM apiusers WHERE email=? LIMIT 1'
		const row = await driver.db.query(sql, [email])
		if (row == undefined || row.length == 0) {
			let err = new Error('user not found')
			err.code = 404
			throw err
		}

		return row[0]
	}

	static async emailExists(email) {
		const exist = await apiUser.getOne(email)
		if (exist) return true
		return false
	}

	static async register(user) {
		if (!user.email || !user.password) {
			let err = new Error('missing email and/or password')
			err.code = 422
			throw err
		}

		var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		if (!re.test(user.email)) {
			let err = new Error('invalid email address')
			err.code = 422
			throw err
		}

		const exist = await apiUser.emailExists(user.email)
		if (exist) {
			let err = new Error('email already registered')
			err.code = 409
			throw err
		}

		// hash and salt the user password, bless the bcrypt
		const passHash = await bcrypt.hash(user.password, 8)

		// populate query with posted form, execute
		let sql = 'INSERT INTO apiusers (email, password) VALUES (?,?)'
		let params = [user.email, passHash]
		await driver.db.execute(sql, params)

		const newUser = await apiUser.getOne(user.email)
		if (newUser == undefined || newUser.length == 0) {
			let err = new Error('unknown error in registration')
			err.code = 400
			throw err
		}
		return newUser.apitoken
	}

	static async authenticate(userCreds) {
		const user = await apiUser.getOne(userCreds.email)

		let pmatch = bcrypt.compareSync(userCreds.password, user.password)
		if (!pmatch || (user == undefined || user.length == 0 || !user.apiToken)) {
			let err = new Error('invalid login credentials')
			err.code = 403
			throw err
		}
		return user.apitoken
	}

	static async authorize(req) {
		// parse the Bearer authorization token:
		const auth = req.headers ? req.headers.authorization || null : null
		if (!auth) return false

		const parts = auth.split(' ')
		if (parts.length < 2) return false

		const schema = parts.shift().toLowerCase()
		if (schema !== 'bearer') return false

		// finally, our parsed token to check in the DB
		const apiToken = parts.join(' ')

		let sql = 'SELECT * FROM apiusers WHERE apiToken = ? LIMIT 1'
		const row = await driver.db.query(sql, [apiToken])
		if (row == undefined || row.length == 0) return false

		return true
	}
}

module.exports = apiUser
