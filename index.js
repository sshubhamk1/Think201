const express = require('express')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const path = require('path')
const app = express()
const studentRoutes = require('./routes/student')
const sqlite = require('sqlite3')
const db = new sqlite.Database('data.db')
app.use(studentRoutes)
db.serialize(()=>{
    db.run( "CREATE TABLE IF NOT EXISTS students (\
    id INTEGER PRIMARY KEY  AUTOINCREMENT,\
    name VARCHAR(50),\
    email VARCHAR(30),\
    phone VARCHAR(20),\
    degree VARCHAR(20),\
    profile_pic VARCHAR(40))")
});
db.close()
app.use(bodyParser.urlencoded({ extended: false }))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.static(path.join(__dirname,"node_modules/bootstrap/dist/css/")))
app.use(express.static(path.join(__dirname, "node_modules/jquery/dist/")))
app.use(express.static(path.join(__dirname, "node_modules/popper.js/dist/")))
app.use(express.static(path.join(__dirname, "node_modules/bootstrap/dist/js/")))
app.use(express.static(path.join(__dirname,'uploads')))


const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log("Server started")
})
