const mysql2 = require('mysql2/promise')

class MySQL {
	static get settings() {
		return {
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_DATABASE,
			port: process.env.DB_PORT
		}
	}

	static async query(sql, params) {
		const connect = await mysql2.createConnection(MySQL.settings)
		const [rows] = await connect.execute(sql, params)
		return rows
	}

	static async execute(sql, params) {
		const connect = await mysql2.createConnection(MySQL.settings)
		const [rows] = await connect.query(sql, params)
		return rows
	}
}

module.exports = MySQL
