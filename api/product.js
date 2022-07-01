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

    let db_connect = dbo.getDb("react-mongodb-bng-dev");
    db_connect
      .collection("records")
      .find({})
      .toArray(function (err, result) {
        if (err) throw err;
        res.json({
          status: 200,
          message: "Get data has successfully",
          data: result,
          version: '1.0.1'
        });
      });

    // res.send({
    //   status: 200,
    //   message: "Get data has successfully",
    //   data: [{ id: 1, name: 'hello world' }],
    //   version: '1.0.0'
    // });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
});

module.exports = router;
