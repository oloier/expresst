const driver = require('./DAL/apiDAL')

class driverObject extends driver {

	async rowExists(id) {
		const rowExists = await this.getOne(id)
		if (rowExists == undefined || rowExists.length == 0) return false
		return true
	}
	
	// for filtering getAll() requests with pagination and sorting
	buildFilterQuery(filters) {
		let querySuffix = ''
		if (filters.sortby) {
			let order = 'ASC'
			// split the :desc suffix if present
			if (!filters.sortby.indexOf(':') !== -1) {
				let sortSplit = filters.sortby.split(':')
				filters.sortby = sortSplit[0]
				if (sortSplit[1] == 'desc') order = 'DESC'
			}
			querySuffix += ` ORDER BY ${filters.sortby} ${order}`
		}
		if (filters.limit) querySuffix += ` LIMIT ${filters.limit}`
		if (filters.offset) querySuffix += ` OFFSET ${filters.offset}`

		return querySuffix
	}

	async getOne(id) {
		const sql = `SELECT * FROM ${this.table} WHERE ${this.primaryKey}=?`
		return await this.db.query(sql, [id])
	}

	async getAll(filters = null) {
		let sql = `SELECT * FROM ${this.table} WHERE 1=1`
		if (filters != null) sql += this.buildFilterQuery(filters)
		return await this.db.query(sql)
	}

	async add(jsonObj) {
		const sql = `INSERT INTO ${this.table} (?) VALUES (?)`
		return await this.db.execute(sql, jsonObj)
	}

	async delete(id) {
		if (!this.rowExists(id)) return false
		const sql = `DELETE FROM ${this.table} WHERE ${this.primaryKey}=?`
		return await this.db.execute(sql, [id])
	}

	async update(id, jsonObj) {
		if (!this.rowExists(id)) return false
		const sql = `UPDATE ${this.table} SET ? WHERE ${this.primaryKey}=?`
		return await this.db.execute(sql, [jsonObj, id])
	}

}

module.exports = driverObject
