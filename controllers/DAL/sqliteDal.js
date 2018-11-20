const sqlite3 = require('sqlite3')
const sqlite = new sqlite3.Database(process.env.DB_PATH)

class SQLite {

	static async query(sql, params) {
		try {
			const stmt = sqlite.prepare(sql, params)

			// load results from callback into promise
			const rows = new Promise((resolve, reject) => {
				stmt.all(params, (err, rows) => {
					if (err) reject(err)
					resolve(rows)
				})
			})
			stmt.finalize()
			return await rows
		} catch (error) {
			if (process.env.NODE_ENV == 'development') {
				throw `Error executing: "${sql}"; ${error}; ${error.stack}`
			}
		} 
	}

	static async execute(sql, params) {
		try {
			// dynamic parameter inserts for JSON posts
			if (sql.indexOf('(?) VALUES (?)') !== -1) {
				// replace first ? with quoted object keys
				sql = sql.replace('?', Object.keys(params).map(x => `"${x}"`).join(','))
				// change to ?,?,? * params count
					.replace('?', Object.values(params).map(() => '?').join(','))

				// keys are in the query, so just grab array of values
				params = Object.values(params)
			} 
			
			// load results from callback into promise
			const stmt = sqlite.prepare(sql, params)
			const rows = new Promise((resolve, reject) => {
				stmt.run([],(err, rows) => {
					if (err) reject(err)
					resolve(rows)
				})
			})
			stmt.finalize()
			
			return await rows
		} catch (error) {
			if (process.env.NODE_ENV == 'development') {
				throw `Error executing: "${sql}"; ${error}; ${error.stack}`
			}
		} 
	}
}

module.exports = SQLite
