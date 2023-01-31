const express = require("express");
require("dotenv").config();

const app = express();
const cors = require("cors");
const record = require("./api/record");
const item = require("./api/item");
const index = require("./api");
const { clientPromise } = require("./db/mongodb");
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json({ extended: false }));
app.use("/api", record);
app.use("/api", item);
app.use("/", index);

app.listen(PORT, async () => {
  try {
    await clientPromise;
    console.log('Connected Mongodb');
  } catch (err) {
    console.error(err);
  }

  console.log(`Server is running in port ${PORT}`);
});
