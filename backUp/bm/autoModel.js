const mongoose = require("mongoose");
const Joi = require("joi");

let schema = new mongoose.Schema({
  car: String,
  car_model: String,
  car_color: String,
  car_model_year: Number,
  price: String,
  availability: Boolean,
})
exports.AutoModel = mongoose.model("autos", schema)

exports.validateJoi = (_reqBody) => {
  let joiSchema = Joi.object({
    car: Joi.string().min(1).max(999).required(),
    car_model: Joi.string().min(1).max(999).required(),
    car_color: Joi.string().min(1).max(999).required(),
    car_model_year: Joi.number().min(1900).max(3000).required(),
    price: Joi.string().min(1).max(999).required(),
    availability: Joi.boolean().required(),
  })
  return joiSchema.validate(_reqBody)
}
