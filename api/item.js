const express = require("express");
const router = express.Router();
const { connectToDatabase } = require("../db/mongodb");
const { handleSuccess } = require("./utils");
const ObjectId = require("mongodb").ObjectId;

const collectionName = 'items';
const rootPath = '/item';

// get all item
router.route(`${rootPath}s`).get(async (req, res) => {
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
router.route(`${rootPath}`).get(async (req, res) => {
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
            { _id: { '$regex': search || '', '$options': 'i' } },
            { name: { '$regex': search || '', '$options': 'i' } },
            { title: { '$regex': search || '', '$options': 'i' } },
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
router.route(`${rootPath}/:id`).get(async (req, res) => {
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
router.route(`${rootPath}/add`).post(async (req, res) => {
  const { db } = await connectToDatabase();
  const currentDate = new Date();
  let myobj = {
    ...req.body,
    createDate: currentDate,
    updateDate: currentDate,
  };
  db.collection(collectionName).insertOne(myobj, (err, data) => {
    if (err) throw err;
    handleSuccess(res, { data });
  });
});

// update item
router.route(`${rootPath}/update/:id`).post(async (req, res) => {
  const { db } = await connectToDatabase();
  let myquery = { _id: ObjectId(req.params.id) };
  const currentDate = new Date();
  let newvalues = {
    $set: {
      ...req.body,
      updateDate: currentDate,
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
router.route(`${rootPath}/:id`).delete(async (req, res) => {
  const { db } = await connectToDatabase();
  let myquery = { _id: ObjectId(req.params.id) };
  db.collection(collectionName).deleteOne(myquery, (err, data) => {
    if (err) throw err;
    handleSuccess(res, { data, message: '1 document deleted' });
  });
});

module.exports = router;
