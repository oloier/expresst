require('dotenv').config()
const express = require('express')
const app = express()
app.use(express.urlencoded({
	extended: false
}))
app.use(express.json())
app.disable('x-powered-by') // remove the 'X-Powered-By: Express' header
app.set('json spaces', 2) // basic pretty-print

// default home request
app.get('/', (req, res, ) => {
	res.json({})
})

// login and registration 
app.use('/', require('./handlers/apiUserHandler'))

// require authentication for any API requests
app.use('/api*', require('./handlers/authorizationHandler'))

// setup tables and endpoints for your API
const productRoutes = require('./handlers/apiHandler')({
	tableName: 'ascproducts_materialize',
	key: 'productNumber',
	selectColumns: ['productNumber', 'productName', 'productUrlSku']
})
app.use('/api/products', productRoutes)


const postgreRoute = require('./handlers/apiHandler')({
	tableName: 'test',
	key: 'id',
	selectColumns: ['name', 'goals']
})
app.use('/api/test', postgreRoute)

// global error handler middleware, receives all Error exception
// instances and responds with a 200 JSON response body
app.use(require('./handlers/errorHandler'))

module.exports = app
