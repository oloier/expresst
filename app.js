require('dotenv').config()
const express = require('express')
const app = express()
app.use(express.urlencoded({extended: false}))
app.disable('x-powered-by') // remove the 'X-Powered-By: Express' header
app.set('json spaces', 2) // basic pretty-print

// default home request
app.get('/', (req, res, ) => {res.json({})})

// require authentication for any API requests
app.use('/api*', require('./handlers/authorizationHandler'))

// login and registration 
app.use('/', require('./handlers/apiUserHandler'))

// setup all database tables you'd like to include in the API
const productRoutes = require('./handlers/apiHandler')( {
	table: 'ascproducts_materialize', 
	key: 'productNumber'/* ,
	sortableCols: ['one', 'two', 'three', 'four'],
	selectableCols: ['one', 'three', 'five'] */
})
app.use('/api/products', productRoutes)

// global error handler middleware, receives all Error exception
// instances and responds with a 200 JSON response body
app.use(require('./handlers/errorHandler'))

module.exports = app
