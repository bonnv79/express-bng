const express = require("express");
const { handleSuccess, handleError } = require("./utils");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    handleSuccess(res, { message: "Express and MongoDB" });
  } catch (error) {
    handleError(res, { message: 'Server error' });
  }
});

module.exports = router;
