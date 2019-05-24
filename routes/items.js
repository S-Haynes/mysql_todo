const express = require("express");
const router = express.Router();
const db = require("../database");

router.post("/", (req, res) => {
  const { name, price } = req.body;
  const item = {
    item_name: name,
    price: price
  };

  db.query("INSERT INTO item SET ?", item, (err, results, fields) => {
    if (error) throw error;
    return res.status(200).json(item);
  });
});

module.exports = router;
