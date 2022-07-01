const express = require("express");
const router = express.Router();

/**
 * GET product list.
 *
 * @return product list | empty.
 */
router.get("/", async (req, res) => {
  try {
    res.json({
      status: 200,
      message: "Get data has successfully",
      data: [{ id: 1, name: 'hello world' }],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
});

module.exports = router;
