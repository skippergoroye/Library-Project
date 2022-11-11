import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
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
})


export = mongoose.model("User", userSchema);
// exports = mongoose.model('user', userSchema);