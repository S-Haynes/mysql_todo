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
    if (err) throw err;
    return res.status(200).json(item);
  });
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;

  const q = `DELETE FROM item WHERE item.id = ${id}`;

  db.query(q, (err, results, fields) => {
    if (err) throw err;
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "item not found" });
    }

    return res.status(200).json({ msg: "item deleted" });
  });
});

router.put("/:id", (req, res) => {
  const id = req.params.id;
  const { name } = req.body;

  db.query(
    "UPDATE item SET item_name = ? WHERE item.id = ?",
    [name, id],
    (err, results, fields) => {
      if (err) throw err;
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "item not found" });
      }

      return res.status(200).json({ msg: "item updated" });
    }
  );
});

router.get("/search", (req, res) => {
  const { term } = req.query;

  db.query(
    "SELECT * FROM item WHERE item_name LIKE ?",
    ["%" + term + "%"],
    (err, results, fields) => {
      if (err) throw err;
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "items not found" });
      }

      return res.status(200).json({ items: results });
    }
  );
});

router.get("/all", (req, res) => {
  db.query("SELECT * from item", (err, results, fields) => {
    if (err) throw err;

    return res.status(200).json({ items: results });
  });
});

module.exports = router;
