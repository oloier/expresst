const express = require('express')
const router = express.Router()
const product = require('../controllers/productController')

router.get('/:id', async (req, res, next) => {
	try {
		const rows = await product.getOne(req.params.id)
		// always display, even when empty
		res.json(rows)
	} catch (ex) {
		let err = new Error(ex)
		err.status = 500
		return next(err)
	}
})

router.get('/', async (req, res, next) => {
	try {
		const rows = await product.getAll()
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
		const rows = await product.add(req.body)
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
		const rows = await product.update(id, req.body)
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
		const rows = await product.delete(id)
		if (rows != undefined && rows.length > 0) {
			res.json(rows)
		}
	} catch (ex) {
		let err = new Error(ex)
		err.status = 500
		return next(err)
	}
})

module.exports = router
