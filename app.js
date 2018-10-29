require('dotenv').config()
const express = require('express')
const app = express()
app.use(express.urlencoded({extended: false}))
app.disable('x-powered-by') // remove the 'X-Powered-By: Express' header
app.set('json spaces', 2) // basic pretty-print

// require authentication for any API requests
const authorizationHandler = require('./middleware/authorizationHandler')
app.use('/api*', authorizationHandler)

// login and registration
const apiUserRoutes = require('./routes/apiUserRoutes')
app.use('/', apiUserRoutes)

// setup all database tables you'd like to include in the API
const productRoutes = require('./routes/apiRoutes')('ascproducts_materialize')
app.use('/api/products', productRoutes)

const test = require('./routes/apiRoutes')('test')
app.use('/test', test)
const apiusers = require('./routes/apiRoutes')('apiusers')
app.use('/apiusers', apiusers)


const invlocRoutes = require('./routes/apiRoutes')('inventories_locations')
app.use('/api/invloc', invlocRoutes)


// default home request
app.get('/', (req, res, ) => {
	// const sqlstring = require('sqlstring')
	// const sql = `UPDATE 'prod' (?) VALUES (?) WHERE productNumber=? ?`
	// obj = {name: 'nah', face: 'i guess', nose: 'goes'}
	// const str = sqlstring.format(sql, [Object.keys(obj), Object.values(obj), 1, 4])
	// res.send(str)
	res.json({ /* home: 'yup' */ })
})


// global error handler middleware, receives all Error exception
// instances and responds with a 200 JSON response body
const errorHandler = require('./middleware/errorHandler')
app.use(errorHandler)

module.exports = app
