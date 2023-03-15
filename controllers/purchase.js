const RazorPay = require('razorpay');
const Order = require('../models/order');
const userController = require('./user');

exports.purchasepremium = async (req, res, next) => {
    try {
        var rzp = new RazorPay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        })
        const amount = 10000;

        rzp.orders.create({amount, currency: 'INR'}, (err, order) => {
            if(err) {
                throw new Error(JSON.stringify(err));
            }
            req.user.createOrder({orderId: order.id, status: 'PENDING'}).then(() => {
                return res.status(201).json({order, key_id: rzp.key_id});
            })
            .catch(err => {
                throw new Error(err);
            })
        })
    }
    catch(err){
        console.log(err);
        res.status(403).json({ message: 'Sometghing went wrong', error: err})
    }
}

exports.updatetransactionstatus = async (req, res, next) => {
    try{
        const userId = req.user.id;
        const { payment_id, order_id} = req.body;
        const order = await Order.findOne({ where: { orderId: order_id } });
        if(payment_id === null){
            const promise1 = order.update({ paymentId: payment_id, status: 'FAILED' })
            .then(() => {
                res.status(403).json({sucess: false, message: "Transaction Failed"});
            })
        }
        const promise1 = order.update({ paymentId: payment_id, status: 'SUCCESSFUL' });
        const promise2 = req.user.update({ ispremiumuser: true });

        Promise.all([promise1, promise2]).then(async () => {
            const userNewToken = await userController.generateToken(userId)
            res.status(202).json({sucess: true, message: "Transaction Successful", token: userNewToken});
        })
    }
    catch(err){
        console.log(err);
        res.status(403).json({ message: 'Sometghing went wrong', error: err})
    }
}