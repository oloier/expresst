require('dotenv').config()
const express = require('express')
const app = express()
app.use(express.json())
app.use(express.urlencoded({
	extended: false
}))

// require authentication for any API requests
const authorizationHandler = require('./middleware/authorizationHandler')
app.use('/api*', authorizationHandler)


const apiUserRoutes = require('./routes/apiUserRoutes')
const productsRoutes = require('./routes/productRoutes')
app.use('/', apiUserRoutes)					// login and registration
app.use('/api/products', productsRoutes)	// products + details


// default home request
app.get('/', (req, res,) => {
	res.json({home: 'yup'})
})


// global error handler middleware, receives all Error exception
// instances and responds with a 200 JSON response body
const errorHandler = require('./middleware/errorHandler')
app.use(errorHandler)

module.exports = app
