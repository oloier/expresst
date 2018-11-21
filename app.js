require('dotenv').config()
const express = require('express')
const app = express()
app.use(express.urlencoded({extended: false}))
app.disable('x-powered-by') // remove the 'X-Powered-By: Express' header
app.set('json spaces', 2) // basic pretty-print

// default home request
app.get('/', (req, res, ) => {
	res.json({})
})

// require authentication for any API requests
const authorizationHandler = require('./middleware/authorizationHandler')
app.use('/api*', authorizationHandler)

// login and registration 
const apiUserRoutes = require('./routes/apiUserRoutes')
const apiusers = require('./routes/apiRoutes')('apiusers', 'userid')
app.use('/', apiUserRoutes)
app.use('/apiusers', apiusers)

// setup all database tables you'd like to include in the API
// const productRoutes = require('./routes/apiRoutes')('ascproducts_materialize', 'productNumber')
const productRoutes = require('./routes/apiRoutes')('ascproducts_materialize', 'productNumber')
app.use('/api/products', productRoutes)

const invlocRoutes = require('./routes/apiRoutes')('test', 'id')
app.use('/api/test', invlocRoutes)


// global error handler middleware, receives all Error exception
// instances and responds with a 200 JSON response body
const errorHandler = require('./middleware/errorHandler')
app.use(errorHandler)

module.exports = app
