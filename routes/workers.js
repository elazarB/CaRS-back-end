const express = require("express");
const bcrypt = require("bcrypt");
const { auth, authAdmin } = require("../middlewares/auth")
const { WorkerModel, validateWorker, validateLogin, createToken, validateRoleChange } = require("../models/workerModel")

const router = express.Router();

// מאזין לכניסה לראוט של העמוד בית לפי מה שנקבע לראוטר
// בקובץ הקונפיג
router.get("/", async (req, res) => {
  res.json({ msg: "Workers work" });
})



// מחזיר למשתמש את הפרטים שלו
router.get("/workerInfo", auth, async (req, res) => {
  try {
    let worker = await WorkerModel.findOne({ _id: req.tokenData._id }, { password: 0 });
    res.json(worker);
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }
})

router.get("/single/:id", auth, async (req, res) => {
  try {
    let worker = await WorkerModel.findOne({ _id: req.params.id }, { password: 0 });
    res.json(worker);
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }
})

router.get("/allWorker", authAdmin, async (req, res) => {
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
    let data = await WorkerModel
      .find(searchDate ? {
        [searchDate]: {
          $gt: searchDateS,
          $lt: searchDateE
        }
      } : {})
      .find(searchT ? { $or: [{ [searchP]: sExp }] } : {},{password:0})
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

// sign up
router.post("/",  async (req, res) => {
  let validBody = validateWorker(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let user = new WorkerModel(req.body);
    // להצפין את הסיסמא במסד עם מודול ביקריפט
    // 10 -> רמת הצפנה
    user.password = await bcrypt.hash(user.password, 10);
    await user.save();
    // להסתיר את ההצפנה לצד לקוח
    user.password = "******"
    res.json(user);
  }
  catch (err) {
    if (err.code == 11000) {
      return res.status(400).json({ msg: "user name already in system", code: 11000 })
    }
    console.log(err);
    res.status(502).json({ err })
  }
})

router.post("/logIn", async (req, res) => {
  let validBody = validateLogin(req.body);
  if (validBody.error) {
    return res.json(validBody.error.details);
  }
  try {
    // לבדוק אם בכלל יש רשומה עם המייל שנשלח
    let user = await WorkerModel.findOne({ user_name: req.body.user_name })
    if (!user) {
      return res.json({ msg: "Information problem" })
    }
    // לבדוק אם הרשומה שנמצאה הסיסמא המוצפנות בתוכה מתאימה 
    let validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      return res.json({ msg: "Information problem" })
    }
    if(user.role == "pending" || user.role == "dormant"){
      return res.json({ msg: "Exists and without permission" })
    }

    // לשלוח טוקן
    let token = createToken(user._id, user.role,)
    
    res.json({ token })
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }
})

router.put("/:id", auth, async (req, res) => {
  let validBody = validateWorker(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let id = req.params.id;
    let data= await WorkerModel.updateOne({ _id: req.tokenData._id }, req.body);
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }
})

router.patch("/:id", authAdmin, async (req, res) => {
  try {
    let role ;
    
    let _id = req.params.id;
    // let role = req.params.role;
    const user = await WorkerModel.findOne({_id})
    role = req.body.role  
    // if(user.role == "user"){
    //   role = "admin"
    // }
    
    let data = await WorkerModel.updateOne({ _id: _id },{role:role});
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
    let data = await WorkerModel.deleteOne({ _id: id });
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }
})



module.exports = router;
