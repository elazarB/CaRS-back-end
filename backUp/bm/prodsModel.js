const mongoose = require("mongoose");
const Joi = require("joi")

let schema = new mongoose.Schema({
  name: String,
  img: String,
  cal: Number,
  price: Number,
  user_id: String,
  date: Date,
})
exports.someModel = mongoose.model("foods", schema)

exports.validateJoi = (_reqBody) => {
  let joiSchema = Joi.object({
    name: Joi.string().min(1).max(150).required(),
    img: Joi.string().min(1).max(400).allow(null, ""),
    cal: Joi.number().min(1).max(9999).required(),
    price: Joi.number().min(1).max(999).required()
  })
  return joiSchema.validate(_reqBody)
}