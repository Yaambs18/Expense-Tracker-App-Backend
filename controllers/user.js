const User = require('../models/user');

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

        await User.create({
            name: name,
            email: email,
            password: password
        })
        res.status(201).json({message: 'Successfully created a new user'});
    }
    catch(err) {
        console.log(err);
        res.sendStatus(505).json(err);        
    }
}

exports.loginUser = async (req, res, next) =>{
    try {
        const user = await User.findAll({where : {email: req.body.email}});
        if(user[0] == null){
            res.status(404).json({message: "User doesn't exist. Please Sign Up !!"});
        }
        else if(user[0].password !== req.body.password){
            res.status(403).json({message: "Email or Password is Incorrect. Please try again !!!"});
        }
        else{
            res.json({message: 'Login Successful'});
        }
    }
    catch(error) {
        console.log(error);
        res.sendStatus(505).json(error);
    }
}