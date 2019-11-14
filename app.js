require("dotenv").config()
const express = require("express")
const app = express()
app.use(express.urlencoded({
	extended: false,
}))
app.use(express.json())
app.disable("x-powered-by")
app.set("json spaces", 2)

// default home request
app.get("/", (req, res) => {
	res.json({})
})

// login and registration 
app.use("/", require("./handlers/apiUserHandler"))

// require authentication for any API requests
app.use("/api*", require("./handlers/authorizationHandler"))

// setup tables and endpoints for your API
const claimsRoute = require("./handlers/apiHandler")({
	tableName: "claims",
	key: "file_number",
	selectColumns: ["*"],
})
app.use("/api/claims", claimsRoute)

// errors respond with JSON
app.use(require("./handlers/errorHandler"))

module.exports = app
