const express = require("express");
const router = express.Router();
const { connectToDatabase } = require("../db/mongodb");
const ObjectId = require("mongodb").ObjectId;

// const { getVersion } = require("./utils");
// const version = getVersion();

// router.get("/", async (req, res) => {
//   try {
//     let { db } = await connectToDatabase();
//     const data = await db
//       .collection('records')
//       .aggregate([
//         { $match: {} }
//       ])
//       .toArray();

//     res.send({
//       status: 200,
//       message: "Get data has successfully",
//       version,
//       data
//     });

//   } catch (error) {
//     console.error(error);
//     return res.status(500).send({
//       status: 500,
//       message: 'Server error',
//       version,
//       error
//     });
//   }
// });

router.route("/record").get(async (req, res) => {
  const { db } = await connectToDatabase();
  db
    .collection("records")
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

router.route("/record/:id").get(async (req, res) => {
  const { db } = await connectToDatabase();
  db
    .collection("records")
    .findOne({
      _id: ObjectId(req?.params?.id)
    }, (err, result) => {
      if (err) throw err;
      res.json(result);
    });
});

router.route("/record/add").post(async (req, response) => {
  const { db } = await connectToDatabase();
  let myobj = {
    name: req.body.name,
    position: req.body.position,
    level: req.body.level,
  };
  db.collection("records").insertOne(myobj, (err, res) => {
    if (err) throw err;
    response.json(res);
  });
});

router.route("/record/update/:id").post(async (req, response) => {
  const { db } = await connectToDatabase();
  let myquery = { _id: ObjectId(req.params.id) };
  let newvalues = {
    $set: {
      name: req.body.name,
      position: req.body.position,
      level: req.body.level,
    },
  };
  db
    .collection("records")
    .updateOne(myquery, newvalues, (err, res) => {
      if (err) throw err;
      console.log("1 document updated");
      response.json(res);
    });
});

router.route("/record/:id").delete(async (req, response) => {
  const { db } = await connectToDatabase();
  let myquery = { _id: ObjectId(req.params.id) };
  db.collection("records").deleteOne(myquery, (err, obj) => {
    if (err) throw err;
    console.log("1 document deleted");
    response.json(obj);
  });
});

module.exports = router;
