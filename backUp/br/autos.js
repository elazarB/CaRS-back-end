const express = require("express");
const { AutoModel, validateJoi } = require("../bm/autoModel");
const router = express.Router();

router.get("/", async (req, res) => {
  let perPage = Math.min(req.query.perPage, 10) || 5;
  let page = req.query.page - 1 || 0;
  let sort = req.query.sort || "_id";
  let reverse = req.query.reverse == "yes" ? 1 : -1;
  try {
    let data = await AutoModel
      .find({})
      .limit(perPage)
      .skip(page * perPage)
      .sort({ [sort]: reverse })
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }
})

router.get("/search", async (req, res) => {
  let s = req.query.s;
  let sExp = new RegExp(s, "i");
  try {
    let data = await AutoModel.find({ $or: [{ car: sExp }, { car_model: sExp }] })
      .limit(20)
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }
})


module.exports = router;
