const express = require("express");
require("dotenv").config();

const app = express();
const cors = require("cors");
const product = require("./api/product");
const index = require("./api");
const { clientPromise } = require("./db/mongodb");
const PORT = process.env.PORT || 8080;

app.use(express.json({ extended: false }));
app.use("/api/product", product);
app.use("/", index);
app.use(cors());

app.listen(PORT, async () => {
  try {
    await clientPromise;
    console.log('Connected Mongodb');
  } catch (err) {
    console.error(err);
  }

  console.log(`Server is running in port ${PORT}`);
});
