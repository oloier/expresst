require('dotenv').config()
const express = require('express')
const app = express()
app.disable('x-powered-by')
// app.use(express.json())
app.set('json spaces', 2) // basic pretty-print
app.use(express.urlencoded({
	extended: false
}))

// require authentication for any API requests
const authorizationHandler = require('./middleware/authorizationHandler')
app.use('/api*', authorizationHandler)

// login and registration
const apiUserRoutes = require('./routes/apiUserRoutes')
app.use('/', apiUserRoutes)	

// setup all database tables you'd like to include in the API
const productRoutes = require('./routes/apiRoutes')('ascproducts_materialize')
app.use('/api/products', productRoutes)	

const invlocRoutes = require('./routes/apiRoutes')('inventories_locations')
app.use('/api/invloc', invlocRoutes)	



// default home request
app.get('/', (req, res,) => {
	res.json({home: 'yup'})
})


// global error handler middleware, receives all Error exception
// instances and responds with a 200 JSON response body
const errorHandler = require('./middleware/errorHandler')
app.use(errorHandler)

module.exports = app
