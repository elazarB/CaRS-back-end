const mongoose = require("mongoose");
const Joi = require("joi");

let customersSchema = new mongoose.Schema({
  name: String,
  identity: String,
  phone_number: String,
  country: String,
  city: String,
  address: String,
  email: String,
  added_by: String,
  drivers: Array,
})
exports.CustomersModel = mongoose.model("customers", customersSchema)

exports.validateCustomers = (_reqBody) => {
  let joiSchema = Joi.object({
    name: Joi.string().min(2).max(150).required(),
    identity: Joi.string().min(2).max(150).required(),
    phone_number: Joi.string().min(2).max(12).required(),
    country: Joi.string().min(2).max(150).required(),
    city: Joi.string().min(2).max(150).required(),
    address: Joi.string().min(2).max(150).required(),
    email: Joi.string().min(2).max(150).email().required(),
    drivers: Joi.array().min(2).max(999).required(),
  })
  return joiSchema.validate(_reqBody)
}