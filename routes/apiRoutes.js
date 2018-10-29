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
			err.status = 500
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
			err.status = 500
			return next(err)
		}
	})

	router.post('/', async (req, res, next) => {
		try {
			const rows = await DBModel.add(req.body)
			if (rows != undefined && rows.length > 0) {
				res.json(rows)
			}
		} catch (ex) {
			let err = new Error(ex)
			err.status = 500
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
			const rows = await DBModel.delete(id)
			if (rows != undefined && rows.length > 0) {
				res.json(rows)
			}
		} catch (ex) {
			let err = new Error(ex)
			err.status = 500
			return next(err)
		}
	})
	
	return router
}
