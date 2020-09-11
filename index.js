const express = require('express')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const path = require('path')
const app = express()
const studentRoutes = require('./routes/student')
app.use(studentRoutes)

app.use(bodyParser.urlencoded({ extended: true }))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.static(path.join(__dirname,"node_modules/bootstrap/dist/css/")))
app.use(express.static(path.join(__dirname, "node_modules/jquery/dist/")))
app.use(express.static(path.join(__dirname, "node_modules/popper.js/dist/")))
app.use(express.static(path.join(__dirname, "node_modules/bootstrap/dist/js/")))

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log("Server started")
})
