const express = require("express");
const { CustomersModel, validateCustomers } = require("../models/customersModel");
const { auth } = require("../middlewares/auth");


const router = express.Router();

// router.get("/", auth, async (req, res) => {
//   let limit = Math.min(req.query.limit, 100) || 20;
//   let page = req.query.page - 1 || 0;
//   let sort = req.query.sort || "_id";
//   let reverse = req.query.reverse == "yes" ? 1 : -1;
//   // cearch 
//   let searchT = req.query.s || "";
//   // search type
//   let searchP = req.query.search || "name";
//   let sExp = new RegExp(searchT, "i");
//   let searchDate = req.query.searchDate || "";
//   let searchDateS = req.query.searchDateS || "1-1-1900";
//   let searchDateE = req.query.searchDateE || "1-1-2900";
//   try {
//     let data = await CustomersModel
//       .find(searchDate ? {
//         [searchDate]: {
//           $gt: searchDateS,
//           $lt: searchDateE
//         }
//       } : {})
//       .find(searchT ? { $or: [{ [searchP]: sExp }] } : {})
//       .limit(limit)
//       .skip(page * limit)
//       .sort({ [sort]: reverse })
//     res.json(data);
//   }
//   catch (err) {
//     console.log(err);
//     res.status(502).json({ err })
//   }
// })

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
          { another_phone_number: sExp },
          { country: sExp },
          { city: sExp },
          { address: sExp },
          { email: sExp },
        ];
      }
    }
    let data = await CustomersModel.find(query)
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

router.get("/names",  async (req, res) => {
 try{
    let data = await CustomersModel.find({},{name:1,identity:1})
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }
})

router.get("/single/:id", auth, async (req, res) => {
  try {
    let worker = await CustomersModel.findOne({ _id: req.params.id }, { password: 0 });
    res.json(worker);
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }
})

router.get("/count",auth, async (req, res) => {
  let perPage = req.query.limit;
  try {
    let data = await CustomersModel.countDocuments(perPage);
    res.json({ count: data, pages: Math.ceil(data / perPage) })
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }
})

router.post("/", auth, async (req, res) => {
  let validBody = validateCustomers(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let customer = new CustomersModel(req.body);
    customer.added_by = req.tokenData._id;
    await customer.save();

    res.json(customer);
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
  let validBody = validateCustomers(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let id = req.params.id;
    let data;
    data = await CustomersModel.updateOne({ _id: id }, req.body);
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
    data = await CustomersModel.deleteOne({ _id: id });
    res.json(data);

  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }
})

module.exports = router;