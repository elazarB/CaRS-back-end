const express = require("express");
const { DriversModel, validateDrivers } = require("../models/driversModel");
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
        // let num = Number(searchT) != NaN?Number(searchT):"";
        query["$or"] = [
          { name: sExp },
          { identity: sExp },
          { phone_number: sExp },
          { email: sExp },
        ];

      }
    }
    let data = await DriversModel.find(query)
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

router.get("/names", auth, async (req, res) => {
  try{
     let data = await DriversModel.find({},{name:1,identity:1})
     res.json(data);
   }
   catch (err) {
     console.log(err);
     res.status(502).json({ err })
   }
 })

router.get("/single/:id", auth, async (req, res) => {
  try {
    let worker = await DriversModel.findOne({ _id: req.params.id }, { password: 0 });
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
    let data = await DriversModel.countDocuments(perPage);
    res.json({ count: data, pages: Math.ceil(data / perPage) })
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }
})

router.post("/", auth, async (req, res) => {
  let validBody = validateDrivers(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let drivers = new DriversModel(req.body);
    drivers.added_by = req.tokenData._id;
    console.log(req.tokenData);
    await drivers.save();
    res.json(drivers);
  }
  catch (err) {
    if (err.code == 11000) {
      return res.status(400).json({ msg: "identity already in system", code: 11000 })
    }
    console.log(err);
    res.status(502).json({ err })
  }
})

router.put("/:id", auth, async (req, res) => {
  let validBody = validateDrivers(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let id = req.params.id;
    let data;
    data = await DriversModel.updateOne({ _id: id }, req.body);
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
    data = await DriversModel.deleteOne({ _id: id });
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }
})


module.exports = router;