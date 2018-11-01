const express = require('express')
const dbObject = require('../controllers/dbObjectController')

module.exports = function(dbtable) {
	let router = express.Router()

	// instantiate our REST class
	const DBModel = new dbObject(dbtable)

	router.get('/:id', async (req, res, next) => {
		try {
			const rows = await DBModel.getOne(req.params.id)
			// always display, even when empty
			res.json(rows)
		} catch (ex) {
			console.log(ex)
			let err = new Error(ex)
			err.status = ex.status || 500
			return next(err)
		}
	})

	router.get('/', async (req, res, next) => {
		try {
			const rows = await DBModel.getAll()
			if (rows != undefined && rows.length > 0) {
				res.json(rows)
			}
		} catch (ex) {
			let err = new Error(ex)
<<<<<<< HEAD
			err.status = ex.status || 500
=======
			err.status =  x.status || 500
>>>>>>> 1085aaf19bbd88569fa3e9fa797e9b701c71e2d7
			return next(err)
		}
	})

	router.post('/', async (req, res, next) => {
		try {
			/* const rows =  */await DBModel.add(req.body)
			res.json({status: 'success'})
		} catch (ex) {
			let err = new Error(ex)
			err.status = ex.status || 500
			return next(err)
		}
	})

	router.put('/:id', async (req, res, next) => {
		try {
			const id = parseInt(req.params.id)
			const rows = await DBModel.update(id, req.body)
			if (rows.affectedRows <= 0) throw 'failed to update record'
			res.json({status: 'success'})
		} catch (ex) {
			console.log(ex)
			let err = new Error(ex)
			err.status = ex.status || 500
			return next(err)
		}
	})

	router.delete('/:id', async (req, res, next) => {
		try {
			const id = parseInt(req.params.id)
			const deleted = await DBModel.delete(id)
			if (deleted === false) {
				let err = new Error('record not found')
				err.status = 404
				throw err
			}
			res.json({status: 'success'})
		} catch (ex) {
			let err = new Error(ex)
			err.status =  ex.status || 500
			return next(err)
		}
	})
	
	return router
}
