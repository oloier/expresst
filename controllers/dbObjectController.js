const driver = require('./DAL/apiDal')
// const driver = require('./DAL/mysqlDal')
// const driver = require('./DAL/postgreDal')

class driverObject extends driver {

	async getOne(id) {
		try {
			console.log(this.db)
			this.primaryKey = await this.getKey()
			const sql = `SELECT * FROM ${this.table} WHERE ${this.primaryKey}=?`
			return await this.db.execute(sql, [id])
		} catch (ex) {
			throw ex
		}
	}

	async getAll() {
		try {
			const sql = `SELECT * FROM ${this.table}`
			return await this.db.execute(sql)
		} catch (ex) {
			throw ex
		}
	}

	async add(jsonObj) {
		try {
			const sql = `INSERT INTO ${this.table} (?) VALUES (?)`
			return await this.db.query(sql, jsonObj)
		} catch (ex) {
			throw ex
		}
	}

	async delete(id) {
		try {
			this.primaryKey = await this.getKey()
			const sql = `DELETE FROM ${this.table} WHERE ${this.primaryKey}=?`
			return await this.db.query(sql, [id])
		} catch (ex) {
			throw ex
		}
	}

	async update(id, jsonObj) {
		try {
			this.primaryKey = await this.getKey()
			const sql = `UPDATE ${this.table} SET ? WHERE ${this.primaryKey}=?`
			return await this.db.query(sql, [jsonObj, id])
		} catch (ex) {
			throw ex
		}
	}
}

module.exports = driverObject
