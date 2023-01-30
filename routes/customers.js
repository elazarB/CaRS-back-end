const express = require("express");
const { CustomersModel, validateCustomers } = require("../models/customersModel");
const { auth } = require("../middlewares/auth");


const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    let customers = await CustomersModel.find({})
    res.json(customers)
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
  let validBody = validateSection(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let id = req.params.id;
    let data;

    data = await SectionModel.updateOne({ _id: id }, req.body);

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
    data = await WorkerModel.deleteOne({ _id: id });
    res.json(data);

  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }
})

module.exports = router;