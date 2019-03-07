const express = require("express")
const router = express.Router()
const apiUser = require("../controllers/apiUser")

router.post("/login", async (req, res, next) => {
	try {
		const user = {
			email: req.body.email,
			password: req.body.password,
		}

		const apiToken = await apiUser.authenticate(user)
		res.json({
			status: "success", 
			apiAccessToken: apiToken,
		})
	}
	catch (ex) {
		next(ex)
	}
})

router.post("/register", async (req, res, next) => {
	try {
		const user = {
			email: req.body.email,
			password: req.body.password,
		}
		const newUser = await apiUser.register(user)
		res.json({
			registration: "success",
			apiAccessToken: newUser,
		})
	}
	catch (ex) {
		next(ex)
	}
})

module.exports = router
