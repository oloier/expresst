const express = require('express')
const router = express.Router()

router.use((err, req, res, next) => {
	res.status(err.statusCode || 500).json(err)
})

/* GET home page. */
router.get('/', function(req, res, next) {
	// res.render('index', { title: 'Express' })
	res.setHeader('Content-Type', 'application/json')
	res.type('application/json')
	res.json({'You': 'go authenticate'})
})


module.exports = router
