const mongoose = require("mongoose");
const Joi = require("joi");

let missionsSchema = new mongoose.Schema({
  for_id: String,
  title: String,
  time_to_do: Date,
  mission: String,
  remarks:String,
  status: {
    type: String,default:"לא בוצע"
  },
  importance: String,
  added_by: String,
  Date_added:{
    type:Date,default:Date.now
  },
 date_done:Date,
})
exports.MissionsModel = mongoose.model("missions", missionsSchema)

exports.validateMissions = (_reqBody) => {
  let joiSchema = Joi.object({
    for_id: Joi.string().min(2).max(150).required(),
    title: Joi.string().min(2).max(150).required(),
    time_to_do: Joi.date().min('1-1-1900').max('1-1-2200').allow(null,""),
    mission: Joi.string().min(2).max(1000).required(),
    status:Joi.string().allow(null,""),
    remarks: Joi.string().min(2).max(1000).allow(null,""),
    importance: Joi.string().min(2).max(100).allow(null,""),
  })
  return joiSchema.validate(_reqBody)
}
