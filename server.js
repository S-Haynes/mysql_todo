require("dotenv").config();

const express = require("express");
const app = express();
const db = require("./database");
const itemRoutes = require("./routes/items");

// parse req body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// db connection
db.connect(err => {
  if (err) {
    console.log(err);
    return;
  }
  console.log("db connected...");
});

// routes
app.use("/api/items", itemRoutes);

const port = process.env.PORT || 5000;

app.listen(port, console.log("server started on port " + port));
