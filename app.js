"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
// require("dotenv").config();
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const express_session_1 = __importDefault(require("express-session"));
const path_1 = __importDefault(require("path"));
// const dotENV = dotenv.config()
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5001;
// database connection
// mongoose.connect("mongodb://localhost:27017/node_crud");
mongoose_1.default.connect("mongodb+srv://skippertech:skipper123Tech@nodejs.79xtnsg.mongodb.net/node_crudapp?retryWrites=true&w=majority");
const db = mongoose_1.default.connection;
db.on('error', (error) => console.log(error));
db.once('open', () => console.log('connected to the database!'));
// middlewares
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
app.use((0, express_session_1.default)({
    secret: "my secret key",
    saveUninitialized: true,
    resave: false,
}));
app.use((req, res, next) => {
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});
// Static
app.use(express_1.default.static("uploads"));
// load static assets Images and css
app.use('/static', express_1.default.static(path_1.default.join(__dirname, 'public/')));
app.use('/assets', express_1.default.static(path_1.default.join(__dirname, 'public/css')));
app.use('/assets', express_1.default.static(path_1.default.join(__dirname, 'public/assets')));
// set template engine
app.set("view engine", "ejs");
// route prefix
app.use("", require("./routes/router"));
app.listen(PORT, () => {
    console.log(`Sever started at http://localhost:${PORT}`);
});
module.exports = app;
//# sourceMappingURL=app.js.map