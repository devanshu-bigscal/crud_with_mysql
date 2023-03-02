const express = require("express");
const app = express();
const sequelize = require("./connections/db_connection");
const userRoutes = require("./routes/user");
const userModel = require("./models/user");
require('dotenv').config()

app.use(express.json());

app.use("/", userRoutes);


const port = 3000;

app.listen(port, (req, res) => {
  console.log(`Server running at port ${port}`);
});
