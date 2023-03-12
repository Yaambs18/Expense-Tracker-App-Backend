const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const sequilize = require("./util/database");
const expenseRoutes = require('./routes/expenseRoutes');
const userRoutes = require('./routes/user');

const app = express();

app.use(cors());
app.use(bodyParser.json({ extended: false }));

app.use("/expenseData", expenseRoutes);
app.use('/user', userRoutes);

sequilize
  .sync()
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));
