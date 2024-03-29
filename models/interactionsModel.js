const mongoose = require("mongoose");
const Joi = require("joi");

let interactionsSchema = new mongoose.Schema({
  tenant_name: Object,
  category:String,
  car_obj:Object,
  pick_up_date:  Date,
  pick_up_time: String,
  return_date: Date,
  return_time: String,
  driver_names: Array,
  done_by: String,
  date_created:{
    type:Date, default:Date.now
  },
  status: String,
  images: Array,
  files: Array,
})
exports.InteractionsModel = mongoose.model("interactions", interactionsSchema)

exports.validateInteractions = (_reqBody) => {
  return Joi.object({
    tenant_name: Joi.object().min(1).max(150).required(),
    category: Joi.string().min(1).max(150).required(),
    car_id: Joi.object().min(1).max(150).allow(null,""),
    license_number: Joi.string().min(2).max(150).required(),
    pick_up_date: Joi.date().min("1-1-2023").max("1-1-2100").required(),
    pick_up_time: Joi.string().min(2).max(150).required(),
    return_date: Joi.date().min("1-1-2023").max("1-1-2100").required(),
    return_time: Joi.string().min(2).max(150).required(),
    driver_names: Joi.array().min(2).max(150).allow(null,""),
    status: Joi.string().min(2).max(150).required(),
    images: Joi.array().min(0).max(100).allow(null,""),
    files: Joi.array().min(0).max(100).allow(null,""),
}).validate();
}