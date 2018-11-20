const express = require('express')
const dbObject = require('../controllers/dbObjectController')

module.exports = function(dbtable, pkey) {
	let router = express.Router()

	// instantiate our REST class
	const DBModel = new dbObject(dbtable, pkey)

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
			let sortby = req.query.sortby || null
			let limit = parseInt(req.query.limit)
			let offset = parseInt(req.query.offset)
			limit = (isNaN(limit)) ? null : req.query.limit
			offset = (isNaN(offset)) ? null : req.query.offset
			let filters = {
				sortby,
				limit,
				offset
			}
			const rows = await DBModel.getAll(filters)
			if (rows != undefined && rows.length > 0) {
				res.json(rows)
			}
		} catch (ex) {
			let err = new Error(ex)
			err.status = ex.status || 500
			return next(err)
		}
	})

	router.post('/', async (req, res, next) => {
		try {
			await DBModel.add(req.body)
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
