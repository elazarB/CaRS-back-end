const express = require("express");
const { InteractionsModel, validateInteractions } = require("../models/interactionsModel");
const { auth } = require("../middlewares/auth");


const router = express.Router();

router.get("/", auth, async (req, res) => {
  let limit = Math.min(req.query.limit || 20, 100);
  let page = (req.query.page || 1) - 1;
  let sort = req.query.sort || "_id";
  let reverse = req.query.reverse === "yes" ? 1 : -1;
  let searchT = req.query.s || "";
  let searchP = req.query.search || "";
  let sExp = new RegExp(searchT, "i");
  let searchDate = req.query.searchDate || "";
  let searchDateS = new Date(req.query.searchDateS || "1900-01-01");
  let searchDateE = new Date(req.query.searchDateE || "2900-01-01");

  try {
    let query = {};
    if (searchDate !== "") {
      query[searchDate] = {
        $gt: searchDateS,
        $lt: searchDateE,
      };
    }
    if (searchT !== "") {
      if (searchP !== "") {
        query["$or"] = [{ [searchP]: sExp }];
      } else {
        query["$or"] =
           [
            { 'tenant_name.name': sExp },
            { 'tenant_name.phone_number': sExp },
            { 'tenant_name.identity': sExp },
            { 'tenant_name.another_phone_number': sExp },
            { 'category': sExp },
            { 'car_obj.license_number': sExp },
            { 'car_obj.manufacturer_en': sExp },
            { 'car_obj.manufacturer_hb': sExp },
            { 'car_obj.model_en': sExp },
            { 'car_obj.model_hb': sExp },
            { 'driver_names.name': sExp },
            { 'status': sExp },
          ];
      }
    }
    let data = await InteractionsModel.find(query)
      .limit(limit)
      .skip(page * limit)
      .sort({ [sort]: reverse });
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }
})




router.get("/test", async (req, res) => {

  try {

    // let data = await InteractionsModel.find({$and:[{"car_obj.license_number":'6510575'}]})
    let data = await InteractionsModel.find({ $and: [{ "driver_names.name": 'moshe' }] })
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }
})



router.get("/single/:id", auth, async (req, res) => {
  try {
    let worker = await InteractionsModel.findOne({ _id: req.params.id }, { password: 0 });
    res.json(worker);
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }
})

router.get("/count",auth, async (req, res) => {
  let perPage = req.query.limit;
  console.log(perPage);
  try {
    let data = await InteractionsModel.countDocuments(perPage);
    res.json({ count: data, pages: Math.ceil(data / perPage) })
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }
})

router.post("/", auth, async (req, res) => {
  let validBody = validateInteractions(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let Interaction = new InteractionsModel(req.body);
    Interaction.done_by = req.tokenData._id;
    console.log(req.tokenData);
    await Interaction.save();
    res.json(Interaction);
  }
  catch (err) {
    if (err.code == 11000) {
      return res.status(400).json({ msg: "license number already in system", code: 11000 })
    }
    console.log(err);
    res.status(502).json({ err })
  }
})


router.patch("/:id/:status", auth, async (req, res) => {
  try {
    let id = req.params.id;
    let status = req.params.status;
    let data = await InteractionsModel.updateOne({ _id: id }, { status: status });
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }
})

router.put("/:id", auth, async (req, res) => {
  let validBody = validateInteractions(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let id = req.params.id;
    let data;
    data = await InteractionsModel.updateOne({ _id: id }, req.body);
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
    data = await InteractionsModel.deleteOne({ _id: id });
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }
})

module.exports = router;