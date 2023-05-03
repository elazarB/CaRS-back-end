const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const { config } = require("../config/secrets");

const workerSchema = new mongoose.Schema({
  name:String,
  user_name:String,
  password:String,
  address:String,
  phone_number:String,
  email:String,
  company_role:String,
  date_join:{
    type:Date, default:Date.now
  },
  role:{
    type:String, default:"pending"
  },
  images: Array,
  files: Array,
})

exports.WorkerModel = mongoose.model("workers",workerSchema);


exports.createToken = (worker_id,role) => {
  let token = jwt.sign({_id:worker_id,role},config.token_secret,{expiresIn:"600mins"})
  return token;
}


exports.validateWorker = (_reqBody) => {
  let joiSchema = Joi.object({
    name:Joi.string().min(2).max(150).required(),
    user_name:Joi.string().min(2).max(150).required(),
    password:Joi.string().min(3).max(150).required(),
    address:Joi.string().min(3).max(150).required(),
    phone_number:Joi.string().min(3).max(17).required(),
    email:Joi.string().min(3).max(50).required(),
    company_role:Joi.string().min(3).max(100).allow(null,""),
    images: Joi.array().min(0).max(100).allow(null,""),
    files: Joi.array().min(0).max(100).allow(null,""),
  })
  return joiSchema.validate(_reqBody);
}

exports.validateLogin = (_reqBody) => {
  let joiSchema = Joi.object({
    user_name:Joi.string().min(2).max(150).required(),
    password:Joi.string().min(3).max(150).required()
  })
  return joiSchema.validate(_reqBody);
}

// exports.validateRoleChange = (_reqBody) => {
//   let joiSchema = Joi.object({
//     name:Joi.string().min(2).max(150).required(),
//     user_name:Joi.string().min(2).max(150).required(),
//     password:Joi.string().min(3).max(150).required(),
    

//   })
//   return joiSchema.validate(_reqBody);
// }