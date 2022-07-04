const express = require("express");
require("dotenv").config();

const app = express();
const cors = require("cors");
const product = require("./api/product");
const index = require("./api");
const PORT = process.env.PORT || 8080;

app.use(express.json({ extended: false }));
app.use("/api/product", product);
app.use("/", index);
app.use(cors());

// const dbo = require("./db/connect");

app.listen(PORT, () => {
  // dbo.connectToServer(function (err) {
  //   if (err) {
  //     console.error(err);
  //   } else {
  //     console.log('Connected Mongodb');
  //   }
  // });

  console.log(`Server is running in port ${PORT}`);
});
