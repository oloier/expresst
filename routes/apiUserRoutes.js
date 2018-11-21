const express = require('express')
const router = express.Router()
const apiUser = require('../controllers/apiUserController')

router.post('/login', async (req, res, next) => {
	try {
		const user = {
			email: req.body.email,
			password: req.body.password
		}

		const apiToken = await apiUser.authenticate(user)
		if (!apiToken) {
			throw new Error('invalid credentials')
		}
		res.json({
			status: 'success', 
			apiAccessToken: apiToken
		})
	} catch (ex) {
		ex.status = ex.status || 500
		next(ex)
	}
})

router.post('/register', async (req, res, next) => {
	const user = {
		email: req.body.email,
		password: req.body.password
	}

	try {
		const newUser = await apiUser.register(user)
		res.json({
			registration: 'success',
			apiAccessToken: newUser
		})
	} catch (ex) {
		let err = new Error(ex)
		err.status = ex.status || 500
		next(err)
	}
})

module.exports = router
