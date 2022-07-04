const express = require("express");
const router = express.Router();
const { connectToDatabase } = require("../db/mongodb");
const { getVersion } = require("./utils");

const version = getVersion();

/**
 * GET product list.
 *
 * @return product list | empty.
 */
router.get("/", async (req, res) => {
  try {
    res.set('Access-Control-Allow-Origin', '*');

    let { db } = await connectToDatabase();
    const data = await db
      .collection('records')
      .aggregate([
        { $match: {} }
      ])
      .toArray();

    res.send({
      status: 200,
      message: "Get data has successfully",
      version,
      data
    });

  } catch (error) {
    console.error(error);
    return res.status(500).send({
      status: 500,
      message: 'Server error',
      version,
      error
    });
  }
});

module.exports = router;
