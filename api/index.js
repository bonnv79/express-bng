const express = require("express");
const { getVersion } = require("./utils");
const router = express.Router();

const version = getVersion();

/**
 * GET product list.
 *
 * @return product list | empty.
 */
router.get("/", async (req, res) => {
  try {
    res.send({
      status: 200,
      message: "Get data has successfully",
      version
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
