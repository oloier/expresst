// require authentication for any API requests
const apiUser = require('../controllers/apiUserController')

const authHandler = async (req, res, next) => {
	try {
		const authd = await apiUser.authorize(req)
		console.info(`authenticated ${authd}`)
		if (authd) return next()
		throw 'unauthorized request'
	} catch (ex) {
		let err = new Error(ex)
		err.status = 403
		return next(err)
	}
}

module.exports = authHandler
