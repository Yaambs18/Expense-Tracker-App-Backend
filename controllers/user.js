const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const FilesDownloaded = require('../models/filesDownloaded');

const UserServices = require('../services/userServices');
const S3Services = require('../services/S3services');

function isStringInvalid(string){
    if(string == undefined || string.length === 0){
        return true;
    }
    else{
        return false;
    }
}

const generateToken = async function (id){
    const user = await User.findByPk(id);
    return jwt.sign({userId: id, name: user.name, isPremiumUser: user.ispremiumuser}, process.env.TOKEN_SECRET);
}

const addUser = async (req, res, next) => {
    try {        
        const { name, email, password } = req.body;

        if(isStringInvalid(name) || isStringInvalid(email) || isStringInvalid(password)){
            return res.status(400).json({err : 'Bad Parameters: Something is missing'});
        }

        const passHash = await bcrypt.hash(password, 10);
        await User.create({
            name: name,
            email: email,
            password: passHash
        })
        res.status(201).json({message: 'Successfully created a new user'});
    }
    catch(err) {
        console.log(err);
        res.sendStatus(500).json(err);        
    }
}

const loginUser = async (req, res, next) =>{
    try {
        const { email, password } = req.body;

        if(isStringInvalid(email) || isStringInvalid(password)){
            return res.status(400).json({err : 'Bad Parameters: Something is missing'});
        }

        const user = await User.findAll({where : {email: req.body.email}});
        if(user.length > 0){
            console.log(user[0].id);
            const jwtToken = await generateToken(user[0].id);
            bcrypt.compare(password, user[0].password, (err, result) => {
                if(err){
                    console.log(error);
                    res.sendStatus(500).json(error);
                }
                if(result){
                    res.json({success: true, token: jwtToken, message: 'User Login Successful'});
                }
                else{
                    res.status(401).json({success: false, message: "Password is Incorrect. Please try again !!!"});
                }
            });
        }
        else{
            res.status(404).json({message: "User doesn't exist. Please Sign Up !!"});
        }
    }
    catch(error) {
        console.log(error);
        res.sendStatus(500).json(error);
    }
}

const downloadExpenseReport = async (req, res, next) => {
    try {
        const reqUser = req.user;
        if(!reqUser.ispremiumuser){
            res.status(401).json({ success: false, messasge: 'Unauthorised user'});
        }
        const userExpenses = await UserServices.getExpenses(req);
        
        // console.log(userExpenses);
        const stringifiedExpenses = JSON.stringify(userExpenses);
        const filename = `Expense${reqUser.id}/${new Date()}`;
        const fileUrl = await S3Services.uploadToS3(stringifiedExpenses, filename);
        const result = await FilesDownloaded.create({
            fileUrl: fileUrl,
            userId: reqUser.id
        })
        res.status(201).json({fileUrl, success: true});
    }
    catch(err) {
        console.log(err);
        res.sendStatus(500).json({success: false, error: err}); 
    }
}

module.exports = {
    addUser,
    loginUser,
    generateToken,
    downloadExpenseReport
}