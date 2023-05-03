const mongoose = require('mongoose');
const { config} = require('../config/secrets')

main().catch(err => console.log(err));

async function main() {
  // כדי למנוע הצגת אזהרה
  mongoose.set('strictQuery', false);
  // וזה לווינדוס 11
  await mongoose.connect(`mongodb+srv://${config.db_user}:${config.db_pass}@cluster0.ibm2hzi.mongodb.net/cars`);
  console.log("mongo connect cars atlas");
  
  // use `await mongoose.connect('mongodb://user:password@localhost:27017/test');` if your database has auth enabled
}