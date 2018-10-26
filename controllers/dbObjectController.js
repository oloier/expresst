const db = require('./DAL/mysqlDal')

class dbObject {
	constructor(tableName) {
		this.table = tableName
	}
	async getOne(id) {
		try {
			const sql = `SELECT * FROM ${this.table} WHERE productNumber=?`
			return await db.execute(sql, [id])
		} catch (ex) {
			throw ex
		}
	}

	async getAll() {
		try {
			const sql = `SELECT * FROM ${this.table}`
			return await db.execute(sql)
		} catch (ex) {
			throw ex
		}
	}

	async add(product) {
		try {
			const sql = `INSERT INTO ${this.table} SET ?`
			return await db.query(sql, [product])
		} catch (ex) {
			throw ex
		}
	}

	async delete(id) {
		try {
			const sql = `DELETE FROM ${this.table} WHERE productNumber=?`
			return await db.query(sql, [id])
		} catch (ex) {
			throw ex
		}
	}

	async update(id, product) {
		try {
			const sql = `UPDATE ${this.table} SET ? WHERE ?`
			return await db.query(sql, [product, {productNumber: id}])
		} catch (ex) {
			throw ex
		}
	}
}

module.exports = dbObject
