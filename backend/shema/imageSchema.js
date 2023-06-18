const mongoose = require('mongoose')


const currentDateTime = new Date();
const imageShema = new mongoose.Schema({
    imagePath : { type: String, unique: true, required: true},
    user: { type: String, required: true },
    createdAt: {
        type: Date,
        default : currentDateTime
    }
})

const Image = mongoose.model('Image', imageShema);

module.exports = Image;
