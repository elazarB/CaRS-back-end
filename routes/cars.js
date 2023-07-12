const express = require("express");
const { CarsModel, validateCars } = require("../models/carsModel");
const { auth } = require("../middlewares/auth");
const { number } = require("joi");
const axios = require('axios');

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
        // if (searchP == "km" ||  searchP == "deductible") {
        //   Number(searchT)
        //   query["$or"] = [{ [searchP]: { $eq: searchT } }];
        // } else {
          query["$or"] = [{ [searchP]: sExp }];
        // }
      } else {
        // let num = Number(searchT) != NaN?Number(searchT):"";
        query["$or"] = [
          { license_number: sExp },
          { manufacturer_en: sExp },
          { manufacturer_hb: sExp },
          { model_en: sExp },
          { model_hb: sExp },
          { color: sExp },
          { status: sExp },
          { branch: sExp },
          { fuel_type: sExp },
          { class: sExp },
          { gearbox: sExp },
          { year: sExp },
        ];
        if( Number(searchT)){
          query["$or"] = [
            { km: { $eq: Number(searchT) } },
          { deductible: { $eq: Number(searchT) } }
          ]
        }

      }
    }
    
    let data = await CarsModel.find(query)
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
     let data = await CarsModel.find({status:'פנוי'},{manufacturer_hb:1,model_hb:1,class:1})
     res.json(data);
   }
   catch (err) {
     console.log(err);
     res.status(502).json({ err })
   }
 })

router.get("/graph", auth, async (req, res) => {
  try{
    let data = await CarsModel.aggregate([
     { $group: {_id: "$status", y: { $sum: 1 } } }
   ]);
   res.json(data);
 }
 catch (err) {
   console.log(err);
   res.status(502).json({ err });
 }
})

router.get("/single/:id", auth, async (req, res) => {
  try {
    let worker = await CarsModel.findOne({ _id: req.params.id }, { password: 0 });
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
    let data = await CarsModel.countDocuments(perPage);
    res.json({ count: data, pages: Math.ceil(data / perPage) })
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }
})

router.get("/location/:licenseN", async (req, res) => {
  const licenseN = req.params.licenseN
  
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `https://www.ituran.com/ituranwebservice3/Service3.asmx/GetPlatformData_JSON?UserName=%D7%A9%D7%97%D7%A0%D7%A8%20%D7%9E%D7%95%D7%98%D7%95%D7%A8%D7%A11&Password=api@API123&Plate=${licenseN}&ShowAreas=True&ShowStatuses=True&ShowMileageInMeters=true&ShowDriver=false`,
    headers: { 
      'Cookie': 'GCLB=CLKd_Ljdwq2o1QE; MOBILESRV=a4-h'
    }
  };
  
  axios.request(config)
  .then((response) => {
    res.json({data:response.data})
    console.log(JSON.stringify(response.data));
  })
  .catch((error) => {
    console.log(error);
  });
  
}) 

router.post("/", auth, async (req, res) => {
  let validBody = validateCars(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let cars = new CarsModel(req.body);
    cars.added_by = req.tokenData._id;
   
    await cars.save();
    res.json(cars);
  }
  catch (err) {
    if (err.code == 11000) {
      return res.status(11000).json({ msg: "license number already in system", code: 11000 })
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
    let data = await CarsModel.updateOne({ _id: id }, req.body);
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
    data = await CarsModel.deleteOne({ _id: id });
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }
})

module.exports = router;