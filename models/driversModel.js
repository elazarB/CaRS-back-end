const mongoose = require("mongoose");
const Joi = require("joi");

let driversSchema = new mongoose.Schema({
  name: String,
  identity: String,
  phone_number: String,
  email: String,
  data_of_birth:Date,
  license_issuance_date: Date,
  exp_license: Date,
  added_by: String,
  Date_added:{
    type:Date,default:Date.now
  },
  images: Array,
  files: Array,
})
exports.DriversModel = mongoose.model("drivers", driversSchema)

exports.validateDrivers = (_reqBody) => {
  let joiSchema = Joi.object({
    name: Joi.string().min(2).max(150).required(),
    identity: Joi.string().min(2).max(150).required(),
    phone_number: Joi.string().min(2).max(10).required(),
    email: Joi.string().min(2).max(100).required(),
    data_of_birth: Joi.date().min("1-1-1900").max("1-1-2100").required(),
    license_issuance_date: Joi.date().min("1-1-1900").max("1-1-2100").required(),
    exp_license: Joi.date().min("1-1-1900").max("1-1-2100").required(),
    images: Joi.array().min(0).max(100).allow(null,""),
    files: Joi.array().min(0).max(100).allow(null,""),
  })
  return joiSchema.validate(_reqBody)
}
