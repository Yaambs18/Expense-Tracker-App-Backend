const express = require("express");
const cors = require("cors");

const sequilize = require("./util/database");
const expenseRoutes = require('./routes/expenseRoutes');
const userRoutes = require('./routes/user');

const app = express();

app.use(cors());
app.use(express.json());

app.use("/expense", expenseRoutes);
app.use('/user', userRoutes);

sequilize
  .sync()
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));
