const sqlite = require('sqlite3')
const db = new sqlite.Database('data.db')
db.serialize(()=> {

})