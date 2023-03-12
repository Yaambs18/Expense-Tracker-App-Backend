const User = require('../models/user');
const bcrypt = require('bcrypt');

function isStringInvalid(string){
    if(string == undefined || string.length === 0){
        return true;
    }
    else{
        return false;
    }
}

exports.addUser = async (req, res, next) => {
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

exports.loginUser = async (req, res, next) =>{
    try {
        const { email, password } = req.body;

        if(isStringInvalid(email) || isStringInvalid(password)){
            return res.status(400).json({err : 'Bad Parameters: Something is missing'});
        }

        const user = await User.findAll({where : {email: req.body.email}});
        if(user.length > 0){
            bcrypt.compare(password, user[0].password, (err, result) => {
                if(err){
                    console.log(error);
                    res.sendStatus(500).json(error);
                }
                if(result){
                    res.json({message: 'User Login Successful'});
                }
                else{
                    res.status(401).json({message: "Password is Incorrect. Please try again !!!"});
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