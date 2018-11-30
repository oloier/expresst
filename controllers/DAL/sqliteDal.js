const sqlite3 = require('sqlite3')
const sqlite = new sqlite3.Database(process.env.DB_PATH)
const prepareExecute = require('./prepareExecute')

module.exports = class SQLite {
	
	async query(sql, params, selectColumns = null) {
		if (selectColumns) sql = selectColumns(sql, selectColumns)
		const stmt = sqlite.prepare(sql, params)
		const rows = await this.getResults(stmt) 
		stmt.finalize() 
		return rows
	}
	
	async execute(sql, params) {
		const query = new prepareExecute(sql, params)
		const stmt = sqlite.prepare(query.sql, query.params)
		const rows = await this.getResults(stmt) 
		stmt.finalize()
		return rows
	}

	/**
	 * Wraps SQLite3's statement results callback into promise
	 * @param {SQLite3.Statement} - prepared SQLite query statement
	 * @returns promise of query results
	 */
	getResults (stmt) {
		return new Promise((resolve, reject) => {
			stmt.all((err, rows) => { 
				if (err) return reject(err)
				resolve(rows)
			})
		})
	}

	/**
	 * Formats query to return selectable columns
	 * @param {string} sql - SQL query
	 * @param {string} colArray - Array of columns to return on SELECT statements
	 * @memberof MySQL
	 * @return {string} formatted SQL statement
	 */
	selectColumns(sql, colArray) {
		return sql.replace('*', colArray.map(x => `"${x}"`).join(','))
	}

}
