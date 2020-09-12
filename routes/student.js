const express = require('express')
const dotenv = require('dotenv')
const multer = require('multer')
const path = require('path')
const sqlite = require('sqlite3')
const db = new sqlite.Database('data.db')

const router = express.Router()


let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if(!req.body.name || !req.body.email || !req.body.phone  || !req.body.degree)
        {
            
            return res.render("error", msg="form data is missing some things");
        }else if(file.mimetype.substring(0,5)!="image"){
            return res.render("error",msg="please upload images only")
        }else{

        cb(null, 'uploads/')
        }
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    },
    onError: (err,next)=>{
        next(err);
    }
})
const upload = multer({ storage: storage })


router.get('/', (req, res) => {
    res.render('index')
})


router.get('/list', (req, res) => {
    let sol = []
    db.serialize(()=>{
        let sql = "SELECT * FROM students"
        db.all(sql,[],(err,rows)=>{
            if(err)
            {
                res.render("error",msg="something went wrong");
            }else {
                res.render("list", pm = rows)
            }
        })    
    });

})

router.get('/profile', (req, res) => {
    db.serialize(()=>{
        let sql = "SELECT * from students WHERE id = ?"
        db.all(sql,[req.query.id],(err,row)=>{
            if(err)
            {
                return res.send("Data not found")
            }else
            {
                return res.render('profile',data = row[0])
            }
        })
    })
})

router.post("/updateData",upload.single('profilePic'), (req,res)=>{
    let pic_name=""
    if(req.file ===undefined)
    {
        pic_name = req.body.old_pic
    }else{
        pic_name = req.file.filename
    }
    db.serialize(()=>{
        let sql = "UPDATE students set name=?,email=?,phone=?,degree=?,profile_pic=? where id=?"
        let args = [req.body.name, req.body.email,req.body.phone, req.body.degree,pic_name,req.body.id]
        
        db.run(sql,args, (err)=>{
            if(err)
            {
                return res.send("error somewhere")
            }
            return res.redirect("list")
        })
    })

})

router.post("/addData",upload.single('profilePic'),  (req, res) => {
    db.serialize(()=>{
        db.run('INSERT INTO students(name,email,phone,degree,profile_pic)\
         VALUES(?,?,?,?,?)',[req.body.name,req.body.email, req.body.phone,req.body.degree,req.file.filename],(err)=>{
             if(err)
             {
                res.render("error", msg="sqlite error")
             }
         });
    })
        res.redirect('list')

    
})

module.exports = router