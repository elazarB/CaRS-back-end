const express = require("express");
const { auth, authAdmin } = require("../middlewares/auth");
const { PricesModel, validatePrices } = require("../models/pricesModel");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  let search = req.query.s || 'מחירון 1'

  try {
    let data = await PricesModel.find({title:search},{pricing:1})
      data = data[0].pricing
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
    res.json({ count: 13, pages: Math.ceil(13 / perPage) })
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }
})

router.get("/titles",auth, async (req, res) => {
  try {
    let data = await PricesModel.find({},{title:1,from:1,to:1})
    res.json(data)
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }
})


router.patch("/:index/:letter", authAdmin, async (req, res) => {
  try {
    let index = req.params.index
    let letter = req.params.letter
    let data = await PricesModel.updateOne(
      { title: index, "pricing.letter": letter },
      { $set: { "pricing.$": req.body } }
    );
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }
})


module.exports = router;