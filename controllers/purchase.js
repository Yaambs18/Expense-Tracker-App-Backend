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

        rzp.orders.create({amount, currency: 'INR'}, async (err, order) => {
            if(err) {
                throw new Error(JSON.stringify(err));
            }
            const userOrder = new Order({
                orderId: order.id,
                status: 'PENDING',
                userId: req.user
            })
            await userOrder.save();
            return res.status(201).json({order, key_id: rzp.key_id});
        })
    }
    catch(err){
        console.log(err);
        res.status(403).json({ message: 'Sometghing went wrong', error: err})
    }
}

exports.updatetransactionstatus = async (req, res, next) => {
    try{
        const userId = req.user._id;
        const { payment_id, order_id} = req.body;
        const order = await Order.findOne({'orderId': order_id});
        if(payment_id === null){
            order.paymentId = payment_id;
            order.status = 'FAILED';
            await order.save();
            res.status(403).json({sucess: false, message: "Transaction Failed"});
        }
        order.paymentId = payment_id;
        order.status = 'FAILED';
        const promise1 = order.save();

        req.user.ispremiumuser = true;
        const promise2 = req.user.save();

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