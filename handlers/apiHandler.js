const express = require('express')
const dbObject = require('../controllers/dbObject')

const parseFilters = (sortby, limit, offset) => {
	sortby = sortby || null
	const limitInt = parseInt(limit)
	const offsetInt = parseInt(offset)
	limit = (isNaN(limit)) ? null : limitInt
	offset = (isNaN(offset)) ? null : offsetInt
	return {
		sortby,
		limit,
		offset
	}
}

module.exports = function(dbtable, pkey) {
	let router = express.Router()

	// instantiate our REST class
	const DBModel = new dbObject(dbtable, pkey)

	router.get('/:id', async (req, res, next) => {
		try {
			const rows = await DBModel.getOne(req.params.id)
			res.json(rows) // always display, even when empty
		} catch (ex) {
			console.error(ex)
			let err = new Error('failed to retreive record')
			err.code = 500
			return next(err)
		}
	})

	router.get('/', async (req, res, next) => {
		try {
			const filters = parseFilters(req.query.sortby, req.query.limit, req.query.offset)
			const rows = await DBModel.getAll(filters)
			if (rows != undefined && rows.length > 0)
				res.json(rows)
		} catch (ex) {
			console.error(ex)
			let err = new Error('failed to retreive records')
			err.code = 500
			return next(err)
		}
	})

	router.post('/', async (req, res, next) => {
		try {
			await DBModel.add(req.body)
			res.json({status: 'success'})
		} catch (ex) {
			console.error(ex)
			let err = new Error('failed to create new record')
			err.code = 400
			return next(err)
		}
	})

	router.put('/:id', async (req, res, next) => {
		try {
			const id = parseInt(req.params.id)
			const rows = await DBModel.update(id, req.body)
			if (rows.affectedRows <= 0) 
				throw new Error('failed to update record')
			res.json({status: 'success'})
		} catch (ex) {
			console.error(ex)
			ex.code = 500
			return next(ex)
		}
	})

	router.delete('/:id', async (req, res, next) => {
		try {
			const id = parseInt(req.params.id)
			const deleted = await DBModel.delete(id)
			if (!deleted) throw new Error('record not found')
			res.json({status: 'success'})
		} catch (ex) {
			ex.code = 404
			return next(ex)
		}
	})
	
	return router
}
