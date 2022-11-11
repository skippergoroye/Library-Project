"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    datepublished: {
        type: Date,
        required: true,
        // default: Date.now,
    },
    pagecount: {
        type: String,
        required: true,
    },
    genre: {
        type: String,
        required: true,
    },
    bookid: {
        type: String,
        required: true,
    },
    publisher: {
        type: String,
        required: true,
    },
});
module.exports = mongoose_1.default.model("User", userSchema);
// exports = mongoose.model('user', userSchema);
//# sourceMappingURL=users.js.map