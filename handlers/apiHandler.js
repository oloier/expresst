const express = require("express")
const dbObject = require("../controllers/dbObject")


/**
 * parseFilters - formats parameters passed in URL query string to SQL
* @param {string} sortby - SQL query suffixes
* @param {string} limit - SQL query suffixes
* @param {string} offset - SQL query suffixes
 * @returns
 */
const parseFilters = (sortby, limit, offset) => {
	sortby = sortby || null
	const limitInt = parseInt(limit)
	const offsetInt = parseInt(offset)
	limit = (isNaN(limit)) ? null : limitInt
	offset = (isNaN(offset)) ? null : offsetInt
	return {
		sortby,
		limit,
		offset,
	}
}

/** 
 * require() will create new instance of handler for 1 database table. 
 * URL endpoints are fixed, but can be configured any way you'd like here.
 * @param {Object} config (tableName, primaryKey, [selectableColumns])
 */
module.exports = (config) => {
	// access router to add to express instance
	const router = express.Router()

	// instantiate our DAL class
	const dataModel = new dbObject(config)

	router.get("/:id", async (req, res, next) => {
		try {
			const rows = await dataModel.getOne(req.params.id)
			res.json(rows) // always display, even when empty
		}
		catch (ex) {
			console.error(ex)
			const err = new Error("failed to retreive record")
			err.code = 500
			return next(err)
		}
	})

	router.get("/", async (req, res, next) => {
		try {
			const filters = parseFilters(req.query.sortby, req.query.limit, req.query.offset)
			const rows = await dataModel.getAll(filters)
			if (rows != undefined && rows.length > 0) {
				res.json(rows)
			}
		}
		catch (ex) {
			console.error(ex)
			const err = new Error("failed to retreive records")
			err.code = 500
			return next(err)
		}
	})

	// tODO add batch UPDATE and INSERT endpoints and queries

	router.post("/", async (req, res, next) => {
		try {
			await dataModel.add(req.body)
			res.json({status: "success"})
		}
		catch (ex) {
			console.error(ex)
			const err = new Error("failed to create new record")
			err.code = 400
			return next(err)
		}
	})

	router.put("/:id", async (req, res, next) => {
		try {
			const id = parseInt(req.params.id)
			const rows = await dataModel.update(id, req.body)
			if (rows.affectedRows <= 0) {
				throw new Error("failed to update record")
			}
			res.json({status: "success"})
		}
		catch (ex) {
			console.error(ex)
			ex.code = 500
			return next(ex)
		}
	})

	router.delete("/:id", async (req, res, next) => {
		try {
			const id = parseInt(req.params.id)
			const deleted = await dataModel.delete(id)
			if (!deleted) {
				throw new Error("record not found")
			}
			res.json({status: "success"})
		}
		catch (ex) {
			ex.code = 404
			return next(ex)
		}
	})
	
	return router
}
