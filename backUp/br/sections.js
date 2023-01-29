const express = require("express");
const { auth } = require("../../middlewares/auth");
const { SectionModel, validateSection } = require("../bm/sectionModel")
const router = express.Router();

router.get("/", async (req, res) => {
  res.json({ msg: "Sections work" });
})

// auth -> פונקציית אמצע שבודקת את הטוקן ומפענחת אותו
// במיוחד את האיי די שבתוכו
router.post("/", auth, async (req, res) => {
  let validBody = validateSection(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let section = new SectionModel(req.body);
    // הוספת איי די לרשומה של המשתמש שיצר אותו מהטוקן
    section.user_id = req.tokenData._id;
    await section.save();
    res.status(201).json(section);
  }
  catch (err) {
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
    if (req.decodeToken.role == "admin") {
      data = await SectionModel.updateOne({ _id: id }, req.body);
      res.json(data);
    } else {
      data = await SectionModel.updateOne({ _id: id, user_id: req.tokenData._id }, req.body);
      res.json(data);
    }
    // הוספנו גם בשאילתא שיוזר איי די צריך להיות שווה לאיי די 
    // בטוקן ככה שמשתמש א' לא יוכל בטעות לערוך למשתמש ב' את הרשומה

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
    if (req.decodeToken.role == "admin") {
      data = await SectionModel.deleteOne({ _id: id });
      res.json(data);
    } else {
      data = await SectionModel.deleteOne({ _id: id, user_id: req.tokenData._id });
      res.json(data);
    }
    // הוספנו גם בשאילתא שיוזר איי די צריך להיות שווה לאיי די 
    // בטוקן ככה שמשתמש א' לא יוכל בטעות למחוק למשתמש ב' את הרשומה

  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }
})


module.exports = router;