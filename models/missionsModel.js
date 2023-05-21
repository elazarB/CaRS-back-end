const mongoose = require("mongoose");
const Joi = require("joi");

let missionsSchema = new mongoose.Schema({
  for_id: String,
  title: String,
  time_to_do: Date,
  mission: String,
  remarks:String,
  status: String,
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
    time_to_do: Joi.date().min("1-1-1900").max("1-1-2100").allow(null,""),
    mission: Joi.string().min(2).max(1000).required(),
    remarks: Joi.string().min(2).max(1000).allow(null,""),
    status: Joi.string().min(2).max(100).required(),
    importance: Joi.string().min(2).max(100).allow(null,""),
  })
  return joiSchema.validate(_reqBody)
}
