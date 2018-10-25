const errorHandler = (err, req, res, next) => {
	res.status(err.status).json({
		code: err.status,
		message: err.message
	})
	console.error(err.stack)
}

module.exports = errorHandler
