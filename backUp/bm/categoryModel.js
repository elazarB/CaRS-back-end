const mongoose = require("mongoose");
const Joi = require("joi")

//  chatGpt
let categorySchema = new mongoose.Schema({
  name: String,
  cat_url: String,
  info: String,
  img_url: String
})

exports.CategoryModel = mongoose.model("categories", categorySchema);

exports.validateCategory = (_reqBody) => {
  let joiSchema = Joi.object({
    name: Joi.string().min(1).max(999).required(),
    cat_url: Joi.string().min(1).max(999).required(),
    info: Joi.string().min(1).max(999).required(),
    img_url: Joi.string().min(1).max(999).allow(null,""),
  })
  return joiSchema.validate(_reqBody)
}