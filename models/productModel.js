const db = require('../dbconnection')

var product = {
	getAll:function(callback){
		return db.query('SELECT * FROM ascproducts_materialize', callback)
	},

	getOne:function(id,callback){
		return db.query('SELECT * FROM ascproducts_materialize WHERE productNumber=?',[id],callback)
	},

	add:function(product ,callback){
		return db.query('INSERT INTO ascproducts_materialize VALUES(?,?,?)',[product.id, product.title, product.status], callback)
	},

	delete:function(id,callback){
		return db.query('DELETE FROM ascproducts_materialize WHERE productNumber = ?',[id],callback)
	},

	update:function(id,product ,callback){
		return db.query('UPDATE ascproducts_materialize SET productName=?, Status=? WHERE productNumber = ?', [product.name, product.status, id],callback)
	}
}

module.exports = product
