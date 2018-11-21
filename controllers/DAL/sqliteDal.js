const sqlite3 = require('sqlite3')
const sqlite = new sqlite3.Database(process.env.DB_PATH)
const prepareExecute = require('./prepareExecute')

class SQLite {

	static getResults(stmt) {
		return new Promise((resolve, reject) => {
			stmt.run([],(err, rows) => {
				if (err) reject(err)
				resolve(rows)
			})
		})
	}

	static async query(sql, params) {
		try {
			const stmt = sqlite.prepare(sql, params)

			// load results from callback into promise
			const rows = new Promise((resolve, reject) => {
				stmt.all((err, rows) => {
					if (err) reject(err)
					resolve(rows)
				})
			})
			stmt.finalize() 
			return await rows
		} catch (error) {
			if (process.env.NODE_ENV == 'development')
				throw `Error executing: "${sql}"; ${error}; ${error.stack}`
		} 
	}

	static async execute(sql, params) {
		try {
			const query = new prepareExecute(sql, params)
			const stmt = sqlite.prepare(query.sql, query.params)
			const rows = new Promise((resolve, reject) => {
				stmt.all((err, rows) => {
					if (err) reject(err)
					resolve(rows)
				})
			})
			stmt.finalize()
			return await rows
		} catch (error) {
			if (process.env.NODE_ENV == 'development')
				throw `Error executing: "${sql}"; ${error}; ${error.stack}`
		} 
	}
}

module.exports = SQLite
