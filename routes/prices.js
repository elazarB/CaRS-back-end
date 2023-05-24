const express = require("express");
const { auth, authAdmin } = require("../middlewares/auth");
const { PricesModel, validatePrices } = require("../models/pricesModel");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  let limit = Math.min(req.query.limit || 20, 100);
  let page = (req.query.page || 1) - 1;
  let sort = req.query.sort || "_id";
  let reverse = req.query.reverse === "yes" ? 1 : -1;
  let search = req.query.s || 'מחירון 1'

  try {
    let data = await PricesModel.find({title:search})
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



router.get("/count",auth, async (req, res) => {
  let perPage = req.query.limit;
  try {
    let data = await PricesModel.countDocuments(perPage);
    res.json({ count: data, pages: Math.ceil(data / perPage) })
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }
})

// router.post("/", authAdmin, async (req, res) => {
//   console.log(req.body);
//   let validBody = validatePrices(req.body);
//   if (validBody.error) {
//     return res.status(400).json(validBody.error.details);
//   }
//   try {
//     let mewPrices = new PricesModel(req.body);
//     await mewPrices.save();
//     res.json(mewPrices);
//   }
//   catch (err) {
//     console.log(err);
//     res.status(502).json({ err })
//   }
// })

router.put("/:id", authAdmin, async (req, res) => {
  let validBody = validatePrices(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let id = req.params.id;
    let data;
    data = await PricesModel.updateOne({ _id: id }, req.body);
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }
})






module.exports = router;