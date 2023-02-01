const express = require("express");
const { DriversModel, validateDrivers } = require("../models/driversModel");
const { auth } = require("../middlewares/auth");


const router = express.Router();

// router.get("/", auth, async (req, res) => {
//   let perPage = Math.min(req.query.perPage, 20) || 20;
//   let page = req.query.page - 1 || 0;
//   let sort = req.query.sort || "_id";
//   let reverse = req.query.reverse == "yes" ? 1 : -1;
//   try {
//     let drivers = await DriversModel
//       .find({})
//       .limit(perPage)
//       .skip(page * perPage)
//       .sort({ [sort]: reverse })
//     res.json(drivers)
//   }
//   catch (err) {
//     console.log(err);
//     res.status(502).json({ err })
//   }
// })

router.get("/", auth, async (req, res) => {
  let limit = Math.min(req.query.limit, 100) || 20;
  let page = req.query.page - 1 || 0;
  let sort = req.query.sort || "_id";
  let reverse = req.query.reverse == "yes" ? 1 : -1;
  // cearch 
  let searchT = req.query.s || "";
  // search type
  let searchP = req.query.search || "name";
  let sExp = new RegExp(searchT, "i");
  let searchDate = req.query.searchDate || "";
  let searchDateS = req.query.searchDateS || "1-1-1900";
  let searchDateE = req.query.searchDateE || "1-1-2900";
  try {
    let data = await DriversModel
      .find(searchDate ? {
        [searchDate]: {
          $gt: searchDateS,
          $lt: searchDateE
        }
      } : {})
      .find(searchT ? { $or: [{ [searchP]: sExp }] } : {})
      .limit(limit)
      .skip(page * limit)
      .sort({ [sort]: reverse })
    res.json(data);
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
    drivers.added_by = req.tokenData.user_name;
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
    data = await DriversModel.deleteOne({ id: id });
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }
})


module.exports = router;