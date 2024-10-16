const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    Username: {
        type: String,
        required: [true, 'please enter your username'],
        trim: true
    },
    SocialHandle: {
        type: String,
        required: [true, 'please enter your Social Media Profile'],
        unique: false,
        validate: {
            validator: function(value) {
                return validator.isURL(value, {
                    protocols: ['http', 'https'], 
                    require_protocol: true, 
                });
            },
            message: 'Please enter a valid URL for the Social Media Profile' 
        }
    },
    images: {
        type: Array,
        required: [true, 'please upload the images']
    }
});

const user = mongoose.model('user', userSchema);
module.exports = user;
