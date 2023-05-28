const express = require("express");
const { auth, authAdmin } = require("../middlewares/auth");
const { MissionsModel, validateMissions } = require("../models/missionsModel");

const router = express.Router();

router.get("/", authAdmin, async (req, res) => {
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
          { title: sExp },
          { mission: sExp },
          { status: sExp },
        ];

      }
    }
    let data = await MissionsModel.find(query)
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

router.get("/workerMission/:id", auth, async (req, res) => {
  let query = {status:'לא בוצע'}
  query["$or"] =[{ for_id:undefined},{'for_id._id':req.params.id} ]
  try {
    let mission = await MissionsModel.find(query);
    res.json(mission);
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }
})

router.get("/count",auth, async (req, res) => {
  let perPage = req.query.limit;
  try {
    let data = await MissionsModel.countDocuments(perPage);
    res.json({ count: data, pages: Math.ceil(data / perPage) })
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }
})

router.post("/", authAdmin, async (req, res) => {
  let validBody = validateMissions(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let mission = new MissionsModel(req.body);
    mission.added_by = req.tokenData._id;
    await mission.save();
    res.json(mission);
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }
})

router.put("/:id", authAdmin, async (req, res) => {
  let validBody = validateMissions(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let id = req.params.id;
    let data;
    data = await MissionsModel.updateOne({ _id: id }, req.body);
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }
})

router.patch("/:id", auth, async (req, res) => {
  try {
    let _id = req.params.id;

    let data = await MissionsModel.updateOne({ _id: _id }, { status: 'בוצע' });
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }
})

router.delete("/:id", authAdmin, async (req, res) => {
  try {
    let id = req.params.id;
    let data;
    data = await MissionsModel.deleteOne({ _id: id });
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }
})


module.exports = router;