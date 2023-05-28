const mongoose = require('mongoose');
const { config } = require('../config/secrets')

main().catch(err => console.log(err));


async function main() {
  mongoose.set('strictQuery', false);
  // Connecting the server to the database
  await mongoose.connect(`mongodb+srv://${config.db_user}:${config.db_pass}@cluster0.ibm2hzi.mongodb.net/cars`);
  // Display a message if the server is connected successfully
  console.log("mongo connect cars atlas");
}