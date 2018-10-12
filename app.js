const express = require('express')
require('dotenv').config()
const indexRouter = require('./routes/index')
const productsRouter = require('./routes/productRoutes')
const router = express.Router()


const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

router.use('/', indexRouter)
router.use('/products', productsRouter)
app.use('/api', router)

app.use(function (err, req, res, next) {
	console.error(err.stack)
	res.status(500).send('Something broke!')
})


module.exports = app
