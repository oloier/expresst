const sqlite3 = require('sqlite3')
const sqlite = new sqlite3.Database(process.env.DB_PATH)
const prepareExecute = require('./prepareExecute')

// ugly, also doesn't work and I hate it
const getResults = stmt => {
	return new Promise((resolve, reject) => {
		stmt.all((err, rows) => { 
			if (err) return reject(err)
			resolve(rows)
		})
	})
}

class SQLite {

	static async query(sql, params) {
		const stmt = sqlite.prepare(sql, params)
		const rows = await getResults(stmt) 
		stmt.finalize() 
		return rows
	}

	static async execute(sql, params) {
		const query = new prepareExecute(sql, params)
		const stmt = sqlite.prepare(query.sql, query.params)
		const rows = await getResults(stmt) 
		stmt.finalize()
		return rows
	}
}

module.exports = SQLite
