const Sib = require('sib-api-v3-sdk');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

const ForgotPasswordRequest = require('../models/forgotPasswordRequest');
const User = require('../models/user');
const sequilize = require('../util/database');

const client = Sib.ApiClient.instance

const apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.MAIL_API_KEY;

const tranEmailApi = new Sib.TransactionalEmailsApi();

const sender = {
    email: 'yanshbhardwaj14@gmail.com',
    name: 'Yansh Bhardwaj'
}

const sendResetPasswordEmail = async (req, res, next) => {
    const transaction = await sequilize.transaction();
    try {
        const { email } = req.body;

        const user = await User.findOne({ where: { email: email }});
        if(!user){
            res.status(404).json({message: 'Email does not Exist. Please Sign Up!!'});
        }

        const uuid = uuidv4();
        console.log(uuid);

        await user.createForgotPasswordRequest({
            id: uuid,
            isActive: true
        }, {
            transaction: transaction
        });

        const recievers = [
            {
                email: email
            }
        ]

        const resetUrl = `http://localhost:3000/password/resetpassword/${uuid}`;
        console.log(resetUrl);
        
        const result = await tranEmailApi.sendTransacEmail({
            sender,
            to: recievers,
            subject: 'Reset password for your Expense Tracker account',
            textContent: `Greetings from Expense Tracker,

            We received a request to reset the password for the Expense Tracker account associated with this e-mail address. Click the link below to reset your password`,
            htmlContent: `
            <a href="${resetUrl}">Reset Password</a>`
        });
        console.log(result);
        await transaction.commit();
        res.status(200).json('Password Reset link sent to you email');
    }
    catch(error) {
        await transaction.rollback();
        console.log(error);
        res.status(500).json({message: 'Something Went Wrong', Error: error});
    }
}

const resetPassword = async (req, res, next) => {
    const resetId = req.params.resetId;
    const forgotpassword = await ForgotPasswordRequest.findByPk(resetId);
    if(!forgotpassword || !forgotpassword.isActive){
        res.status(404).json({message: 'The password rest link either expired or Does not exist'});
    }
    res.send(`<html>
                <script>
                    function formsubmitted(e){
                        e.preventDefault();
                        console.log('called')
                    }
                </script>
                <form action="/password/updatepassword/${resetId}" method="get">
                    <label for="newpassword">Enter New password</label>
                    <input name="newpassword" type="password" required></input>
                    <button>reset password</button>
                </form>
            </html>`);
}

const updatePassword = async (req, res, next) => {
    const transaction = sequilize.transaction();
    try{
        const { newpassword } = req.query;
        const resetId = req.params.resetId;
        const forgotpassword = await ForgotPasswordRequest.findByPk(resetId);
        if(forgotpassword){
            const user = await User.findByPk(forgotpassword.userId);
            if(user) {
                const passHash = await bcrypt.hash(newpassword, 10);
                await user.update({
                    password: passHash
                }, {
                    transaction: transaction
                });
 
                await forgotpassword.update({
                    isActive: false
                }, {
                    transaction: transaction
                });
                transaction.commit();
                res.status(201).json({message: 'Successfuly update the new password'});
            }
            else{
                return res.status(404).json({ error: 'No user Exists', success: false})
            }
        }
    }
    catch(error){
        transaction.rollback();
        return res.status(403).json({ error, success: false } )
    }
}

module.exports = {
    sendResetPasswordEmail,
    resetPassword,
    updatePassword
}