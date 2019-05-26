const express = require("express");
const router = express.Router();
const db = require("../database");
const faker = require("faker");

// Create an item
router.post("/", (req, res) => {
  const { name, price } = req.body;
  const item = {
    item_name: name,
    price: price
  };

  db.query("INSERT INTO item SET ?", item, (err, results, fields) => {
    if (err) throw err;

    return res.status(200).json({ ...item, id: results.insertId });
  });
});

// Delete an item
router.delete("/:id", (req, res) => {
  const id = req.params.id;

  const q = `DELETE FROM item WHERE item.id = ${id}`;

  db.query(q, (err, results, fields) => {
    if (err) throw err;
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Item not found." });
    }

    return res.status(200).json({ msg: "Item successfully deleted." });
  });
});

// Update an item
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

// Search for matching items
router.get("/search", (req, res) => {
  const { term } = req.query;

  db.query(
    "SELECT * FROM item WHERE item_name LIKE ? LIMIT 10",
    ["%" + term + "%"],
    (err, results, fields) => {
      if (err) throw err;
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "no items found" });
      }

      return res.status(200).json(results);
    }
  );
});

// Get all items
router.get("/all", (req, res) => {
  db.query("SELECT * from item LIMIT 10", (err, results, fields) => {
    if (err) throw err;

    return res.status(200).json(results);
  });
});

//seed db
// router.get("/seed", (req, res) => {
//   for (let i = 0; i < 500; i++) {
//     const item = {
//       item_name: faker.commerce.productName(),
//       price: faker.commerce.price()
//     };

//     db.query("INSERT INTO item SET ?", [item], (err, results) => {
//       if (err) {
//         console.log(err);
//         return;
//       }
//     });
//   }

//   res.send("seeding...");
// });

module.exports = router;
