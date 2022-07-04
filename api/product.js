const express = require("express");
const router = express.Router();

const dbo = require("../db/connect");

/**
 * GET product list.
 *
 * @return product list | empty.
 */
router.get("/", async (req, res) => {
  try {
    res.set('Access-Control-Allow-Origin', '*');

    let db = dbo.getDb("react-mongodb-bng-dev");
    const data = await db
      .collection('records')
      .aggregate([
        { $match: {} }
      ])
      .toArray();

    // const data = await db_connect.collection("records").find({}).toArray();

    res.send({
      status: 200,
      message: "Get data has successfully",
      version: '1.0.2',
      data
    });

  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
});

module.exports = router;
