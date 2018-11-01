const mysql2 = require('mysql2/promise')

class MySQL {
	static get settings() {
		return {
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
<<<<<<< HEAD
			database: process.env.DB_DATABASE,
			port: 1234
=======
			database: process.env.DB_DATABASE
>>>>>>> 4563525f09e227eb68635bef89671ed41ca37ca1
		}
	}

	static async execute(sql, params) {
		try {
			const connect = await mysql2.createConnection(MySQL.settings)
			const [rows] = await connect.execute(sql, params)
			return rows
		} catch (error) {
			if (process.env.NODE_ENV == 'development') {
				throw `Error executing: "${sql}"; ${error}; ${error.stack}`
			}
		}
	}

	static async query(sql, params) {
		try {
			const connect = await mysql2.createConnection(MySQL.settings)
			const [rows] = await connect.query(sql, params)
			return rows
		} catch (error) {
			if (process.env.NODE_ENV == 'development') {
				throw `Error querying: "${sql}"; ${error}; ${error.stack}`
			}
		}
	}
}

module.exports = MySQL
