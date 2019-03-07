const {Client} = require("pg")
const prepareExecute = require("./prepareExecute")

module.exports = class PostgreSQL {

	get settings() {
		return {
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_DATABASE,
			port: process.env.DB_PORT,
		}
	}

	async query(sql, params, selectColumns = null) {
		const postgre = new Client(this.settings)
		await postgre.connect()

		sql = prepareExecute.postgreParamSyntax(sql)
		if (selectColumns) {
			sql = this.selectColumns(sql, selectColumns)
		}
		const result = await postgre.query(sql, params)

		await postgre.end()
		return result.rows
	}

	async execute(sql, params) {
		const postgre = new Client(this.settings)
		await postgre.connect()
		
		const query = new prepareExecute(sql, params, true)
		const result = await postgre.query(query.sql, query.params)

		await postgre.end()
		return result.rows
	}

	/**
	 * formats query to return selectable columns
	 * @param {string} sql - SQL query
	 * @param {string} colArray - Array of columns to return on SELECT statements
	 * @memberof PostgreSQL
	 * @return {string} formatted SQL statement
	 */
	selectColumns(sql, colArray) {
		return sql.replace("*", colArray.map((x) => `"${x}"`).join(","))
	}

}
