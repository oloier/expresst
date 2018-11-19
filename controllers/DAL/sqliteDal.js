const sqlite3 = require('sqlite3')
const sqlite = new sqlite3.Database(process.env.DB_PATH)
const sqlstring = require('sqlstring')

class SQLite {

	static async query(sql, params) {
		let stmt
		try {
			stmt = sqlite.prepare(sql, params)
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
		let stmt
		try {
			// enable dynamic parameters
			if (sql.indexOf(' VALUES ') !== -1) {
				// replace first ? param with string
				sql = sql.replace('?', Object.keys(params).toString())
				// change parameters to just values as we just inserted fields
				params = Object.values(params)
			}
			sql = sqlstring.format(sql, [params]) // wrap in array for our (?)

			// load results from callback into promise
			stmt = sqlite.prepare(sql)
			const rows = new Promise((resolve, reject) => {
				stmt.run([],(err, rows) => {
					if (err) reject(err)
					resolve(rows)
				})
			})
			stmt.finalize()
			
			return await rows && sqlite.close()
		} catch (error) {
			if (process.env.NODE_ENV == 'development') {
				throw `Error executing: "${sql}"; ${error}; ${error.stack}`
			}
		} 
	}
}

// (async function(){
// 	try {
// 		console.log(await SQLite.query('SELECT * FROM apiusers'))
// 		// console.log(await SQLite.execute('INSERT INTO apiusers (?) VALUES (?)', {email: 'what?why?', password: 'butts'}))
// 	} catch (ex) {
// 		console.log(ex)
// 	}
// })()

module.exports = SQLite
