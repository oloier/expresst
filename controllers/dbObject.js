const driver = require("./DAL/apiDAL")

class driverObject extends driver {

	async rowExists(id) {
		const rowExists = await this.getOne(id)
		if (rowExists == undefined || rowExists.length == 0) {
			return false
		}
		return true
	}
	
	async getOne(id) {
		const sql = `SELECT * FROM ${this.tableName} WHERE ${this.primaryKey}=?`
		return await this.db.query(sql, [id], this.selectColumns)
	}
	
	/**
	 * method for returning multiple/all rows via GET + optional filtering parameters
	 * @param {Object} [filters=null] - Object with 3 potential properties: sortby, limit, offset.
	 * @returns array of table rows based on provided parameters
	 * @memberof driverObject
	 */
	async getAll(filters = null) {
		let sql = `SELECT * FROM ${this.tableName} WHERE 1=1`
		const params = []
		if (filters && filters.sortby) {
			let order = "ASC"
			// split the :desc suffix if present
			if (!filters.sortby.indexOf(":") !== -1) {
				const sortSplit = filters.sortby.split(":")
				filters.sortby = sortSplit[0]
				if (sortSplit[1] == "desc") {
					order = "DESC"
				}
			}
			sql += ` ORDER BY ? ${order}` 
			params.push(filters.sortby)
		}
		if (filters && filters.limit) {
			sql += " LIMIT ?"
			params.push(filters.limit)
		}
		if (filters && filters.offset) {
			sql += " OFFSET ?"
			params.push(filters.offset)
		}
		return await this.db.query(sql, params, this.selectColumns)
	}
	
	async add(jsonObj) {
		const sql = `INSERT INTO ${this.tableName} (?) VALUES (?)`
		return await this.db.execute(sql, jsonObj)
	}
	
	async delete(id) {
		if (!this.rowExists(id)) {
			return false
		}
		const sql = `DELETE FROM ${this.tableName} WHERE ${this.primaryKey}=?`
		return await this.db.execute(sql, [id])
	}
	
	// tODO add batch UPDATE and INSERT endpoints and queries

	/**
	 * uPDATE query
	 * @param {*} id
	 * @param {*} jsonObj
	 * @returns
	 * @memberof driverObject
	 */
	async update(id, jsonObj) {
		if (!this.rowExists(id)) {
			return false
		}
		const sql = `UPDATE ${this.tableName} SET ? WHERE ${this.primaryKey}=?`
		return await this.db.execute(sql, [jsonObj, id])
	}
	
}

module.exports = driverObject
