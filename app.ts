// require("dotenv").config();
import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import session from 'express-session'
import path from 'path';
import bodyparser from 'body-parser';
import bcrypt from 'bcrypt';





// const dotENV = dotenv.config()

const app = express();
const PORT = process.env.PORT || 5001;


// database connection
// mongoose.connect("mongodb://localhost:27017/node_crud");
mongoose.connect("mongodb+srv://skippertech:skipper123Tech@nodejs.79xtnsg.mongodb.net/node_crudapp?retryWrites=true&w=majority");
const db = mongoose.connection
db.on('error', (error) => console.log(error))
db.once('open', ()=> console.log('connected to the database!'))



// middlewares
app.use(express.urlencoded({extended: false}))
app.use(express.json())


app.use(session({
    secret: "my secret key",
    saveUninitialized: true,
    resave: false,
  }) 
);


// Typescript Express session
declare module 'express-session' {
  export interface SessionData {
    message: { [key: string]: any };
  }
}

app.use((req, res, next)=> {
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
})


// Static
app.use(express.static("uploads"))


// load static assets Images and css
app.use('/static', express.static(path.join(__dirname, 'public/')))
app.use('/assets', express.static(path.join(__dirname, 'public/css')))
app.use('/assets', express.static(path.join(__dirname, 'public/assets')))



// set template engine
app.set("view engine", "ejs");



// route prefix
app.use("", require("./routes/router"));



app.listen(PORT, ()=> {
    console.log(`Sever started at http://localhost:${PORT}`);
});

export = app;


