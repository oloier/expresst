const apiUser = require("../controllers/apiUser")

const authHandler = async (req, res, next) => {
	try {
		if (await apiUser.authorize(req)) {
			return next()
		}
		throw new Error("unauthorized request")
	}
	catch (ex) {
		ex.code = 403
		return next(ex)
	}
}

module.exports = authHandler
