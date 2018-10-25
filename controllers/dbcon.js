const mysql = require('mysql2/promise')

class db {
	static get settings() {
		return {
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_DATABASE
		}
	}

	static async execute(sql, params) {
		try {
			const connect = await mysql.createConnection(db.settings)
			const [rows] = await connect.execute(sql, params)
			return rows
		} catch (error) {
			if (process.env.NODE_ENV == 'dev') {
				throw `Error executing query: "${sql}"; ${error}; ${error.stack}`
			}
		}
	}
}

module.exports = db
