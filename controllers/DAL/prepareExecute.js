// recreating the sqlstring option of throwing an entire object at a
// single ? in your query to fill in both updates and inserts dynamically
class PrepareExecute {

	constructor(sql, params, postgreEscape = false) {
		this.sql = sql
		this.params = params
		this.postgreEscape = postgreEscape
		return this.preparedExecute
	}

	get escapedInsert() {
		// replace first ? with quoted object keys, then change to ?,?,? * this.params count
		this.sql = this.sql.replace("?", Object.keys(this.params).map(x => `"${x}"`).join(","))
			.replace("?", Object.values(this.params).map(() => "?").join(","))

		// postgrefy the escaped parameters
		if (this.postgreEscape) {
			this.sql = PrepareExecute.postgreParamSyntax(this.sql)
		}
		return this.sql
	}

	get escapedUpdate() {
		if (Object.keys(this.params).length >= 0 && typeof(this.params) == "object") {
			// replace first ? with quoted object keys
			this.sql = this.sql.replace("?", Object.keys(this.params).map(x => `"${x}"=?`).join(","))

			// postgrefy the escaped parameters
			if (this.postgreEscape) {
				this.sql = PrepareExecute.postgreParamSyntax(this.sql)
			}
		}
		return this.sql
	}

	// replace all instances of ? to postgre's $1, $2 syntax
	static postgreParamSyntax(sql) {
		let paramIndex = 1
		return sql.replace(/\?/g, () => `$${paramIndex++}`)
	}

	get preparedExecute() {
		let newSql = this.sql
		let newParams = this.params

		// dynamic parameter inserts for JSON posts
		if (this.sql.indexOf("(?) VALUES (?)") !== -1) {
			// update sql to match parameter counts
			newSql = this.escapedInsert
			// keys are in the query, so just grab array of values
			newParams = Object.values(this.params)
		} 

		// dynamic parameter updates for JSON posts
		else if (this.sql.indexOf("SET ? WHERE") !== -1) {
			// updates pass [{cols: vals}, primaryKey]
			const pkey = this.params[1]
			this.params = this.params[0] 

			newParams = Object.values(this.params)
			newParams.push(pkey)
			newSql = this.escapedUpdate
		} 

		// update sql to match parameter counts
		else if (this.postgreEscape) {
			newSql = PrepareExecute.postgreParamSyntax(newSql)
		}

		return {sql: newSql, params: newParams}
	}
}

module.exports = PrepareExecute
