// const sqlite3 = require('better-sqlite3')(process.env.DB_PATH)

// class SQLite {

// 	static async execute(sql, params) {
// 		try {
// 			const stmt = sqlite3.prepare(sql).bind(params)
// 			const rows = stmt.all()
// 			return rows
// 		} catch (error) {
// 			if (process.env.NODE_ENV == 'development') {
// 				throw `Error executing: "${sql}"; ${error}; ${error.stack}`
// 			}
// 		}
// 	}

// 	static async query(sql, params) {
// 		try {
// 			const stmt = sqlite3.prepare(sql).bind(params)
// 			const rows = stmt.run()
// 			return rows
// 		} catch (error) {
// 			if (process.env.NODE_ENV == 'development') {
// 				throw `Error querying: "${sql}"; ${error}; ${error.stack}`
// 			}
// 		}
// 	}
// }

// module.exports = SQLite
