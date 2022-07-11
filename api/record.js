const express = require("express");
const router = express.Router();
const { connectToDatabase } = require("../db/mongodb");
const { handleSuccess } = require("./utils");
const ObjectId = require("mongodb").ObjectId;

const collectionName = 'records';

// get all item
router.route("/records").get(async (req, res) => {
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

// get item by page and page size
router.route("/record").get(async (req, res) => {
  const { query = {} } = req || {};
  const page = Number(query?.page || 0);
  const pageSize = Number(query?.pageSize || 10);
  const search = query?.search || '';

  const { db } = await connectToDatabase();

  db
    .collection(collectionName)
    .aggregate([
      {
        $match: {
          $or: [
            { name: { '$regex': search || '', '$options': 'i' } },
          ]
        },
      },
      { $sort: { _id: -1 } },
      { $project: { password: 0 } },
      {
        $facet: {
          metadata: [
            { $count: "total" },
            { $addFields: { page, pageSize } }
          ],
          data: [
            { $skip: page * pageSize },
            { $limit: pageSize }
          ]
        }
      }
    ])
    .toArray(function (err, resJson) {
      if (err) throw err;
      const { data, metadata } = resJson?.[0] || {};

      handleSuccess(res, { ...(metadata?.[0] || {}), data: data || [] });
    });
});

// get item by id
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

// add new item
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

// update item
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

// delete item
router.route("/record/:id").delete(async (req, res) => {
  const { db } = await connectToDatabase();
  let myquery = { _id: ObjectId(req.params.id) };
  db.collection(collectionName).deleteOne(myquery, (err, data) => {
    if (err) throw err;
    handleSuccess(res, { data, message: '1 document deleted' });
  });
});

module.exports = router;
