const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("practise_mysql", "root", "root@1234", {
  host: "localhost",
  dialect: "mysql",
});

sequelize
  .authenticate()
  .then((db) => console.log("DB connected successfully"))
  .catch((err) => console.log("ERROR:", err));

module.exports = sequelize;
