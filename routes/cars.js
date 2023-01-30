const express = require("express");
const { CarsModel, validateCars } = require("../models/carsModel");
const { auth } = require("../middlewares/auth");


const router = express.Router();

router.get("/", auth, async (req, res) => {
  let perPage = Math.min(req.query.perPage, 20) || 5;
  let page = req.query.page - 1 || 0;
  let sort = req.query.sort || "_id";
  let reverse = req.query.reverse == "yes" ? 1 : -1;
  try {
    let cars = await CarsModel
      .find({})
      .limit(perPage)
      .skip(page * perPage)
      .sort({ [sort]: reverse })
    res.json(cars)
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }
})

router.get("search", async (req, res) => {
  let s = req.query.s;
  let sExp = new RegExp(s, "i");
  try {
    let data = await CarsModel.find({ $or: [{ manufacturer: sExp }, { model: sExp }] })
      .limit(20)
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }
})


router.post("/", auth, async (req, res) => {
  let validBody = validateCars(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let cars = new CarsModel(req.body);
    cars.added_by = req.tokenData.user_name;
    console.log(req.tokenData);
    await cars.save();
    res.json(cars);
  }
  catch (err) {
    if (err.code == 11000) {
      return res.status(400).json({ msg: "license number already in system", code: 11000 })
    }
    console.log(err);
    res.status(502).json({ err })
  }
})

router.put("/:id", auth, async (req, res) => {
  let validBody = validateCars(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let id = req.params.id;
    let data;
    data = await CarsModel.updateOne({ _id: id }, req.body);
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }
})

router.delete("/:id", auth, async (req, res) => {
  try {
    let id = req.params.id;
    let data;
    data = await CarsModel.deleteOne({ id: id });
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }
})


module.exports = router;