const mongoose = require("mongoose");
const Joi = require("joi");

let interactionsSchema = new mongoose.Schema({
  tenant_name: String,
  driver_name: String,
  manufacturer_model: String,
  license_number: String,
  pick_up_date:  Date,
  pick_up_time: String,
  return_date: Date,
  return_time: String,
  done_by: String,
  status: String,
})
exports.InteractionsModel = mongoose.model("interactions", interactionsSchema)

exports.validateInteractions = (_reqBody) => {
  return Joi.object({
    tenant_name: Joi.string().min(2).max(150).required(),
    driver_name: Joi.string().min(2).max(150).required(),
    manufacturer_model: Joi.string().min(2).max(150).required(),
    license_number: Joi.string().min(2).max(150).required(),
    pick_up_date: Joi.date().min("1-1-2023").max("1-1-2100").required(),
    pick_up_time: Joi.string().min(2).max(150).required(),
    return_date: Joi.date().min("1-1-2023").max("1-1-2100").required(),
    return_time: Joi.string().min(2).max(150).required(),
    done_by: Joi.string().min(2).max(150).required(),
    status: Joi.string().min(2).max(150).required(),
}).validate();
}