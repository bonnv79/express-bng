const express = require("express");
const router = express.Router();

const PORT = process.env.PORT;

/**
 * GET product list.
 *
 * @return product list | empty.
 */
router.get("/", async (req, res) => {
  try {
    res.set('Access-Control-Allow-Origin', '*');

    res.send({
      status: 200,
      message: "Get data has successfully",
      data: [{ id: 1, name: 'hello world' }],
      version: '1.0.2',
      PORT
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error" + PORT);
  }
});

module.exports = router;
