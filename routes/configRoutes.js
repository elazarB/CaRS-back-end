const indexR = require("./index");
const workersR = require("./workers");
const customersR = require("./customers");
const driversR = require("./drivers");
const carsR = require("./cars");
const interactionsR = require("./interactions");
const missionsR = require("./missions");


exports.routesInit = (app) => {
  app.use("/", indexR);
  app.use("/workers", workersR);
  app.use("/customers", customersR);
  app.use("/drivers", driversR);
  app.use("/cars", carsR);
  app.use("/interactions", interactionsR);
  app.use("/missions", missionsR);
}


