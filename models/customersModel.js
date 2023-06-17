const mongoose = require("mongoose");
const Joi = require("joi");

let customersSchema = new mongoose.Schema({
  name: String,
  ID_type:String,
  identity: String,
  phone_number: String,
  another_phone_number: String,
  country: String,
  city: String,
  address: String,
  email: String,
  added_by: String,
  drivers: Array,
  images: Array,
  files: Array,
})
exports.CustomersModel = mongoose.model("customers", customersSchema)

exports.validateCustomers = (_reqBody) => {
  let joiSchema = Joi.object({
    name: Joi.string().min(2).max(150).required(),
    ID_type: Joi.string().min(2).max(150).required(),
    identity: Joi.string().min(2).max(150).required(),
    phone_number: Joi.string().min(2).max(12).required(),
    another_phone_number: Joi.string().min(2).max(12).allow(null,""),
    country: Joi.string().min(2).max(150).required(),
    city: Joi.string().min(2).max(150).required(),
    address: Joi.string().min(2).max(150).required(),
    email: Joi.string().min(2).max(150).email().required(),
    drivers: Joi.array().min(2).max(100).allow(null,""),
    images: Joi.array().min(0).max(100).allow(null,""),
    files: Joi.array().min(0).max(100).allow(null,""),
  })
  return joiSchema.validate(_reqBody)
}
