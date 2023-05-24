const mongoose = require("mongoose");
const Joi = require("joi");

let pricesSchema = new mongoose.Schema({
  title: String,
  from:String,
  to: String,
  pricing: Array,
})
exports.PricesModel = mongoose.model("prices", pricesSchema)

exports.validatePrices = (_reqBody) => {
  let joiSchema = Joi.object({
    title: Joi.string().min(1).max(150).required(),
    from: Joi.string().min(2).max(150).required(),
    to: Joi.string().min(2).max(150).required(),
    pricing: Joi.array().min(0).max(120).required(),
  })
  return joiSchema.validate(_reqBody)
}