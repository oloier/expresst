const { Client } = require('pg')
const sqlstring = require('sqlstring')

class PostgreSQL {
	static get settings() {
		return {
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_DATABASE,
			port: 5432
		}
	}

	static async execute(sql, params) {
		let postgre
		try {
			postgre = new Client(PostgreSQL.settings)
			await postgre.connect()
			// sql = pgdb.postgreParamSyntax(sql)
			sql = sqlstring.format(sql, params || [])
			const result = await postgre.query(sql, params)
			return result.rows
		} catch (error) {
			if (process.env.NODE_ENV == 'development') {
				throw `Error executing: ${sql}; ${error}; ${error.stack}`
			}
		} finally {
			await postgre.end()
		}
	}

	static async query(sql, params) {
		return PostgreSQL.execute(sql, params)
	}

	static postgreParamSyntax(sql) {
		let paramIndex = 1
		return sql.replace(/\?/g, () => `$${paramIndex++}`)
	}

}

module.exports = PostgreSQL
