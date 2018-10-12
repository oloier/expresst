const express = require('express')
const router = express.Router()
const product = require('../models/productModel')

router.get('/:id?', (req, res, next) => {
	if (req.params.id) {
		product.getOne(req.params.id, (err, rows) => {
			if (rows == undefined || rows.length == 0) res.json({})
			else res.json(rows[0])
		})
	} else {
		product.getAll((err, rows) => {
			if (err) res.json(err)
			else res.json(rows)
		})
	}
})

router.post('/', (req, res, next) => {
	product.add(req.body, (err) => {
		if (err) res.json(err)
		else res.json(req.body)
	})
})

router.delete('/:id', (req, res, next) => {
	product.delete(req.params.id, (err, count) => {
		if (err) res.json(err)
		else res.json(count)
	})
})

router.put('/:id', (req, res, next) => {
	product.update(req.params.id, req.body, (err, rows) => {
		if (err) res.json(err)
		else res.json(rows)
	})
})

module.exports = router
