const express = require("express");
const router = express.Router();
const { connectToDatabase } = require("../db/mongodb");
const { handleSuccess } = require("./utils");
const ObjectId = require("mongodb").ObjectId;

const collectionName = 'records';

router.route("/record").get(async (req, res) => {
  const { db } = await connectToDatabase();
  db
    .collection(collectionName)
    .find({})
    .sort({ _id: -1 })
    .toArray(function (err, data) {
      if (err) throw err;
      handleSuccess(res, { data });
    });
});

router.route("/record/:id").get(async (req, res) => {
  const { db } = await connectToDatabase();
  db
    .collection(collectionName)
    .findOne({
      _id: ObjectId(req?.params?.id)
    }, (err, data) => {
      if (err) throw err;
      handleSuccess(res, { data });
    });
});

router.route("/record/add").post(async (req, res) => {
  const { db } = await connectToDatabase();
  let myobj = {
    name: req.body.name,
    position: req.body.position,
    level: req.body.level,
  };
  db.collection(collectionName).insertOne(myobj, (err, data) => {
    if (err) throw err;
    handleSuccess(res, { data });
  });
});

router.route("/record/update/:id").post(async (req, res) => {
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
    .collection(collectionName)
    .updateOne(myquery, newvalues, (err, data) => {
      if (err) throw err;
      handleSuccess(res, { data, message: '1 document updated' });
    });
});

router.route("/record/:id").delete(async (req, res) => {
  const { db } = await connectToDatabase();
  let myquery = { _id: ObjectId(req.params.id) };
  db.collection(collectionName).deleteOne(myquery, (err, data) => {
    if (err) throw err;
    handleSuccess(res, { data, message: '1 document deleted' });
  });
});

module.exports = router;
