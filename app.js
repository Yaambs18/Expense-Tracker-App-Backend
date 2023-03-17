const path = require('path');

const express = require("express");
const cors = require("cors");
const dotenv = require('dotenv');

dotenv.config();

const sequilize = require("./util/database");
const expenseRoutes = require('./routes/expenseRoutes');
const userRoutes = require('./routes/user');
const purchaseRoutes = require('./routes/purchase');
const premiumRoutes = require('./routes/premium');
const passwordRoutes = require('./routes/password');

const User = require('./models/user');
const Expense = require('./models/expense');
const Order = require('./models/order');
const ForgotPasswordRequest = require('./models/forgotPasswordRequest');
const FilesDownloaded = require('./models/filesDownloaded');

const app = express();

app.use(cors());
app.use(express.json());

app.use("/expense", expenseRoutes);
app.use('/user', userRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/premium', premiumRoutes);
app.use('/password', passwordRoutes);

app.use((req, res) => {
  console.log('requested url', req.url);
  res.sendFile(path.join(__dirname, `public/${req.url}`));
})

User.hasMany(Expense);
Expense.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
User.hasMany(Order);
Order.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(ForgotPasswordRequest);
ForgotPasswordRequest.belongsTo(User, { constraints: true, onDelete: 'CASCADE'});
User.hasMany(FilesDownloaded);
FilesDownloaded.belongsTo(User, { constraints: true, onDelete: 'CASCADE'});

sequilize
  .sync()
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));
