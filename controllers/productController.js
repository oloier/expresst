const db = require('./dbcon')

class product {
	static async getOne(id) {
		try {
			const sql = 'SELECT * FROM ascproducts_materialize WHERE productNumber=?'
			return await db.execute(sql, [id])
		} catch (ex) {
			throw ex
		}
	}

	static async getAll() {
		try {
			const sql = 'SELECT * FROM ascproducts_materialize'
			return await db.execute(sql)
		} catch (ex) {
			throw ex
		}
	}

	static async add(product) {
		try {
			const sql = 'INSERT INTO ascproducts_materialize_changes SET ?'
			return await db.query(sql, [product])
		} catch (ex) {
			throw ex
		}
	}

	static async delete(id) {
		try {
			const sql = 'DELETE FROM ascproducts_materialize_changes WHERE productNumber=?'
			return await db.query(sql, [id])
		} catch (ex) {
			throw ex
		}
	}

	static async update(id, product) {
		try {
			const sql = 'UPDATE ascproducts_materialize_changes SET ? WHERE ?'
			return await db.query(sql, [product, {productNumber: id}])
		} catch (ex) {
			throw ex
		}
	}
}

module.exports = product
