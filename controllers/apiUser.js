const apiDal = require("./DAL/apiDAL")
const bcrypt = require("bcryptjs")

// instantiate our database driver and table
const driver = new apiDal("apiusers", "userid")


/**
 * static api user class used for registration, retrieval of access token, and auth'ing requests
 * @class apiUser
 */
class apiUser {

	/**
	 * returns one and only unique row matching passed email string
	 * @static
	 * @param {string} email
	 * @returns
	 * @memberof apiUser
	 */
	static async getOne(email) {
		const sql = "SELECT * FROM apiusers WHERE email=? LIMIT 1"
		const row = await driver.db.query(sql, [email])
		if (row === undefined || row.length === 0) {
			return undefined
		}
		return row[0]
	}

	/**
	 * check if provided email exists as registered api user
	 * @static
	 * @param {*} email
	 * @returns {boolean} returns if user with provided email was found
	 * @memberof apiUser
	 */
	static async emailExists(email) {
		return !!(await apiUser.getOne(email) || false)
	}


	/**
	 * registers new api user to apiusers table in chosen db engine
	 * @static
	 * @param {Object} user - user object containing api user's email and password
	 * @returns
	 * @memberof apiUser
	 */
	static async register(user) {
		if (!user.email || !user.password) {
			const err = new Error("missing email and/or password")
			err.code = 422
			throw err
		}

		const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		if (!re.test(user.email)) {
			const err = new Error("invalid email address")
			err.code = 422
			throw err
		}

		// if email is found, throw error state; disallows duplicate registration
		const exist = await apiUser.emailExists(user.email)
		if (exist) {
			const err = new Error("email already registered")
			err.code = 409
			throw err
		}

		// hash and salt the user password, bless the bcrypt
		const passHash = await bcrypt.hash(user.password, 8)

		// populate query with posted form, execute
		const sql = "INSERT INTO apiusers (email, password) VALUES (?,?)"
		const params = [user.email, passHash]
		await driver.db.execute(sql, params)
		
		const newUser = await apiUser.getOne(user.email)
		if (newUser === undefined || newUser.length === 0) {
			const err = new Error("unknown error in registration")
			err.code = 400
			throw err
		}
		return newUser.apitoken
	}


	/**
	 * checks for matching api user email and password
	 * @static
	 * @param {Object} userCreds - api user's email and password keys in object
	 * @returns user's api access token
	 * @memberof apiUser
	 */
	static async authenticate(userCreds) {
		const user = await apiUser.getOne(userCreds.email)

		const pmatch = bcrypt.compareSync(userCreds.password, user.password)
		if (!pmatch || (user === undefined || !user.apitoken)) {
			const err = new Error("invalid login credentials")
			err.code = 403
			throw err
		}
		return user.apitoken
	}


	/**
	 * authorizes each request on the API; checks for a valid bearer authorization token
	 * @static
	 * @param {Object} req - request object, (assuming) containing submitted auth headers
	 * @returns
	 * @memberof apiUser
	 */
	static async authorize(req) {
		// parse the Bearer authorization token:
		const auth = req.headers ? req.headers.authorization || null : null
		if (!auth) {
			return false
		}

		// check if we received a bearer prefix in our request token 
		const parts = auth.split(" ")
		if (parts.length < 2) {
			return false
		}
		const schema = parts.shift().toLowerCase()
		if (schema !== "bearer") {
			return false
		}

		// finally, our parsed token to check in the DB
		const apiToken = parts.join(" ")
		const sql = "SELECT * FROM apiusers WHERE apiToken = ? LIMIT 1"
		const row = await driver.db.query(sql, [apiToken])
		if (row === undefined || row.length === 0) {
			return false
		}

		return true
	}
}

module.exports = apiUser
