const express = require('express');
const UserRouter = express.Router();
const UserController = require('../Controller/UserController');

const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); 
    }
});

const upload = multer({ storage });

UserRouter.route("/Upload").post(upload.array('images', 10), UserController.DataUpload);
UserRouter.route("/getall").get(UserController.getall);

module.exports = UserRouter;
