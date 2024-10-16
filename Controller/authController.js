const Admin = require('../Modals/AdminModal');
const User = require('../Modals/UserModal');
const jwt = require('jsonwebtoken')
// const sendEmail = require('../utils/SendEmail')
const crypto = require('crypto')
const util = require('util')

const signinResponse = async (user,statuscode,res)=>{
    const token = jwt.sign({id:user._id},process.env.SECRET_STR,{
        algorithm:'HS256',
        expiresIn: process.env.EXPIRES_IN
    })
    const customer_data = await User.find();
    res.status(statuscode).json({
        status:'success',
        token,
        data:{
            user,
            customer_data
        }
    })
}

exports.signUp = async(req,res) =>{
    try {
       
        const Username = req.body.Username
        const check_user = await User.findOne({Username})
        console.log(check_user)
        if(check_user)
        {
            throw new Error('User with this name already exists')
        }

       
        user = {
            Username: Username,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword
        }
        const newUser = await Admin.create(user)
        signinResponse(newUser,200,res)
    } catch (error) {
        console.log('error message : ',error.message)
        res.status(500).json({
            status: 'fail',
            message: error.message
        });
    }
}

exports.login = async(req,res) =>{
    try{
        const Username = req.body.Username
        const pswd = req.body.password;
        if(!Username || !pswd)
        {
             throw new Error('please enter email and password')
        }
        const curruser = await Admin.findOne({Username}).select('+password')
        if(!curruser)
        {
            throw new Error('please enter a valid credentials')
        }
        const match = await curruser.comparePassword(pswd,curruser.password)
        if(!match)
        {
            throw new Error('please enter a valid credentials')
        }

        signinResponse(curruser,200,res)
        
    } catch(error){
        console.log("error occured : ",error.message)
        res.status(400).json({
            status:'fail',
            message:`logged in failed: ${error.message}`
    })
}
}




exports.protect = async(req,res,next)=>{
    try {
        let testoken = req.headers.authorization
        let token
        if(testoken && testoken.startsWith('Bearer'))
        {
            token = testoken.split(' ')[1]
        }
        if(!token)
        {
            throw new Error('please log in first')
        }

   
        const decodeToken = await util.promisify(jwt.verify)(token,process.env.SECRET_STR)
        console.log(decodeToken)
    
        const curruser = await Admin.findById(decodeToken.id)
    
        if(!curruser)
        {
            throw new Error('user not found')
        }
    
        req.user = curruser
        next()
    } catch (error) {
        res.status(400).json({
            status:'fail',
            data:{
                message:error.message
            }
        })
    }
   
}
