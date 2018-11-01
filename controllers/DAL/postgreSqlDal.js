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

	static async execute(sql, params) {
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

	static async query(sql, params) {
		let postgre
		try {
			postgre = new Client(PostgreSQL.settings)
			await postgre.connect()

			// on INSERT: insert field names separate from values
			if (sql.indexOf(' VALUES ') !== -1) {
				// replace first ? param with string
				sql = sql.replace('?', Object.keys(params).toString())
				// change parameters to just values as we just inserted fields
				params = [Object.values(params)]
			}
			
			// i've lazily retrofit the MySQL escaping in postgres, sorry
			// paramterize query, as messily as possible apparently.
			sql = sqlstring.format(sql, params || []).replace(/`/g, '"') 
			
			const result = await postgre.query(sql)
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
