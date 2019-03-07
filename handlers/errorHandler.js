const errorHandler = (err, req, res, next) => {
	res.status(err.code).json({
		code: err.code,
		message: err.message,
	})
	// console.error(err.stack)
}

module.exports = errorHandler
