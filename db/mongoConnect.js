const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  // כדי למנוע הצגת אזהרה
  mongoose.set('strictQuery', false);
  // וזה לווינדוס 11
  await mongoose.connect('mongodb+srv://CaRS:cars1234@cluster0.ibm2hzi.mongodb.net/test');
  console.log("mongo connect cars local");
  
  // use `await mongoose.connect('mongodb://user:password@localhost:27017/test');` if your database has auth enabled
}
