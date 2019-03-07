const mysql2 = require("mysql2/promise")

class MySQL {
	get settings() {
		return {
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_DATABASE,
			port: process.env.DB_PORT,
		}
	}

	/**
	 * query of data in database
	 * @param {string} sql - SQL query text
	 * @param {Array} params - select query parameters
	 * @param {Array} selectColumns (optional) - what column data to return in statement
	 * @returns query result rows as array of object(s)
	 * @memberof MySQL
	 */
	async query(sql, params, selectColumns = null) {
		const connect = await mysql2.createConnection(this.settings)
		if (selectColumns) {
			sql = this.selectColumns(sql, selectColumns)
		}
		console.log(sql)
		const [rows] = await connect.execute(sql, params)
		connect.close()
		return rows
	}
	
	/**
	 * execution of queries in your database
	 * @param {*} sql
	 * @param {*} params
	 * @returns query result rows as array of object(s) (if applicable)
	 * @memberof MySQL
	 */
	async execute(sql, params) {
		const connect = await mysql2.createConnection(this.settings)
		const [rows] = await connect.query(sql, params)
		connect.close()
		return rows
	}

	/**
	 * formats query to return selectable columns
	 * @param {string} sql - SQL query
	 * @param {string} colArray - Array of columns to return on SELECT statements
	 * @memberof MySQL
	 * @return {string} formatted SQL statement
	 */
	selectColumns(sql, colArray) {
		return sql.replace("*", colArray.map((x) => `\`${x}\``).join(","))
	}

}

module.exports = MySQL
