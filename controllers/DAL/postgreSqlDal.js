const { Client } = require('pg')
const sqlstring = require('sqlstring')

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
			sql = PostgreSQL.postgreParamSyntax(sql)

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

	static async execute(sql, params) {
		let postgre
		try {
			postgre = new Client(PostgreSQL.settings)
			await postgre.connect()

			// on INSERT: custom parameterization
			if (sql.indexOf('(?) VALUES (?)') !== -1) {
				// replace first ? with quoted object keys
				sql = sql.replace('?', Object.keys(params).map(x => `"${x}"`).join(','))
				// change to ?,?,? * params count
					.replace('?', Object.values(params).map(() => '?').join(','))

				// replace ?,?,? with postgre parameters ($1, $2, $3)
				sql = PostgreSQL.postgreParamSyntax(sql)

				// update params value array; our keys are in place
				params = Object.values(params)
			}
			
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
	
	static postgreParamSyntax(sql) {
		let paramIndex = 1
		return sql.replace(/\?/g, () => `$${paramIndex++}`)
	}

}

module.exports = PostgreSQL
