const { GetEmailCampaign } = require('sib-api-v3-sdk');
const Sib = require('sib-api-v3-sdk');

const client = Sib.ApiClient.instance

const apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.MAIL_API_KEY;

const tranEmailApi = new Sib.TransactionalEmailsApi();

const sender = {
    email: 'yanshbhardwaj14@gmail.com',
    name: 'Yansh Bhardwaj'
}

const sendResetPasswordEmail = async (req, res, next) => {
    try {
        const { email } = req.body;
        console.log(email);
        const recievers = [
            {
                email: email
            }
        ]
        
        const result = await tranEmailApi.sendTransacEmail({
            sender,
            to: recievers,
            subject: 'Reset password for your Expense Tracker account',
            textContent: 'Hi from Expense Tracker'
        });
        console.log(result);
        res.status(200).json('Password Reset link sent to you email');
    }
    catch(error) {
        console.log(error);
        res.status(500).json({message: 'Something Went Wrong', Error: error});
    }
}

module.exports = {
    sendResetPasswordEmail
}