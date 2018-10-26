const db = require('./DAL/mysqlDal')
const bcrypt = require('bcryptjs')

class apiUser {

	static async getOne(email) {
		try {
			let sql = 'SELECT * FROM apiusers WHERE email=? LIMIT 1'
			const [row] = await db.execute(sql, [email])
			if (row == undefined || row.length == 0) {
				throw 'no user found'
			}
			return row
		} catch (ex) {
			throw ex
		}
	}

	static async emailExists(email) {
		try {
			const exist = await apiUser.getOne(email)
			if (exist) return true
			return false
		} catch (ex) {
			// don't throw our exception here, we're expecting
			// it for sucessful registration requests
			// throw ex
		}
	}

	static async register(user) {
		try {
			if (!user.email || !user.password) {
				throw 'missing email and/or password'
			}

			var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			if (!re.test(user.email)) {
				let err = new Error('invalid email address')
				err.status = 422
				throw err
			}

			const exist = await apiUser.emailExists(user.email)
			if (exist) {
				let err = new Error('email already registered')
				err.status = 409
				throw err
			}

			let sql = 'INSERT INTO apiusers (email, password) VALUES (?,?)'
			const passHash = await bcrypt.hash(user.password, 8)
			await db.execute(sql, [user.email, passHash])

			const newUser = await apiUser.getOne(user.email)
			if (newUser == undefined || newUser.length == 0) {
				let err = new Error('unknown error in registration')
				err.status = 400
				throw err
			}

			return newUser.apiToken
		} catch (ex) {
			throw ex
		}
	}

	static async authenticate(userCreds) {
		try {
			const user = await apiUser.getOne(userCreds.email)
			if (user == undefined || user.length == 0) return false

			let pmatch = bcrypt.compareSync(userCreds.password, user.password)
			if (!pmatch) throw 'invalid login credentials'

			return user.apiToken
		} catch (ex) {
			throw ex
		}
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

		try {
			let sql = 'SELECT * FROM apiusers WHERE apiToken=? LIMIT 1'
			const [row] = await db.execute(sql, [apiToken])
			if (row == undefined || row.length == 0) return false

			return true
		} catch (ex) {
			throw ex
		}

	}
}

module.exports = apiUser
