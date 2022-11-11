"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const body_parser_1 = __importDefault(require("body-parser"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const bcrypt_1 = __importDefault(require("bcrypt"));
// router
const router = express_1.default.Router();
// models file
const User = require("../models/users");
// bodyparser
router.use(body_parser_1.default.json());
router.use(body_parser_1.default.urlencoded({ extended: true }));
;
;
// Home
router.get('/', (req, res) => {
    res.render('register');
});
// Get all users route
router.get("/index", (req, res) => {
    User.find().exec((err, users) => {
        if (err) {
            res.json({ message: err.message });
        }
        else {
            // f.log(users)
            res.render('index', {
                title: 'Home Page',
                users: users,
            });
        }
    });
});
// route for dashboard
router.get("/index", (req, res) => {
    res.render('index');
});
// Register
router.get('/register', (req, res) => {
    res.render('register');
});
// Hash Password
let bookAuthArr = [];
router.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt_1.default.hash(req.body.password, 10);
        // console.log("hashedPassword:>>>", hashedPassword);
        const authObj = {
            AuthorName: req.body.name,
            Email: req.body.email,
            Password: hashedPassword,
            PhoneNumber: req.body.phonenumber,
            id: 0,
            books: [{
                    Title: '',
                    datePublished: '',
                    Description: '',
                    pageCount: 0,
                    Genre: '',
                    bookId: 0,
                    Publisher: ''
                }]
        };
        //create database.json if it does not exist.
        if (!fs_1.default.existsSync(path_1.default.join(__dirname, '/database.json'))) {
            authObj.id = 1;
            bookAuthArr.push(authObj);
            fs_1.default.writeFile(path_1.default.join(__dirname, '/database.json'), JSON.stringify(bookAuthArr, null, 3), 'utf8', (err) => {
                if (err) {
                    res.redirect('/register');
                }
                else {
                    res.redirect('/login');
                }
            });
        }
        else {
            fs_1.default.readFile(path_1.default.join(__dirname, '/database.json'), 'utf8', (err, data) => {
                if (err) {
                    res.redirect('/register');
                }
                else {
                    bookAuthArr = JSON.parse(data);
                    authObj.id = bookAuthArr.length + 1;
                    bookAuthArr.push(authObj);
                }
                fs_1.default.writeFile(path_1.default.join(__dirname, '/database.json'), JSON.stringify(bookAuthArr, null, 3), 'utf8', (err) => {
                    if (err) {
                        res.redirect('/register');
                    }
                    else {
                        res.redirect('/login');
                    }
                });
            });
        }
    }
    catch (e) {
        //  console.log(e);
        res.redirect('/register');
    }
});
//login
router.get('/login', (req, res) => {
    res.render('login');
});
router.post('/login', (req, res) => {
    let AuthArr = [];
    fs_1.default.readFile(path_1.default.join(__dirname, '/database.json'), 'utf8', async (err, data) => {
        if (err) {
            res.redirect('/register');
        }
        else {
            AuthArr = JSON.parse(data);
            const user = AuthArr.find(user => user.Email === req.body.email);
            if (user == null) {
                return res.status(400).send('Cannot find user');
            }
            try {
                const match = await bcrypt_1.default.compare(req.body.password, user.Password);
                let result = JSON.stringify(user, null, 3);
                if (match) {
                    const users = await User.find();
                    res.render('index', {
                        title: 'Home Page',
                        users: users,
                    });
                    //   res.render('index')
                }
                else {
                    res.send('Not allowed');
                }
            }
            catch (error) {
                res.status(500).send();
            }
        }
    });
});
//login and sign up end
// image upload
var storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    },
});
// buffer to store single image
var upload = (0, multer_1.default)({ storage: storage }).single("image");
// insert a user into database route
router.post("/add-users-form", upload, (req, res) => {
    var _a;
    const user = new User({
        title: req.body.title,
        image: (_a = req.file) === null || _a === void 0 ? void 0 : _a.filename,
        datepublished: req.body.datepublished,
        description: req.body.description,
        pagecount: req.body.pagecount,
        genre: req.body.genre,
        bookid: req.body.bookid,
        publisher: req.body.publisher,
    });
    user.save((err) => {
        if (err) {
            res.json({ message: err.message, type: "danger" });
        }
        else {
            req.session.message = {
                type: 'success',
                message: 'User added successfully!',
            };
            res.redirect('/index');
        }
    });
});
// // Get all users route
// router.get("/", (req, res)=> {
//    User.find().exec((err: any, users: any)=> {
//       if(err){
//          res.json({ message: err.message });
//       } else {
//          res.render('index', {
//             title: 'Home Page',
//             users: users,
//          })
//       }
//    })
// });
// Add user route
router.get("/add", (req, res) => {
    res.render("add_users", { title: "Add Users" });
});
// Edit a user route
router.get("/edit/:id", (req, res) => {
    let id = req.params.id;
    User.findById(id, (err, user) => {
        if (err) {
            res.redirect("/");
        }
        else {
            if (user == null) {
                res.redirect("/");
            }
            else {
                res.render("edit_users", {
                    title: "Edit User",
                    user: user
                });
            }
        }
    });
});
// Edit1 View user route
router.get("/edit_views/:id", (req, res) => {
    let id = req.params.id;
    User.findById(id, (err, user) => {
        if (err) {
            res.redirect("/");
        }
        else {
            if (user == null) {
                res.redirect("/");
            }
            else {
                res.render("detail_users", {
                    title: "Detail User",
                    user: user
                });
            }
        }
    });
});
// Updete user route
router.post('/update/:id', upload, (req, res) => {
    let id = req.params.id;
    let new_image = '';
    if (req.file) {
        new_image = req.file.filename;
        try {
            fs_1.default.unlinkSync("./uploads/" + req.body.old_image);
        }
        catch (err) {
            // console.log(err)
        }
    }
    else {
        new_image = req.body.old_image;
    }
    User.findByIdAndUpdate(id, {
        title: req.body.title,
        image: new_image,
        datepublished: req.body.datepublished,
        description: req.body.description,
        pagecount: req.body.pagecount,
        genre: req.body.genre,
        bookid: req.body.bookid,
        publisher: req.body.publisher,
    }, (err, result) => {
        if (err) {
            res.json({ message: err.message, type: 'danger' });
        }
        else {
            req.session.message = {
                type: 'success',
                message: 'User updated successfully'
            };
            res.redirect('/');
        }
    });
});
// Delete user route
router.get('/delete/:id', (req, res) => {
    let id = req.params.id;
    User.findByIdAndRemove(id, (err, result) => {
        if (result.image != '') {
            try {
                fs_1.default.unlinkSync('./uploads/' + result.image);
            }
            catch (err) {
                // console.log(err)
            }
        }
        if (err) {
            res.json({ message: err.message });
        }
        else {
            req.session.message = {
                type: 'info',
                message: 'User deleted Successfully!'
            };
            res.redirect('/');
        }
    });
});
module.exports = router;
//# sourceMappingURL=router.js.map