const driver = require('./DAL/apiDal')

class driverObject extends driver {

	async getOne(id) {
		try {
			const sql = `SELECT * FROM ${this.table} WHERE ${this.primaryKey}=?`
			return await this.db.query(sql, [id])
		} catch (ex) {
			throw ex
		}
	}

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

	async getAll(filters = null) {
		try {
			let sql = `SELECT * FROM ${this.table} WHERE 1=1`
			if (filters != null) {
				sql += this.buildFilterQuery(filters)
			}
			return await this.db.query(sql)
		} catch (ex) {
			throw ex
		}
	}

	async add(jsonObj) {
		try {
			const sql = `INSERT INTO ${this.table} (?) VALUES (?)`
			return await this.db.execute(sql, jsonObj)
		} catch (ex) {
			throw ex
		}
	}

	async delete(id) {
		try {
			// this.primaryKey = await this.getKey()
			const rowExists = await this.getOne(id)
			if (rowExists == undefined || rowExists.length == 0) return false
			
			const sql = `DELETE FROM ${this.table} WHERE ${this.primaryKey}=?`
			return await this.db.execute(sql, [id])

		} catch (ex) {
			throw ex
		}
	}

	async update(id, jsonObj) {
		try {
			// this.primaryKey = await this.getKey()
			const sql = `UPDATE ${this.table} SET ? WHERE ${this.primaryKey}=?`
			return await this.db.execute(sql, [jsonObj, id])
		} catch (ex) {
			throw ex
		}
	}
}

module.exports = driverObject
