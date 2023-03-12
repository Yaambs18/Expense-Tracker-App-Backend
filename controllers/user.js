const User = require('../models/user');

exports.addUser = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    User.create({
        name: name,
        email: email,
        password: password
    })
    .then(result => {
        res.status(201);
        res.json(result.dataValues);
    })
    .catch(err => {
        console.log(err);
        res.sendStatus(403);        
    });
}