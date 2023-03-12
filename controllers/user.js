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