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
			const sql = 'INSERT INTO ascproducts_materialize_changes VALUES(?,?,?)'
			return await db.execute(sql, [product.id, product.other, product.thing])
		} catch (ex) {
			throw ex
		}
	}

	static async delete(id) {
		try {
			const sql = 'DELETE FROM ascproducts_materialize_changes WHERE productNumber=?'
			return await db.execute(sql, [id])
		} catch (ex) {
			throw ex
		}
	}

	static async update(id, product) {
		try {
			const sql = `UPDATE ascproducts_materialize_changes SET 
				productName = ?
				, productStatus = ?
				, productPageTitle = ?
				, productUrl = ?
				, productSDesc = ?
				, productDisplay = ?
				, productAltImg = ?
				, productLDesc = ?
				, productMetaDesc = ?
				, productMKeywords = ?
				, productKeywords = ?
				, epicorDescription = ?
				, vendorCode = ?
				, vendorName = ?
				, MPN = ?
				, fineLine = ?
				, fineLineName = ?
				, retailPrice = ?
				, priceUOM = ?
				, weight = ?
				, UPC = ?
				, UPCdate = ?
				, weightUOM = ?
				, Brand = ?
				, manCode = ?
				, manName = ?
				, discontinued = ?
				, catSort = ?
			WHERE productNumber = ?`

			const params = [product.productNumber, product.productName, 
				product.productStatus, product.productPageTitle, 
				product.productUrl, product.productSDesc, 
				product.productDisplay, product.productAltImg, 
				product.productLDesc, product.productMetaDesc, 
				product.productMKeywords, product.productKeywords, 
				product.epicorDescription, product.vendorCode, 
				product.vendorName, product.MPN, product.fineLine, 
				product.fineLineName, product.retailPrice, product.priceUOM, 
				product.weight, product.UPC, product.UPCdate, 
				product.weightUOM, product.Brand, product.manCode, 
				product.manName, product.discontinued, product.catSort, id]

			return await db.execute(sql, params)
		} catch (ex) {
			throw ex
		}
	}
}

module.exports = product
