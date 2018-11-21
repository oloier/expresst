const {Client} = require('pg')
const sqlstring = require('./prepareExecute')
const prepareExecute = require('./prepareExecute')

class PostgreSQL {
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
		let postgre
		try {
			postgre = new Client(PostgreSQL.settings)
			await postgre.connect()

			// replace ? with $1, $2 for proper prepared postgres
			sql = prepareExecute.postgreParamSyntax(sql)

			const result = await postgre.query(sql, params)
			return result.rows
		} catch (error) {
			if (process.env.NODE_ENV == 'development')
				throw `Error executing: ${sql}; ${error}; ${error.stack}`
		} finally {
			await postgre.end()
		}
	}

	static async execute(sql, params) {
		let postgre
		try {
			postgre = new Client(PostgreSQL.settings)
			await postgre.connect()
			const query = new prepareExecute(sql, params, true)
			const result = await postgre.query(query.sql, query.params)
			return result.rows
		} catch (error) {
			if (process.env.NODE_ENV == 'development')
				throw `Error executing: ${sql}; ${error}; ${error.stack}`
		} finally {
			await postgre.end()
		}
	}
}

module.exports = PostgreSQL
